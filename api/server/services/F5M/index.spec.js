'use strict';
const { getF5MManifest, resolveF5MRoute } = require('./index');
describe('F5M Intelligence Core', () => {
  test('publishes three tiers and five modes', () => {
    const manifest = getF5MManifest();
    expect(manifest.tiers.map(({ id }) => id)).toEqual(['pulse', 'apex', 'sovereign']);
    expect(manifest.modes.map(({ id }) => id)).toEqual(['atlas', 'oracle', 'cipher', 'visage', 'scribe']);
    expect(manifest.routing.defaultTier).toBe('apex');
  });
  test('routes short factual requests to Pulse', () => {
    expect(resolveF5MRoute({ prompt: 'What is an API?' })).toMatchObject({ tier: 'pulse', mode: 'atlas' });
  });
  test('routes research to Oracle and Apex', () => {
    expect(resolveF5MRoute({ prompt: 'Research and compare three database engines.' })).toMatchObject({ tier: 'apex', mode: 'oracle' });
  });
  test('routes repository engineering to Cipher and Sovereign', () => {
    expect(resolveF5MRoute({ prompt: 'Refactor the entire repository and fix the build.' })).toMatchObject({ tier: 'sovereign', mode: 'cipher' });
  });
  test('routes visual requests to Visage', () => {
    expect(resolveF5MRoute({ prompt: 'Design a logo and generate an image.' })).toMatchObject({ tier: 'apex', mode: 'visage' });
  });
  test('routes writing requests to Scribe', () => {
    expect(resolveF5MRoute({ prompt: 'Draft a professional project proposal.' })).toMatchObject({ tier: 'apex', mode: 'scribe' });
  });
  test('respects explicit tier and mode', () => {
    expect(resolveF5MRoute({ prompt: 'What is an API?', tier: 'sovereign', mode: 'cipher' }))
      .toMatchObject({ tier: 'sovereign', mode: 'cipher', selection: 'user-selected', modeSelection: 'user-selected' });
  });
  test('falls back safely for unknown selections', () => {
    expect(resolveF5MRoute({ prompt: 'Explain a concept.', tier: 'unknown', mode: 'unknown' }))
      .toMatchObject({ tier: 'apex', mode: 'atlas' });
  });
  test('rejects empty and oversized prompts', () => {
    expect(() => resolveF5MRoute({ prompt: ' ' })).toThrow('A non-empty prompt is required.');
    expect(() => resolveF5MRoute({ prompt: 'x'.repeat(12001) })).toThrow('Prompt exceeds the 12000-character routing limit.');
  });
});
