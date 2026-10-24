---
name: Workout account migration
description: Privacy and preservation rules when copying browser routines into signed-in cloud accounts.
---

Never automatically attach guest browser routines to whichever account signs in. Copying local routines into an account requires an explicit user action and must leave the browser originals intact.

**Why:** Cross-device access was requested after browser-local routines had shipped. Existing notes must not be lost, and automatically importing them on a shared device could expose someone else's routines to the wrong account.

**How to apply:** Clearly distinguish guest browser storage from private account storage. Repeated copies must not overwrite cloud edits. Keep account data isolated when signing out or switching accounts, and preserve unsaved drafts when a save fails or conflicts with another device.
