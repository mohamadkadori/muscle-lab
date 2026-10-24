---
name: API generator exports
description: Why manual export aliases do not resolve generated Zod and TypeScript schema-name collisions.
---

Resolve generated schema-name collisions at the API contract or generator configuration level, not solely with handwritten barrel aliases.

**Why:** The generator appends wildcard exports to its package barrel during regeneration. A manually aliased type export can appear to fix a duplicate symbol, but the next generation restores the conflicting wildcard export. Query-parameter schema names can collide as well as body schema names.

**How to apply:** When code generation reports duplicate exports, inspect both generated schemas and types. Adjust the contract or generation configuration so their names do not collide, and confirm the full code-generation command succeeds rather than checking only a temporarily edited barrel.
