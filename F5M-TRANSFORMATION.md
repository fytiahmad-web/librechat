# F5M BOTS Transformation

This fork is being transformed into F5M BOTS while retaining LibreChat as its application foundation.

## Product identity
- Product: F5M BOTS
- Positioning: The Autonomous Intelligence Platform
- Tagline: Intelligence. Autonomy. Execution.
- Primary language: English, with LibreChat localization retained.
- Visual direction: cybernetic luxury; charcoal/black surfaces with metallic gold and orange accents.
- Official logo: the user-supplied cybernetic lion asset. Add the original raster asset before replacing existing logo and favicon files.

## Intelligence architecture
Tiers: Pulse (fast), Apex (balanced/default), Sovereign (complex multi-stage execution).
Modes: Atlas (general), Oracle (research), Cipher (engineering), Visage (visual), Scribe (writing).
Tiers describe execution depth; modes describe task specialization. They are independent dimensions.

## First backend implementation
- GET /api/f5m/manifest returns public product metadata.
- POST /api/f5m/route returns a deterministic tier/mode profile.
- api/server/services/F5M contains the tier/mode registry and classifier.
- Unit tests cover the registry, classification, explicit overrides, and invalid input.

The classifier does not select a model or execute tools. Model capability discovery, provider allowlisting, durable orchestration, and UI integration remain separate implementation steps.

## Free-only policy
The product target is to avoid mandatory paid AI services and payment flows. The current manifest does not claim to enforce provider restrictions. Enforcement must be implemented against actual LibreChat endpoint/provider configuration and verified in integration tests before the deployment can be described as free-only.
Local inference and image generation require compatible models and sufficient compute.

## Deployment
Frontend: Vercel, subject to build and routing compatibility.
Backend: F5M.host, subject to Node.js, persistent process, storage, database, worker, and network compatibility.
MongoDB and other persistent services require durable storage.

## Compatibility and safety
Preserve LibreChat chat, authentication, files, agents, MCP, skills, projects, and streaming behavior. Do not modify upstream main, delete user data, or claim unimplemented capabilities as operational.
