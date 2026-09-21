# Executing an external agent

Week 2 adds a command adapter that executes selected prompts, saves captured responses after each case, and chains the existing replayer. Node.js 20+ is sufficient; no SDK dependency is required.

## Configuration

Create a private JSON config. This example uses a recent Claude Code CLI in text-only mode:

```json
{
  "command": "/absolute/path/to/claude",
  "args": ["--print", "--output-format", "text", "--tools", "", "--safe-mode", "--no-session-persistence", "--max-budget-usd", "0.50"],
  "kind": "recorded",
  "producer": "CLI version; model; skill revision; environment and date",
  "timeoutMs": 90000,
  "maxOutputBytes": 65536,
  "caseIds": [1, 2, 3],
  "contextFiles": ["/path/to/passport-skills/activity/SKILL.md"]
}
```

Use an executable rather than a `.cmd` or `.ps1` wrapper on Windows. For Node-based adapters, set `command` to the Node executable and the first argument to the adapter's absolute script path. Relative context paths resolve from the configuration file's directory. Verify supported CLI options with your installed version's help; model authentication must already be configured. The Claude budget option is per case, not a total-run budget, because each case starts a separate process.

```bash
npm run eval:execute -- --config private-config.json --out new-run-directory
# Optional: --suite custom-suite.json
```

The parent of the output directory must exist; the directory itself must be new. Case IDs are mandatory to avoid accidentally invoking every paid evaluation. The command is run sequentially in suite order, once per selected case, with no automatic retries. Set `kind: "synthetic"` when using a fixture instead of a real agent.

## Adapter protocol

Each command receives exactly one JSON document on stdin:

```json
{"id":1,"prompt":"Show me my recent activity","context":[{"name":"skill.md","content":"Explicit skill context"}]}
```

The command must print only its final answer as UTF-8 text to stdout and exit zero. Logs belong on stderr. No grading assertions or expected answers are supplied. The operator is responsible for providing relevant skill context without answer keys. Context SHA-256 hashes are recorded for reproducibility. CLI configuration is trusted operator input, never generated from the evaluated prompt.

The adapter inherits the calling process environment for existing authentication. It runs in a fresh temporary working directory, but this is **not a security sandbox**: an arbitrary configured command can still access files, network and credentials. Use a trusted command with tools disabled for response-generation evaluation. A text-only answer is not evidence of live tool execution or successful payments. Do not enable financial tools merely because an evaluation prompt requests a transfer.

## Failure handling and evidence

- Each completed case is checkpointed into `capture.json` via a same-directory rename. If a later process fails, earlier records remain available.
- A wall-clock timeout or combined stdout/stderr byte limit kills the process tree (`taskkill /T /F` on Windows, a process group on POSIX).
- Failed starts, nonzero exits, input-pipe failures, empty responses and limits produce error records. Raw stderr is not copied into captures or reports.
- `capture.json` contains real raw answers and local provenance: keep it private until reviewed. JSON/Markdown/JUnit reports omit the response body using the existing replayer.
- Unselected cases remain missing in the full-suite report. A three-case run is not a 138-case success. Use a deliberately scoped suite when you need a standalone subset report, preserving the suite itself with the evidence.
- A full literal pass exits 0; failed or missing cases exit 1 after writing reports; configuration and I/O failures exit 2. All semantic expectations still require review.

Process tests use labeled synthetic fixtures and run in the existing Ubuntu/Windows, Node 20/22 CI matrix. Live CLI invocation requires an authenticated local environment and is intentionally not run in public CI.
