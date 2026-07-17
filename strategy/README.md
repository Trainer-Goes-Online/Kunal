# Agent Registry

A central, curated catalog of Claude Code **agents** and **systems**. Many
authors contribute; the owner approves what enters. Everyone consumes the
approved catalog by linking it into their `~/.claude`.

This repo is **separate from anyone's `~/.claude`** on purpose. It holds only
agents and systems, no config, no secrets, no session data, so contribution is
a plain fork + PR with no ignore-file tricks, and no one's personal config ever
mixes in.

```
agent-registry/
├── agents/<author>/<name>.md     the agents (namespaced by author)
├── refs/<author>/capture|shape/  reference files an agent reads
├── systems/<author>/<name>.md    shared system docs
├── install.sh                    symlinks approved files into ~/.claude
├── CODEOWNERS                    owner gates every PR
├── CONTRIBUTING.md               fork -> add under your namespace -> PR
└── README.md
```

## How it fits together

```
  agent-registry  (this repo — contributable, owner approves PRs)
        │  install.sh symlinks approved agents ──►  ~/.claude/agents, /capture, /shape, /system
        ▼
   your ~/.claude  (your private config: CLAUDE.md, memory, settings — stays personal)
```

Claude Code only reads from `~/.claude`, so `install.sh` links the approved
files into place. The registry stays the single source of truth.

## Use it

```
bash install.sh        # link approved agents into ~/.claude
git pull && bash install.sh   # after updates, re-link to get new approvals
```

## Contribute

See `CONTRIBUTING.md`. Short version: fork, add your agent under
`agents/<yourname>/`, open a PR. The owner reviews and merges. Merging is the
approval.

---

**Status:** scaffold. Seeded with the owner's 3 agents (no-brainer, capture,
shape) + their reference files under `agents/atul/` and `refs/atul/`, copied
from `~/.claude` (originals untouched). Not yet a git repo / not pushed;
`~/.claude` not yet switched to consume via symlink. Those steps are pending
owner confirmation.
