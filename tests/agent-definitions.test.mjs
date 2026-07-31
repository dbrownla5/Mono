// Tests for the new .claude/agents/*.md agent definitions:
//   - conflict-reconciler.md
//   - dayna-voice-auditor.md
//   - repo-extractor.md

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readRepoFile, repoFileExists, repoPath, listDir, parseFrontmatter, splitList } from './helpers.mjs';

const AGENTS_DIR = ['.claude', 'agents'];
const AGENT_FILES = ['conflict-reconciler.md', 'dayna-voice-auditor.md', 'repo-extractor.md'];
const KNOWN_TOOLS = new Set(['Read', 'Grep', 'Glob', 'Write', 'Edit', 'Bash']);

function loadAgent(filename) {
  const raw = readRepoFile(...AGENTS_DIR, filename);
  const { data, body } = parseFrontmatter(raw);
  return { raw, data, body };
}

describe('.claude/agents directory contents', () => {
  test('contains exactly the three agent files this suite covers (no silent additions/removals)', () => {
    const dirFiles = listDir(...AGENTS_DIR)
      .filter((f) => f.endsWith('.md'))
      .sort();
    assert.deepEqual(dirFiles, [...AGENT_FILES].sort());
  });
});

describe('.claude/agents/*.md — per-file frontmatter and structure', () => {
  for (const filename of AGENT_FILES) {
    describe(filename, () => {
      test('exists on disk', () => {
        assert.equal(repoFileExists(...AGENTS_DIR, filename), true);
      });

      test('has a frontmatter block with all required keys populated', () => {
        const { data } = loadAgent(filename);
        for (const key of ['name', 'description', 'tools', 'model', 'color']) {
          assert.ok(Object.prototype.hasOwnProperty.call(data, key), `missing "${key}" key`);
          assert.notEqual(data[key], '', `"${key}" should not be empty`);
        }
      });

      test('frontmatter "name" matches the file name (without .md)', () => {
        const { data } = loadAgent(filename);
        assert.equal(data.name, filename.replace(/\.md$/, ''));
      });

      test('the H1 heading in the body matches the frontmatter name', () => {
        const { data, body } = loadAgent(filename);
        assert.match(body, new RegExp(`^# ${data.name}\\s*$`, 'm'));
      });

      test('description is a substantial, non-truncated sentence', () => {
        const { data } = loadAgent(filename);
        assert.ok(data.description.length > 40, 'description should be a meaningful sentence');
        assert.ok(/[.]$/.test(data.description.trim()), 'description should end with a period');
      });

      test('tools is a comma-separated list of known, de-duplicated tool names', () => {
        const { data } = loadAgent(filename);
        const tools = splitList(data.tools);
        assert.ok(tools.length > 0, 'tools list should not be empty');
        for (const tool of tools) {
          assert.ok(KNOWN_TOOLS.has(tool), `unexpected/unknown tool "${tool}"`);
        }
        assert.equal(new Set(tools).size, tools.length, 'tools list should not contain duplicates');
      });

      test('every agent includes the base extraction toolset (Read, Grep, Glob, Write)', () => {
        const { data } = loadAgent(filename);
        const tools = splitList(data.tools);
        for (const base of ['Read', 'Grep', 'Glob', 'Write']) {
          assert.ok(tools.includes(base), `${filename} is missing base tool "${base}"`);
        }
      });

      test('model is pinned to "inherit"', () => {
        const { data } = loadAgent(filename);
        assert.equal(data.model, 'inherit');
      });

      test('color is a single lowercase word', () => {
        const { data } = loadAgent(filename);
        assert.match(data.color, /^[a-z]+$/);
      });

      test('body tells the agent to read PROCESS.md first, and that path resolves', () => {
        const { body } = loadAgent(filename);
        assert.match(body, /Read\s+`\.\.\/\.\.\/PROCESS\.md`\s+first/);
        // .claude/agents/<file>.md -> ../../PROCESS.md === repo root PROCESS.md
        assert.equal(repoFileExists('PROCESS.md'), true);
      });

      test('body contains the standard "Hard rules" and "Output contract" sections', () => {
        const { body } = loadAgent(filename);
        assert.match(body, /^## Hard rules(?: \(.*\))?\s*$/m);
        assert.match(body, /^## Output contract$/m);
      });

      test('every agent logs conflicts to the shared claims ledger, which exists', () => {
        const { body } = loadAgent(filename);
        assert.match(body, /_audit\/CLAIMS-LEDGER\.md/);
        assert.equal(repoFileExists('_audit', 'CLAIMS-LEDGER.md'), true);
      });

      test('body does not contain unresolved markdown link/reference placeholders', () => {
        const { body } = loadAgent(filename);
        assert.doesNotMatch(body, /TODO|TBD|FIXME/i);
      });
    });
  }
});

describe('.claude/agents/*.md — cross-agent invariants', () => {
  test('each agent has a distinct color for fleet-visualization purposes', () => {
    const colors = AGENT_FILES.map((f) => loadAgent(f).data.color);
    assert.equal(new Set(colors).size, colors.length, 'agent colors should all be distinct');
  });

  test('each agent has a distinct name', () => {
    const names = AGENT_FILES.map((f) => loadAgent(f).data.name);
    assert.equal(new Set(names).size, names.length);
  });

  test('repo-extractor is the only agent granted Bash (it must clone repos)', () => {
    const withBash = AGENT_FILES.filter((f) => splitList(loadAgent(f).data.tools).includes('Bash'));
    assert.deepEqual(withBash, ['repo-extractor.md']);
  });

  test('dayna-voice-auditor is the only agent granted Edit (it edits staged copy in place)', () => {
    const withEdit = AGENT_FILES.filter((f) => splitList(loadAgent(f).data.tools).includes('Edit'));
    assert.deepEqual(withEdit, ['dayna-voice-auditor.md']);
  });

  test('conflict-reconciler and dayna-voice-auditor do NOT have Bash (they never clone repos)', () => {
    for (const filename of ['conflict-reconciler.md', 'dayna-voice-auditor.md']) {
      const tools = splitList(loadAgent(filename).data.tools);
      assert.ok(!tools.includes('Bash'), `${filename} should not have Bash`);
    }
  });

  test('conflict-reconciler declares its output contract file: _audit/RECONCILED-VIEW.md', () => {
    const { body } = loadAgent('conflict-reconciler.md');
    assert.match(body, /_audit\/RECONCILED-VIEW\.md/);
  });

  test('dayna-voice-auditor declares its output contract file: _audit/VOICE-EDITS-FOR-REVIEW.md', () => {
    const { body } = loadAgent('dayna-voice-auditor.md');
    assert.match(body, /_audit\/VOICE-EDITS-FOR-REVIEW\.md/);
  });

  test('repo-extractor declares the full INVENTORY/KEPT/LEFT-BEHIND output contract', () => {
    const { body } = loadAgent('repo-extractor.md');
    for (const file of ['INVENTORY.md', 'KEPT.md', 'LEFT-BEHIND.md']) {
      assert.ok(body.includes(file), `repo-extractor.md should mention ${file}`);
    }
  });

  test('conflict-reconciler explicitly refuses to decide (consolidates only)', () => {
    const { body } = loadAgent('conflict-reconciler.md');
    assert.match(body, /Consolidate, never decide/);
  });

  test('dayna-voice-auditor explicitly defers final say to Dayna', () => {
    const { body } = loadAgent('dayna-voice-auditor.md');
    assert.match(body, /She is the final voice authority/);
  });

  test('repo-extractor explicitly refuses to move things into buckets/ itself', () => {
    const { body } = loadAgent('repo-extractor.md');
    assert.match(body, /No moving into[\s\S]*?`buckets\/`[\s\S]*?without explicit approval/);
  });
});