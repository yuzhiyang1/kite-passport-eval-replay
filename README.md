# Kite Passport Eval Replay

An independent personal developer tool for reviewing saved KiteAI Passport agent responses. It grades literal assertions from the official reference evaluation suite and produces JSON, Markdown and JUnit reports, without invoking models or moving funds.

## Run locally

Requires Node.js 20 or newer. No dependency installation is needed.

```bash
git clone https://github.com/yuzhiyang1/kite-passport-eval-replay.git
cd kite-passport-eval-replay
npm test
npm run evidence
```

The test suite checks all 138 reference cases and 424 literal assertions. `tmp/replay-evidence/` contains explicitly synthetic all-marker and missing-JSON-flag reports. The injected failure must be detected; it is not a live agent failure.

## Review actual captured responses

```bash
npm run eval:replay -- --request capture-request.json
# Collect real agent answers using only the exported prompts and appropriate skills.
# Store the answers using the capture schema documented in evals/REPLAY.md.
npm run eval:replay -- --capture captures.json --out replay-report
```

See [the capture protocol and report documentation](evals/REPLAY.md). Missing records and execution errors fail the replay instead of disappearing from its denominator. Suite fingerprints detect changed prompts or grading rules. Every case retains an explicit requirement for semantic review: literal matches do not prove correct behavior.

## KiteAI relationship and originality

This tool is built specifically for the Passport behavioral evaluation format, with unchanged reference cases from the [official Passport Skills repository](https://github.com/gokite-ai/passport-skills). The replay implementation and tests are authored by `yuzhiyang1`; official reference data remains attributed to Kite AI. See [provenance and licenses](THIRD_PARTY_NOTICES.md).

This independent repository corrects the hosting of the 2026-09-20 contribution after administrator feedback. It does not claim that relocating existing work is a new week's contribution.

## Continuous integration

The [Replay CI workflow](https://github.com/yuzhiyang1/kite-passport-eval-replay/actions/workflows/replay.yml) tests Node 20 and 22 on Ubuntu and Windows, then uploads full synthetic report artifacts. Real account or model execution is not part of this workflow.
Independent Passport transcript replay and JUnit reporting tool for KiteAI skills
