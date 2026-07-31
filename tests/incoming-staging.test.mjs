// Tests for the _incoming/ staging area introduced by this PR:
//   - _incoming/README.md (the staging-area contract)
//   - _incoming/Dashboard-/{INVENTORY,KEPT,LEFT-BEHIND}.md + staged content
//   - _incoming/for_referencev5.1/{INVENTORY,KEPT,LEFT-BEHIND}.md + staged
//     agents-memory content
//
// These tests check the documents' internal consistency (do KEPT/LEFT-BEHIND
// actually match what's on disk) and cross-file cross-references.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readRepoFile, repoFileExists, parseFrontmatter } from './helpers.mjs';

describe('_incoming/README.md', () => {
  const content = readRepoFile('_incoming', 'README.md');

  test('explains the staging contract: nothing here is final', () => {
    assert.match(content, /Nothing here is final/);
    assert.match(content, /_incoming\/<repo-name>\//);
  });

  test('ends with the "pulled out, not yet sorted" rule of thumb', () => {
    assert.match(content, /pulled out, not yet sorted/);
  });
});

describe('_incoming/Dashboard- staging docs', () => {
  const inventory = readRepoFile('_incoming', 'Dashboard-', 'INVENTORY.md');
  const kept = readRepoFile('_incoming', 'Dashboard-', 'KEPT.md');
  const leftBehind = readRepoFile('_incoming', 'Dashboard-', 'LEFT-BEHIND.md');

  test('each doc opens with the expected "TITLE — Dashboard-" heading', () => {
    assert.match(inventory, /^# INVENTORY — Dashboard-\s*$/m);
    assert.match(kept, /^# KEPT — Dashboard-\s*$/m);
    assert.match(leftBehind, /^# LEFT BEHIND — Dashboard-\s*$/m);
  });

  test('flags the Google Gemini / AI Studio cloud dependency consistently in INVENTORY and KEPT', () => {
    assert.match(inventory, /Google AI Studio|Gemini/);
    assert.match(kept, /Google Gemini/);
  });

  test('every file KEPT.md claims was staged into content/ actually exists on disk', () => {
    const stagedFiles = [
      ['content', 'references', 'cross_platform_template.md'],
      ['content', 'outputs', 'session_summary.md'],
      ['content', 'outputs', 'manus_build_directive.md'],
      ['content', 'AGENTS.md'],
    ];
    for (const segments of stagedFiles) {
      assert.equal(repoFileExists('_incoming', 'Dashboard-', ...segments), true, `expected ${segments.join('/')} to be staged`);
    }
  });

  test('every path LEFT-BEHIND.md lists was NOT staged into _incoming/Dashboard-', () => {
    const leftOut = [
      ['src'],
      ['server.ts'],
      ['vite.config.ts'],
      ['index.html'],
      ['package.json'],
      ['metadata.json'],
    ];
    for (const segments of leftOut) {
      assert.equal(repoFileExists('_incoming', 'Dashboard-', ...segments), false, `${segments.join('/')} should not have been staged`);
    }
  });

  test('KEPT.md and LEFT-BEHIND.md agree that nothing has moved into buckets/ yet', () => {
    assert.match(kept, /Nothing moved to a group yet/);
    assert.doesNotMatch(kept, /moved (into|to) `?buckets\//);
  });

  test('LEFT-BEHIND.md documents the redaction applied before staging session_summary.md', () => {
    assert.match(leftBehind, /personal phone number and personal\s*\n?email redacted/);
  });
});

describe('_incoming/Dashboard-/content files', () => {
  test('AGENTS.md defines hallucination guardrails banning "Elder Care" as a category', () => {
    const content = readRepoFile('_incoming', 'Dashboard-', 'content', 'AGENTS.md');
    assert.match(content, /HALLUCINATION GUARDRAILS/);
    assert.match(content, /NO "Elder Care"/);
  });

  test('content/README.md documents the Gemini API key requirement and run instructions', () => {
    const content = readRepoFile('_incoming', 'Dashboard-', 'content', 'README.md');
    assert.match(content, /GEMINI_API_KEY/);
    assert.match(content, /npm install/);
    assert.match(content, /npm run dev/);
  });

  test('manus_build_directive.md defines all four DOORs with pricing', () => {
    const content = readRepoFile('_incoming', 'Dashboard-', 'content', 'outputs', 'manus_build_directive.md');
    for (const door of ['DOOR 1: THE RESET', 'DOOR 2: THE RECORD', 'DOOR 3: THE ROUTINE', 'DOOR 4: THE RELEASE']) {
      assert.ok(content.includes(door), `missing ${door}`);
    }
    assert.match(content, /\$150 \/ hr \(3-hour minimum\)/);
  });

  describe('session_summary.md redaction', () => {
    const content = readRepoFile('_incoming', 'Dashboard-', 'content', 'outputs', 'session_summary.md');

    test('the DECISION LOCK phone and email lines use the redaction placeholder', () => {
      assert.match(
        content,
        /\[LOCKED\] Phone: \[REDACTED — business \+ personal numbers; kept private, not in this public repo\]/,
      );
      assert.match(content, /\[LOCKED\] Redirect \[REDACTED — personal email\] \(Squarespace\) to main site\./);
    });

    test('regression: no unredacted phone number leaks anywhere else in the staged file', () => {
      // KEPT.md and LEFT-BEHIND.md both assert the personal phone/email were
      // redacted from this file before staging it into the public repo. This
      // guards against a raw phone number slipping through elsewhere in the
      // same document (e.g. inside a later voice-dump transcript section).
      const phonePattern = /\(\d{3}\)\s?\d{3}-\d{4}/;
      assert.doesNotMatch(content, phonePattern);
    });
  });

  test('cross_platform_template.md carries a pasteable handoff block with the known AI failure patterns', () => {
    const content = readRepoFile('_incoming', 'Dashboard-', 'content', 'references', 'cross_platform_template.md');
    assert.match(content, /PASTE THIS INTO ANY AI TO CONTINUE THE SESSION/);
    assert.match(content, /KNOWN AI FAILURE PATTERNS/);
    assert.match(content, /elder care/i);
  });

  test('the "no elder care" naming rule is consistent between AGENTS.md and the cross-platform template', () => {
    const agents = readRepoFile('_incoming', 'Dashboard-', 'content', 'AGENTS.md');
    const template = readRepoFile('_incoming', 'Dashboard-', 'content', 'references', 'cross_platform_template.md');
    assert.match(agents, /Elder Care/);
    assert.match(template, /elder care/i);
  });
});

describe('_incoming/for_referencev5.1 staging docs', () => {
  const inventory = readRepoFile('_incoming', 'for_referencev5.1', 'INVENTORY.md');
  const kept = readRepoFile('_incoming', 'for_referencev5.1', 'KEPT.md');
  const leftBehind = readRepoFile('_incoming', 'for_referencev5.1', 'LEFT-BEHIND.md');

  test('each doc opens with the expected "TITLE — for_referencev5.1" heading', () => {
    assert.match(inventory, /^# INVENTORY — for_referencev5\.1\s*$/m);
    assert.match(kept, /^# KEPT — for_referencev5\.1\s*$/m);
    assert.match(leftBehind, /^# LEFT BEHIND — for_referencev5\.1\s*$/m);
  });

  test('INVENTORY.md flags cloud/lock-in dependencies and explicitly notes no Firebase', () => {
    for (const dep of ['Supabase', 'Netlify', 'Resend', 'Replit', 'OpenAI']) {
      assert.ok(inventory.includes(dep), `expected INVENTORY.md to flag ${dep}`);
    }
    assert.match(inventory, /No Firebase found/);
  });

  test('KEPT.md and LEFT-BEHIND.md agree that nothing has been decided yet', () => {
    assert.match(kept, /Nothing has moved into a bucket yet/);
    assert.match(leftBehind, /None of the above is a verdict/);
  });

  test('KEPT.md refuses to treat any document\'s "final/master" self-label as truth', () => {
    assert.match(kept, /Only you decide which is\s*\nreal/);
    assert.match(kept, /No document wins by calling itself "final\."/);
  });

  test('the agents-memory content referenced by KEPT.md is actually staged on disk', () => {
    assert.equal(repoFileExists('_incoming', 'for_referencev5.1', 'content', 'agents-memory', 'MEMORY.md'), true);
  });

  test('LEFT-BEHIND.md explains the content-first split rationale', () => {
    assert.match(leftBehind, /content-first/);
    assert.match(leftBehind, /separate \*tools\* pass/);
  });
});

describe('_incoming/for_referencev5.1/content/agents-memory', () => {
  test('MEMORY.md is a 4-item index whose links all resolve to files in the same directory', () => {
    const content = readRepoFile('_incoming', 'for_referencev5.1', 'content', 'agents-memory', 'MEMORY.md');
    const links = [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((m) => m[1]);
    assert.equal(links.length, 4);
    for (const link of links) {
      assert.equal(
        repoFileExists('_incoming', 'for_referencev5.1', 'content', 'agents-memory', link),
        true,
        `MEMORY.md links to missing file: ${link}`,
      );
    }
  });

  test('MEMORY.md indexes both handshake-flow.md and wlc-artifact-location.md', () => {
    const content = readRepoFile('_incoming', 'for_referencev5.1', 'content', 'agents-memory', 'MEMORY.md');
    assert.match(content, /\(handshake-flow\.md\)/);
    assert.match(content, /\(wlc-artifact-location\.md\)/);
  });

  describe('handshake-flow.md', () => {
    const raw = readRepoFile('_incoming', 'for_referencev5.1', 'content', 'agents-memory', 'handshake-flow.md');
    const { data, body } = parseFrontmatter(raw);

    test('has frontmatter with a name and description', () => {
      assert.ok(data.name.length > 0);
      assert.ok(data.description.length > 0);
    });

    test('describes the LOCKED core rule: signature at intake gates the pickup', () => {
      assert.match(body, /No signature at intake = no pickup\./);
    });

    test('enumerates exactly 9 numbered steps', () => {
      const stepsSection = body.split('## The 9-Step Handshake Flow')[1].split('## What this is NOT')[0];
      const steps = [...stepsSection.matchAll(/^\d+\.\s\*\*/gm)];
      assert.equal(steps.length, 9);
    });

    test('step numbering is sequential from 1 to 9', () => {
      const stepsSection = body.split('## The 9-Step Handshake Flow')[1].split('## What this is NOT')[0];
      const numbers = [...stepsSection.matchAll(/^(\d+)\.\s\*\*/gm)].map((m) => Number(m[1]));
      assert.deepEqual(numbers, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('wlc-artifact-location.md', () => {
    const raw = readRepoFile('_incoming', 'for_referencev5.1', 'content', 'agents-memory', 'wlc-artifact-location.md');
    const { data, body } = parseFrontmatter(raw);

    test('has frontmatter with a name and description', () => {
      assert.ok(data.name.length > 0);
      assert.ok(data.description.length > 0);
    });

    test('documents the current artifact path and warns against editing the old location', () => {
      assert.match(body, /`artifacts\/wlc-site\/`/);
      assert.match(body, /`site-build\/wlc-launch\/` is the old location — do not edit it/);
    });
  });
});