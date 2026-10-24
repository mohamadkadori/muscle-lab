---
name: Workout storage scope
description: Why personal workout plans use browser storage and how to approach future synchronization.
---

The workout builder intentionally saves to the current browser rather than introducing accounts or server-side identity.

**Why:** The request was to create routines and write notes in an existing app without accounts. Adding authentication and cloud synchronization was outside that request, so the browser-local limitation is stated in the page.

**How to apply:** Do not describe these routines as cloud-saved or cross-device. If synchronization or accounts are added later, preserve existing local routines and offer a migration or backup rather than silently replacing their storage.
