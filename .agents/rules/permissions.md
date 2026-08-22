# Antigravity workspace permissions

@/AGENTS.md

Apply this rule as **Always On** for this workspace.

The referenced root `AGENTS.md` is the single source of project development rules. This file only sets Antigravity-specific permission behavior:

- Keep terminal command execution in **Request Review** mode; do not add workspace Allow rules for destructive commands or remote mutations.
- Keep non-workspace file access disabled. Do not grant access to home directories, credentials, or other repositories.
- Keep `read_url`, `execute_url`, and every `mcp(...)` permission in **Ask** mode. No MCP server is configured by this rule.
- Do not change Antigravity global settings or permission lists for this project.
