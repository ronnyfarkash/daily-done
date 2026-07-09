# Playwright Interactive Local Setup

This repo includes a local copy of the `playwright-interactive` skill at
`.codex/skills/playwright-interactive/SKILL.md`.

For `js_repl` to appear in Codex after restart, start Codex from this folder
with the feature enabled:

```bash
codex -c features.js_repl=true -c features.multi_agent=true --sandbox danger-full-access
```

The matching project-local feature flags are recorded in `.codex/config.toml`.
The sandbox flag is intentionally kept in this note instead of being forced by
repo config, because it grants broad local filesystem and process access.

Once the session restarts and `js_repl` is exposed, run:

```text
$playwright-interactive
```

Then use the skill's bootstrap cells to launch Playwright against the local
Daily Done dev server.

## Terminal Fallback

If Codex is running inside VS Code or another client that does not expose
`js_repl`, use `playwright-repl` from this folder:

```bash
npm run dev -- --host 127.0.0.1
npx --yes playwright-repl --session daily-done --headed --include-snapshot
```

Inside the REPL, the following commands were verified for Daily Done:

```text
open http://127.0.0.1:5173/
snapshot
await page.title()
context.browser()
```

For repeatable QA, import a temporary module and pass the live browser handle:

```javascript
const qaMod = await import("file:///tmp/daily-done-repl-qa.mjs");
const result = await qaMod.runDailyDoneQa(context.browser());
console.log(JSON.stringify(result, null, 2));
```

This fallback was verified against the multi-task/calendar Daily Done app with
mobile and desktop contexts, screenshot capture, and console-error checks.
