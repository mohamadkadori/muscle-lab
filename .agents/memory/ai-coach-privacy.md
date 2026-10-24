---
name: AI coach privacy and save consent
description: Why AI coaching must not silently upload account data or turn model output into automatic workout changes.
---

Do not automatically send saved workouts, account profiles, or health records to the AI provider. Keep conversations ephemeral unless the user explicitly requests a persistence feature with appropriate privacy controls.

**Why:** General fitness conversations can contain sensitive health details. Answering user-entered questions does not require reading their account data, and cross-device workout storage is not consent to upload existing routines to an AI model.

**How to apply:** Send only the current conversation needed to answer the user. Do not log prompt or response bodies. Treat model-generated routines as untrusted suggestions: validate them, show them for review, and require explicit saving through the existing workout storage rules. Never silently overwrite an existing routine based on a model response.
