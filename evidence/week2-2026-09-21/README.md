# Week 2 live command-adapter evidence

On 2026-09-21, the execution adapter invoked the locally authenticated Claude Code 2.1.266 CLI three times, for official eval IDs 1, 2 and 3. The CLI used its default configured model; the exact model ID was not recorded, so this evidence makes no model-specific claim.

Flags: `--print --output-format text --tools "" --safe-mode --no-session-persistence --max-budget-usd 0.50`. Each process had a 90-second timeout and 65536-byte combined stdout/stderr limit. Only the public `activity/SKILL.md` from official Passport Skills revision `a1541a2d1bf388fcf9de33e8ce0721ac2c1496cd` was explicitly supplied; linked reference files were not supplied. Its captured text hash is in `capture.json` (local checkout text, including line endings).

The system prompt was:

> You are evaluating Kite Passport skill response generation. Read the JSON prompt and supplied skill context from stdin. Explain the exact commands and expected presentation for the user request. Do not execute commands, claim live account results, or use tools.

Results: all three processes returned nonempty real answers. Cases 2 and 3 passed their literal markers. Case 1 failed the `━━━` marker. The full 138-case report correctly marks 135 cases as missing; the command exited 1. Nine of the ten assertions in the selected cases matched. Do not infer an agent bug solely from the missing display marker: semantic expectations and potential reference-data drift still require review.

This validates real model response capture, not live Passport command execution, account behavior, payments or semantic completion. Responses are explanatory, as requested by the system prompt.

`capture.json` preserves response strings and timings verbatim. Local executable/context paths and producer metadata were normalized before publication; generated report fingerprints correspond to this published capture. The recorded context hash and timestamps are unchanged. No credentials, account data or private skill content were supplied to the prompts.

Replay without spending on additional model calls:

```bash
node scripts/replay-evals.mjs --capture evidence/week2-2026-09-21/capture.json --out new-live-replay
```

Expected exit: 1, with the same 2 literal-pass cases, 1 literal mismatch and 135 missing cases. Unlike the synthetic CI fixtures, these are saved real CLI responses.
