---
name: Required uploaded assets
description: Keep required uploaded images in normal tracked application assets rather than the globally ignored upload directory.
---

Promote uploads required at runtime into the app's normal tracked asset directory. Do not rely on force-adding files from attached_assets.

**Why:** The environment globally ignores attached_assets, and later automated snapshots removed previously force-added anatomy images from tracked history while local builds still worked. A GitHub clone would then lack required files.

**How to apply:** Before pushing or checking clone reproducibility, confirm required imported assets are tracked. Keep the original upload untouched, use descriptive names for the application copies, and update imports.
