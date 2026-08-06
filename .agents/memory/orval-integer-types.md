---
name: Orval integer types
description: Orval generates zod.int() (Zod v4 syntax) for integer fields — breaks Zod v3 typecheck
---

## Rule
In `lib/api-spec/openapi.yaml`, always use `type: number` for integer-valued fields. Never use `type: integer`.

**Why:** Orval v8 generates `zod.int()` for `type: integer` fields. `zod.int()` is a Zod v4 API. This workspace runs Zod v3 (`zod@3.x`), which does not have `.int()` as a standalone method. The codegen itself succeeds but the downstream `pnpm -w run typecheck:libs` step fails with `Property 'int' does not exist on type 'typeof import(...zod/index")'`.

**How to apply:** Every time you write or modify `lib/api-spec/openapi.yaml`, replace any `type: integer` with `type: number`. The frontend/backend type safety difference is negligible for this project's use cases (counts, IDs, scores).
