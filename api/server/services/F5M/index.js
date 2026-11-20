'use strict';
/** F5M deterministic request-profile selection. Does not invoke an inference provider. */
const F5M_TIERS = Object.freeze({
  PULSE: Object.freeze({ id: 'pulse', label: 'F5M Pulse', purpose: 'Fast, focused responses for straightforward tasks.', planning: 'minimal' }),
  APEX: Object.freeze({ id: 'apex', label: 'F5M Apex', purpose: 'Balanced reasoning for everyday and multi-step work.', planning: 'adaptive' }),
  SOVEREIGN: Object.freeze({ id: 'sovereign', label: 'F5M Sovereign', purpose: 'Coordinated planning for complex, multi-stage execution.', planning: 'multi-stage' }),
});
const F5M_MODES = Object.freeze({
  ATLAS: Object.freeze({ id: 'atlas', label: 'Atlas', purpose: 'General intelligence' }),
  ORACLE: Object.freeze({ id: 'oracle', label: 'Oracle', purpose: 'Research and analysis' }),
  CIPHER: Object.freeze({ id: 'cipher', label: 'Cipher', purpose: 'Software engineering' }),
  VISAGE: Object.freeze({ id: 'visage', label: 'Visage', purpose: 'Visual intelligence' }),
  SCRIBE: Object.freeze({ id: 'scribe', label: 'Scribe', purpose: 'Writing and language' }),
});
const TIER_IDS = new Set(Object.values(F5M_TIERS).map((x) => x.id));
const MODE_IDS = new Set(Object.values(F5M_MODES).map((x) => x.id));
const PATTERNS = Object.freeze({
  sovereign: /\b(build an app|build a platform|entire project|full repository|whole codebase|implement end.to.end|multi.?step|autonomous|deploy|migrate|refactor the entire|coordinate agents|subagents|عدة مراحل|مشروع كامل|ابنِ تطبيق|نفّذ المشروع|انشر التطبيق)\b/i,
  pulse: /\b(what is|define|translate|summari[sz]e briefly|convert|rewrite this sentence|quick question|yes or no|ما معنى|ترجم|لخّص باختصار|كم يساوي)\b/i,
  oracle: /\b(research|compare|investigate|verify|fact.?check|sources|market analysis|analyze the market|ابحث|تحقق من|قارن|حلل السوق|مصادر)\b/i,
  cipher: /\b(code|program|debug|bug|repository|repo|typescript|javascript|python|api|database|test suite|fix the build|برمج|كود|مستودع|اصلح|اختبار|قاعدة بيانات)\b/i,
  visage: /\b(image|illustration|logo|visual|design|generate a picture|edit this photo|صورة|صمّم|تصميم|شعار|عدّل الصورة)\b/i,
  scribe: /\b(write|draft|rewrite|proofread|edit this text|email|proposal|report|article|اكتب|صياغة|حرر|رسالة|تقرير|مقال)\b/i,
});
function normalizeId(value, allowed, fallback) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}
function inferMode(prompt) {
  if (/برمج|كود|مستودع|اصلح|اختبار|قاعدة بيانات/.test(prompt)) return 'cipher';
  if (/صورة|صمّم|تصميم|شعار|عدّل الصورة/.test(prompt)) return 'visage';
  if (/ابحث|تحقق من|قارن|حلل السوق|مصادر/.test(prompt)) return 'oracle';
  if (/اكتب|صياغة|حرر|رسالة|تقرير|مقال/.test(prompt)) return 'scribe';
  for (const id of ['oracle', 'cipher', 'visage', 'scribe']) if (PATTERNS[id].test(prompt)) return id;
  return 'atlas';
}
function inferTier(prompt, mode) {
  if (/عدة مراحل|مشروع كامل|ابنِ تطبيق|نفّذ المشروع|انشر التطبيق/.test(prompt)) return 'sovereign';
  if (/ما معنى|ترجم|لخّص باختصار|كم يساوي/.test(prompt) && prompt.length < 240) return 'pulse';
  if (PATTERNS.sovereign.test(prompt)) return 'sovereign';
  if (PATTERNS.pulse.test(prompt) && prompt.length < 240) return 'pulse';
  if (mode === 'cipher' && /(repository|repo|entire|full|migrate|deploy|codebase|مستودع|كامل|انشر)/i.test(prompt)) return 'sovereign';
  return 'apex';
}
function resolveF5MRoute({ prompt, tier = 'auto', mode = 'auto' } = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    const error = new Error('A non-empty prompt is required.');
    error.code = 'F5M_PROMPT_REQUIRED';
    throw error;
  }
  const normalizedPrompt = prompt.trim();
  if (normalizedPrompt.length > 12000) {
    const error = new Error('Prompt exceeds the 12000-character routing limit.');
    error.code = 'F5M_PROMPT_TOO_LONG';
    throw error;
  }
  const selectedMode = normalizeId(mode, MODE_IDS, 'auto');
  const resolvedMode = selectedMode === 'auto' ? inferMode(normalizedPrompt) : selectedMode;
  const selectedTier = normalizeId(tier, TIER_IDS, 'auto');
  const resolvedTier = selectedTier === 'auto' ? inferTier(normalizedPrompt, resolvedMode) : selectedTier;
  const profile = Object.values(F5M_TIERS).find((item) => item.id === resolvedTier);
  return Object.freeze({
    product: 'F5M BOTS', mode: resolvedMode, tier: resolvedTier, tierLabel: profile.label,
    selection: selectedTier === 'auto' ? 'automatic' : 'user-selected',
    modeSelection: selectedMode === 'auto' ? 'automatic' : 'user-selected',
    planning: profile.planning,
    notice: 'Routing profile selected. Model and tool availability must be verified separately.',
  });
}
function getF5MManifest() {
  return Object.freeze({
    product: { name: 'F5M BOTS', tagline: 'Intelligence. Autonomy. Execution.', defaultLanguage: 'en' },
    tiers: Object.values(F5M_TIERS), modes: Object.values(F5M_MODES),
    routing: { automaticTierSelection: true, defaultTier: 'apex', userSelectionOverridesAutomatic: true, classifier: 'deterministic-v1' },
    capabilities: {
      imageGeneration: { status: 'requires-provider-configuration' },
      autonomousExecution: { status: 'uses-existing-librechat-agent-runtime' },
      localInference: { status: 'requires-local-model-configuration' },
    },
    policy: { paidProviders: 'not disabled by this manifest; deployment allowlist integration is required' },
  });
}
module.exports = { F5M_TIERS, F5M_MODES, getF5MManifest, resolveF5MRoute };
