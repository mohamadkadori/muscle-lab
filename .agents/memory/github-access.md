---
name: GitHub connection visibility
description: A healthy GitHub authorization may not expose a callable connector in the current runtime.
---

Distinguish healthy authorization from usable runtime access. Do not repeatedly ask the user to reconnect a healthy GitHub authorization just because the connector returns no accessible connection.

**Why:** An authorized, successfully attached GitHub integration did not expose a callable connection, while the existing authenticated GitHub CLI worked. Reconnecting would have added friction without resolving the runtime limitation.

**How to apply:** When the connector is unavailable despite healthy authorization, check whether the GitHub CLI already has an authenticated session and use its normal repository and Git commands. Never extract or display its credentials.
