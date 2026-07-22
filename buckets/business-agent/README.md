# business-agent

**Intent:** the agents and content-extraction engines. These are the tools that
may **help us extract everything else faster** — so this bucket is a good place
to start.

**Provisional source repos:** `BUSINESS-AGENT`, `Content-Extractor`,
`repo-digest`

**Why first:** if `Content-Extractor` or `repo-digest` actually work, they're
exactly the kind of thing that speeds up passing through the other ~34 repos.
Check whether they're usable before rebuilding anything by hand.

As this bucket is worked, extracted pieces land in:
- `tools/` — the extraction/agent engines
- `content/` — any prompts, configs, or concept docs inside them

_Status: not started._
