# Agent Registry — rules for adding agents (read this first)

You are working inside the **agent registry**: a curated catalog of Claude Code
agents and systems. Many people contribute; the owner approves via pull request.
When someone asks you to add, create, or improve an agent here, follow these
rules exactly so everything lands in the right place. Do not improvise the
structure.

## The one rule: everything goes under the contributor's namespace

Every file a contributor adds lives under a folder named after THEM. Never at
the root, never loose in a shared folder, never inside another person's folder.

```
agents/<author>/<agent-name>.md        the agent itself
refs/<author>/<agent-name>/<file>.md   reference files that agent reads (optional)
systems/<author>/<name>.md             shared system / doctrine docs (optional)
```

`<author>` = the contributor's handle (kebab-case, e.g. `atul`, `priya-k`).
If you don't already know whose namespace to use, ASK once, then use it for
every file in this contribution. Do not guess or invent a namespace.

## How to add a new agent (do exactly this)

1. Confirm the `<author>` namespace (ask if unknown).
2. Create `agents/<author>/<agent-name>.md` where `<agent-name>` is kebab-case
   and unique within that author's folder. Use this frontmatter format:
   ```markdown
   ---
   name: <agent-name>
   description: <one line: what it does and when to use it>
   tools: Read, Grep, Glob, Edit, Write   # only what it needs
   ---

   <the agent's system prompt / instructions>
   ```
3. If the agent reads reference files, put them in
   `refs/<author>/<agent-name>/` — never anywhere else.
4. If the contribution is a system/doctrine doc (not an agent), put it in
   `systems/<author>/<name>.md`.
5. Create the `<author>` folders if they do not exist yet. Do NOT create files
   outside them.

## How to improve an EXISTING agent

- Edit only that agent's file, in a small focused change.
- Add new material as a NEW section; do not rewrite existing text (append, don't
  overwrite) so two contributors never collide on the same lines.

## Never do this

- Never place a file at the repo root or directly in `agents/`, `refs/`,
  `systems/` (it MUST be under `<author>/`).
- Never edit another author's folder, or `install.sh`, `CODEOWNERS`,
  `CONTRIBUTING.md`, `CLAUDE.md`, or `scripts/` (unless the owner asked you to).
- Never push to `main`. Contributions go in via a fork + pull request; the owner
  merges. Merging is the approval.
- No secrets, keys, or personal data in any file.

## Before you finish

Run the structure check and fix anything it flags:
```
bash scripts/validate.sh
```
It fails if any file is misplaced (outside a namespace, or in the wrong folder).
A green check here is what keeps the catalog clean.

A ready-to-copy starting point is in `templates/agent-template.md`.
