// Tests for _audit/ANALYSIS.md and _audit/CLAIMS-LEDGER.md — the two audit
// docs this PR introduces to track drift and conflicting claims across
// source repos without deciding anything on Dayna's behalf.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readRepoFile, repoFileExists, extractTables } from './helpers.mjs';

describe('_audit/ANALYSIS.md', () => {
  const content = readRepoFile('_audit', 'ANALYSIS.md');

  test('references the Miro board with a well-formed https URL', () => {
    const match = content.match(/\((https:\/\/miro\.com\/[^\s)]+)\)/);
    assert.ok(match, 'expected a well-formed https://miro.com/... URL');
  });

  test('the generation timeline table has exactly 4 rows, numbered 1-4 in order', () => {
    const [table] = extractTables(content);
    assert.deepEqual(table.header, ['Gen', 'When', 'Voice', 'Notable']);
    assert.equal(table.rows.length, 4);
    assert.deepEqual(
      table.rows.map((r) => r[0]),
      ['1', '2', '3', '4'],
    );
  });

  test('every generation row has a non-empty value in every column', () => {
    const [table] = extractTables(content);
    for (const row of table.rows) {
      assert.equal(row.length, table.header.length);
      for (const cell of row) {
        assert.ok(cell.length > 0);
      }
    }
  });

  test('ranks identity lock as the #1 drift driver, ahead of commission split', () => {
    const section = content.split('## The decisions that never locked')[1];
    assert.ok(section, 'expected a "decisions that never locked" section');
    const items = [...section.matchAll(/^\d+\.\s\*\*([^*]+)\*\*/gm)].map((m) => m[1]);
    assert.ok(items.length >= 2);
    assert.match(items[0], /^Identity lock/);
    assert.match(items[1], /^Commission split/);
  });

  test('points to the claims ledger for full evidence, and that file exists', () => {
    assert.match(content, /`_audit\/CLAIMS-LEDGER\.md`/);
    assert.equal(repoFileExists('_audit', 'CLAIMS-LEDGER.md'), true);
  });

  test('the commission-split narrative agrees with what is actually logged in CLAIMS-LEDGER.md', () => {
    const ledger = readRepoFile('_audit', 'CLAIMS-LEDGER.md');
    assert.match(content, /commission client 55 \/ Dayna 45/);
    assert.match(content, /commission FLIPPED to Dayna 55 \/ client 45/);
    // Both directions asserted in ANALYSIS.md must actually be logged as claims.
    assert.match(ledger, /55% client \/ 45% Dayna/);
    assert.match(ledger, /55% Dayna \/ 45% client/);
  });
});

describe('_audit/CLAIMS-LEDGER.md', () => {
  const content = readRepoFile('_audit', 'CLAIMS-LEDGER.md');

  test('declares its column contract', () => {
    assert.match(content, /Columns: \*\*Topic · Claim · Source \(repo \/ file\) · Date · Notes\*\*/);
  });

  test('contains at least 8 topic tables, each shaped Claim | Source | Date | Notes', () => {
    const tables = extractTables(content);
    assert.ok(tables.length >= 8, `expected >=8 topic tables, found ${tables.length}`);
    for (const { header } of tables) {
      assert.deepEqual(header, ['Claim', 'Source', 'Date', 'Notes']);
    }
  });

  test('every logged claim cites a non-empty source and date (the ledger\'s own hard rule)', () => {
    const tables = extractTables(content);
    let totalClaims = 0;
    for (const { rows } of tables) {
      for (const row of rows) {
        assert.equal(row.length, 4, `row should have 4 cells: ${JSON.stringify(row)}`);
        const [claim, source, date] = row;
        assert.ok(claim.length > 0, 'claim text should not be empty');
        assert.ok(source.length > 0, `claim "${claim}" is missing a source`);
        assert.ok(date.length > 0, `claim "${claim}" is missing a date`);
        totalClaims++;
      }
    }
    assert.ok(totalClaims >= 15, `expected a substantial number of logged claims, found ${totalClaims}`);
  });

  test('the resale commission topic logs a genuine, flagged contradiction', () => {
    const section = content.split('## Resale commission')[1].split('## Resale tiers')[0];
    assert.match(section, /^> ⚠️ \*\*DIRECT CONTRADICTION/m);
    const [table] = extractTables(section);
    assert.ok(table.rows.length >= 2, 'a contradiction requires at least 2 competing claims');
    // The two claims should actually point in opposite directions.
    assert.match(section, /55% client \/ 45% Dayna/);
    assert.match(section, /55% Dayna \/ 45% client/);
  });

  test('never declares a winner: no row\'s Notes column contains a verdict word like "correct" or "final answer"', () => {
    const tables = extractTables(content);
    for (const { rows } of tables) {
      for (const [, , , notes] of rows) {
        assert.doesNotMatch(notes, /\b(is correct|the winner|final answer)\b/i);
      }
    }
  });

  test('flags the taglines topic as a real voice-register conflict the auditor must resolve with Dayna', () => {
    const section = content.split('## Taglines / positioning')[1];
    assert.ok(section);
    assert.match(section, /Chaos Wrangler/i);
    assert.match(section, /will need Dayna to confirm/);
  });
});