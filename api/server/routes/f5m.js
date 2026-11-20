'use strict';
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { getF5MManifest, resolveF5MRoute } = require('~/server/services/F5M');
const router = express.Router();
const routeLimiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
router.get('/manifest', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  return res.status(200).json(getF5MManifest());
});
/** Deterministic profile selection only; it does not invoke models or execute tools. */
router.post('/route', routeLimiter, (req, res) => {
  try {
    return res.status(200).json({ decision: resolveF5MRoute(req.body ?? {}) });
  } catch (error) {
    const status = ['F5M_PROMPT_REQUIRED', 'F5M_PROMPT_TOO_LONG'].includes(error.code) ? 400 : 500;
    return res.status(status).json({ error: error.message || 'Unable to resolve F5M routing profile.', code: error.code || 'F5M_ROUTING_ERROR' });
  }
});
module.exports = router;
