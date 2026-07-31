// Tests for .coderabbit.yaml — this repo intentionally disables all
// automated CodeRabbit review/chat features since Mono is a content
// workspace, not a code project.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readRepoFile } from './helpers.mjs';

describe('.coderabbit.yaml', () => {
  const content = readRepoFile('.coderabbit.yaml');

  test('is non-empty and starts with an explanatory comment', () => {
    assert.ok(content.trim().length > 0);
    assert.match(content, /^# CodeRabbit disabled for this repo\.$/m);
    assert.match(content, /content-extraction workspace, not a code project/);
  });

  test('top-level keys are exactly "reviews" then "chat" (unindented)', () => {
    const topLevelKeys = [...content.matchAll(/^(\w+):\s*$/gm)].map((m) => m[1]);
    assert.deepEqual(topLevelKeys, ['reviews', 'chat']);
  });

  test('disables every top-level review feature', () => {
    const reviewsBlock = content.split(/^reviews:$/m)[1].split(/^chat:$/m)[0];
    assert.match(reviewsBlock, /^\s+review_status:\s*false\s*$/m);
    assert.match(reviewsBlock, /^\s+high_level_summary:\s*false\s*$/m);
    assert.match(reviewsBlock, /^\s+poem:\s*false\s*$/m);
  });

  test('disables auto_review, including on draft PRs', () => {
    const autoReviewBlock = content.split(/^\s+auto_review:$/m)[1].split(/^chat:$/m)[0];
    assert.ok(autoReviewBlock, 'expected an auto_review: nested block');
    assert.match(autoReviewBlock, /^\s+enabled:\s*false\s*$/m);
    assert.match(autoReviewBlock, /^\s+drafts:\s*false\s*$/m);
  });

  test('disables chat auto-reply', () => {
    const chatBlock = content.split(/^chat:$/m)[1];
    assert.ok(chatBlock, 'expected a chat: block');
    assert.match(chatBlock, /^\s+auto_reply:\s*false\s*$/m);
  });

  test('regression: no flag is accidentally left/turned on (no ": true" anywhere)', () => {
    assert.doesNotMatch(content, /:\s*true\b/);
  });

  test('auto_review is nested under reviews, not a sibling top-level key', () => {
    // auto_review: line should be indented (nested), never at column 0.
    assert.doesNotMatch(content, /^auto_review:/m);
    assert.match(content, /^\s+auto_review:\s*$/m);
  });
});