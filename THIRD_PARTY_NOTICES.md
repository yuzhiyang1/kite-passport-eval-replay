# Provenance and third-party material

This is an independent personal project by `yuzhiyang1`, not a GitHub fork or an official KiteAI repository.

## Reference evaluation data

`evals/evals.json` is copied unchanged from [gokite-ai/passport-skills](https://github.com/gokite-ai/passport-skills/blob/a1541a2d1bf388fcf9de33e8ce0721ac2c1496cd/evals/evals.json), revision `a1541a2d1bf388fcf9de33e8ce0721ac2c1496cd`.

The 138 evaluation cases belong to Kite AI and are provided under the MIT license. Their original copyright notice and license are retained in [third-party/passport-skills-LICENSE](third-party/passport-skills-LICENSE). These reference cases are not claimed as original work by this project's author.

## Original implementation history

The replay tool, its tests, evidence generator, and replay documentation were originally authored by `yuzhiyang1` on 2026-09-20 in commit [3cc9869](https://github.com/yuzhiyang1/passport-skills/commit/3cc9869ebcc42fe9c09c677f41136182a44b7330), and proposed in [upstream PR #101](https://github.com/gokite-ai/passport-skills/pull/101).

On 2026-09-21, the activity administrator clarified that the contribution must be hosted in an independent personal repository, with the official repository used as reference. This project packages that same original implementation independently, adds standalone package metadata and CI, and preserves its attribution. This migration is a correction of the original submission, not a claim of a second week's new implementation. No upstream Git history was imported and no commit timestamps were backdated.

Reports generated from the included synthetic fixtures validate the tool's logic only; they do not prove that a real agent completed the evaluation cases or made payments.
