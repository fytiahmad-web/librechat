'use strict';

const express = require('express');
const request = require('supertest');
const f5mRouter = require('./f5m');

describe('F5M API routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/f5m', f5mRouter);

  test('GET /manifest exposes the F5M tier and mode catalog', async () => {
    const response = await request(app).get('/api/f5m/manifest').expect(200);
    expect(response.body.product.name).toBe('F5M BOTS');
    expect(response.body.tiers.map(({ id }) => id)).toEqual(['pulse', 'apex', 'sovereign']);
    expect(response.body.modes.map(({ id }) => id)).toEqual(['atlas', 'oracle', 'cipher', 'visage', 'scribe']);
  });

  test('POST /route returns a deterministic routing profile', async () => {
    const response = await request(app)
      .post('/api/f5m/route')
      .send({ prompt: 'Research and compare three database engines.' })
      .expect(200);
    expect(response.body.decision).toMatchObject({ tier: 'apex', mode: 'oracle' });
  });

  test('POST /route respects explicit user selections', async () => {
    const response = await request(app)
      .post('/api/f5m/route')
      .send({ prompt: 'What is an API?', tier: 'sovereign', mode: 'cipher' })
      .expect(200);
    expect(response.body.decision).toMatchObject({
      tier: 'sovereign',
      mode: 'cipher',
      selection: 'user-selected',
      modeSelection: 'user-selected',
    });
  });

  test('POST /route rejects empty prompts', async () => {
    const response = await request(app).post('/api/f5m/route').send({ prompt: ' ' }).expect(400);
    expect(response.body.code).toBe('F5M_PROMPT_REQUIRED');
  });
});
