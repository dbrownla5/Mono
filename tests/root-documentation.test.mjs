// Tests for the top-level doctrine docs added in this PR:
//   README.md, PROCESS.md, INDEX.md, START-HERE.md
//
// These tests focus on structural invariants and cross-file references
// (e.g. does PROCESS.md point at agent files that actually exist, do the
// INDEX.md summary counts match the actual table rows) rather than prose.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readRepoFile, repoFileExists } from './helpers.mjs';

describe('README.md', () => {
  const content = readRepoFile('README.md');

  test('is non-empty (regression: repo previously had only a one-line stub README)', () => {
    assert.ok(content.trim().length > 200, 'README should contain real documentation, not a stub');
  });

  test('documents exactly five numbered ground rules', () => {
    const groundRulesSection = content.split('## The ground rules')[1].split('## How')[0];
    const rules = [...groundRulesSection.matchAll(/^\d+\.\s\*\*/gm)];
    assert.equal(rules.length, 5);
  });

  test("directory tree references INDEX.md, _incoming/, and buckets/, all of which exist", () => {
    assert.match(content, /INDEX\.md/);
    assert.match(content, /_incoming\//);
    assert.match(content, /buckets\//);
    assert.equal(repoFileExists('INDEX.md'), true);
    assert.equal(repoFileExists('_incoming'), true);
    assert.equal(repoFileExists('buckets'), true);
  });

  test('lists the six intent buckets as children of buckets/ in the directory tree', () => {
    const treeSection = content.split('## How')[1].split('## The process')[0];
    for (const bucket of [
      'commerce-workflow',
      'well-lived-citizen',
      'brand-studio',
      'business-agent',
      'dev-tooling',
      'reference',
    ]) {
      assert.ok(treeSection.includes(`${bucket}/`), `directory tree missing bucket "${bucket}/"`);
    }
  });

  test('closing process section points readers at INDEX.md', () => {
    assert.match(content, /See `INDEX\.md` for where we are\./);
  });
});

describe('PROCESS.md', () => {
  const content = readRepoFile('PROCESS.md');

  test('states the single core principle: add nothing, only move what exists', () => {
    assert.match(content, /\*\*We ADD nothing\. We only MOVE what already exists\.\*\*/);
  });

  test('defines exactly the 4 named groups, in order', () => {
    const groupsSection = content.split('## The 4 groups')[1].split('## The loop')[0];
    const groups = [...groupsSection.matchAll(/^\d+\.\s\*\*([\w-]+)\*\*/gm)].map((m) => m[1]);
    assert.deepEqual(groups, ['well-lived-citizen', 'commerce-workflow', 'tooling', 'reference']);
  });

  test('defines exactly 8 numbered guardrails', () => {
    const guardrailsSection = content.split('## The guardrails')[1].split('The spawnable agents:')[0];
    const guardrails = [...guardrailsSection.matchAll(/^\d+\.\s\*\*/gm)];
    assert.equal(guardrails.length, 8);
  });

  test('describes all four phases of the loop (INGEST, EXTRACT, AUDIT, ASSEMBLE)', () => {
    for (const phase of ['Phase 1 — INGEST', 'Phase 2 — EXTRACT', 'Phase 3 — AUDIT', 'Phase 4 — ASSEMBLE']) {
      assert.ok(content.includes(phase), `missing phase heading: ${phase}`);
    }
  });

  test('lists the three spawnable agents by relative path, and each path resolves on disk', () => {
    const agentPaths = [...content.matchAll(/`(\.claude\/agents\/[\w-]+\.md)`/g)].map((m) => m[1]);
    assert.deepEqual(
      agentPaths.sort(),
      ['.claude/agents/conflict-reconciler.md', '.claude/agents/dayna-voice-auditor.md', '.claude/agents/repo-extractor.md'].sort(),
    );
    for (const relPath of agentPaths) {
      assert.equal(repoFileExists(relPath), true, `${relPath} should exist`);
    }
  });

  test('names INDEX.md as the queue, and INDEX.md exists', () => {
    assert.match(content, /The queue is `INDEX\.md`/);
    assert.equal(repoFileExists('INDEX.md'), true);
  });
});

describe('INDEX.md', () => {
  const content = readRepoFile('INDEX.md');

  function tableRows() {
    return [...content.matchAll(/^\|\s*(⬜|🟡|✅|⏭️)\s*\|\s*`([^`]+)`/gm)];
  }

  test('declares the tracker totals in its summary line', () => {
    assert.match(content, /_37 source repos · 3 reviewed · 34 remaining_/);
  });

  test('the actual number of repo rows across all tables equals the declared total (37)', () => {
    assert.equal(tableRows().length, 37);
  });

  test('the number of rows marked ✅ matches the declared "3 reviewed"', () => {
    const reviewed = tableRows().filter(([, status]) => status === '✅');
    assert.equal(reviewed.length, 3);
  });

  test('the number of rows not marked ✅ matches the declared "34 remaining"', () => {
    const remaining = tableRows().filter(([, status]) => status !== '✅');
    assert.equal(remaining.length, 34);
  });

  test('repo names are unique across the whole tracker (no repo listed twice)', () => {
    const names = tableRows().map(([, , name]) => name);
    assert.equal(new Set(names).size, names.length);
  });

  test('the status legend documents every symbol actually used in the tables', () => {
    const usedSymbols = new Set(tableRows().map(([, status]) => status));
    for (const symbol of usedSymbols) {
      assert.ok(content.includes(symbol), `status key should document ${symbol}`);
    }
    assert.match(content, /⬜ not reviewed/);
    assert.match(content, /🟡 in progress/);
    assert.match(content, /✅ extracted/);
    assert.match(content, /⏭️ skipped/);
  });

  test('every ✅ or ⏭️ row carries a non-empty status note explaining why', () => {
    const rows = [...content.matchAll(/^\|\s*(✅|⏭️)\s*\|\s*`([^`]+)`\s*\|[^|]*\|\s*([^|]*)\|\s*$/gm)];
    assert.ok(rows.length >= 4, 'expected at least the 3 extracted + 1 skipped rows');
    for (const [, , repo, notes] of rows) {
      assert.ok(notes.trim().length > 0, `${repo} should have a non-empty note`);
    }
  });

  test('suggested order of attack references known bucket names from PROCESS.md', () => {
    assert.match(content, /## Suggested order of attack/);
    assert.match(content, /commerce-workflow/);
    assert.match(content, /well-lived-citizen/);
  });
});

describe('START-HERE.md', () => {
  const content = readRepoFile('START-HERE.md');

  test('recommends reading README, PROCESS, and INDEX in that order, and each file exists', () => {
    const order = [...content.matchAll(/^\d+\.\s`([\w.-]+)`/gm)].map((m) => m[1]);
    assert.deepEqual(order, ['README.md', 'PROCESS.md', 'INDEX.md']);
    for (const file of order) {
      assert.equal(repoFileExists(file), true, `${file} should exist`);
    }
  });

  test('states the one rule above all others verbatim', () => {
    assert.match(content, /\*\*Move what exists\. Invent nothing\.\*\*/);
  });

  test('does not leak private context into the public doc (points elsewhere instead)', () => {
    assert.match(content, /kept\s*\n?\*\*private\*\*, on purpose/);
    assert.match(content, /`DESKTOP-SETUP-HANDOFF\.md`/);
    assert.doesNotMatch(content, /\b(password|api[- ]?key|secret|ssh key)\b/i);
  });
});