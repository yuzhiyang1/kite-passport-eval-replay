# Passport transcript replay

Capture kind: **recorded**. Producer: Claude Code 2.1.266; default configured model (model ID not recorded); Windows; text-only, tools disabled; 2026-09-21.

**Literal checks only. All expected behaviors still require semantic review.**

Cases: 138; captured: 3; missing: 135; errors: 0.
Literal-pass cases: 2/138; matched assertions: 9/424.

Suite SHA-256: c1140ce0f22fb3262fef851ccd82ec3b4be81bfa4db7e805ee73c4d85f90c160

| Eval | Capture | Literal result | Unmatched assertions |
| --- | --- | --- | --- |
| 1 | captured | fail | ━━━ |
| 2 | captured | pass |  |
| 3 | captured | pass |  |
| 4 | missing | fail | kpass login init; --client agent; --output json; --no-interactive |
| 5 | missing | fail | kpass signup init; --client agent; --output json; --no-interactive |
| 6 | missing | fail | kpass me; --output json |
| 7 | missing | fail | delegation; payment_policy; kpass session create; --output json |
| 8 | missing | fail | delegation; max_total_amount; kpass session create |
| 9 | missing | fail | ksearch service list; --query; --output json |
| 10 | missing | fail | ksearch service get; --output json |
| 11 | missing | fail | ksearch service list; --output json; ━━━ |
| 12 | missing | fail | kpass user agents; --output json |
| 13 | missing | fail | kpass user sessions; --status active; --output json |
| 14 | missing | fail | kpass agent:register; session create; --output json |
| 15 | missing | fail | session create; reuse_available; --output json |
| 16 | missing | fail | kpass session status --request-id; --output json |
| 17 | missing | fail | kpass shop:search; --output json; ━━━ |
| 18 | missing | fail | kpass shop:cart; --output json |
| 19 | missing | fail | kpass shop:checkout; --output json |
| 20 | missing | fail | kpass wallet balance; --output json; ━━━ |
| 21 | missing | fail | kpass wallet send; --to 0xabc123def456; --asset USDC; --amount 5; --output json |
| 22 | missing | fail | session execute; --url; --output json |
| 23 | missing | fail | session execute; --body; --output json |
| 24 | missing | fail | kpass logout; --output json |
| 25 | missing | fail | kpass signup init; --client agent; --no-interactive; --output json |
| 26 | missing | fail | kpass login verify; login_id |
| 27 | missing | fail | kpass faucet drop; --recipient; --token USDC; --output json |
| 28 | missing | fail | kpass wallet send; --asset ETH; --amount 0.5; --output json |
| 29 | missing | fail | kpass user agents; --agent-type claude; --output json |
| 30 | missing | fail | kpass user sessions; --status active; --output json |
| 31 | missing | fail | kpass session status --request-id; --output json |
| 32 | missing | fail | kpass agent:register; --type claude; --output json |
| 33 | missing | fail | kpass shop:cart add; --provider; --external-id; --output json |
| 34 | missing | fail | kpass shop:cart remove; --provider; --external-id; --output json |
| 35 | missing | fail | kpass shop:cart clear; --output json |
| 36 | missing | fail | kpass shop:shipping update; --line1; --city; --postal; --output json |
| 37 | missing | fail | kpass shop:order status; --order-id; --output json |
| 38 | missing | fail | ksearch service list; --asset USDC; --output json |
| 39 | missing | fail | ksearch service list; --cursor; --output json |
| 40 | missing | fail | ksearch service health; --output json |
| 41 | missing | fail | session execute; --method PUT; --body; --output json |
| 42 | missing | fail | session execute; --headers; X-Api-Version; --output json |
| 43 | missing | fail | x402.status_code; 404 |
| 44 | missing | fail | kpass session list --status active; spent_total; max_total_amount; --output json |
| 45 | missing | fail | curl; api.payments.xyz; payment_policy; max_amount_per_tx |
| 46 | missing | fail | session create; --output json |
| 47 | missing | fail | kpass activity; --kind x402_payment; --output json |
| 48 | missing | fail | kpass activity; --kind shopping_checkout; --output json; --offset |
| 49 | missing | fail | ksearch service list; --query; ksearch service get; service_id; --output json |
| 50 | missing | fail | kpass shop:cart add; shop:checkout; --confirmed; --output json |
| 51 | missing | fail | kpass session create; --delegation; max_amount_per_tx; max_total_amount; --output json |
| 52 | missing | fail | kpass session create; --delegation; max_amount_per_tx; max_total_amount; --output json |
| 53 | missing | fail | kpass session attach; --session-id session_dash7788; --output json; human_action_required; kpass session status --request-id; --wait; Session Attached |
| 54 | missing | fail | kpass session attach; session_not_attachable; request-session |
| 55 | missing | fail | kpass session attach; agent_not_same_owner; --output json |
| 56 | missing | fail | kpass wallet address; --chain base; --output json; Gas is sponsored; USDC only; do not send ETH |
| 57 | missing | fail | kpass agent init; --output json; thumbprint |
| 58 | missing | fail | kpass agent token create --agent did:kite:acme-buyer-01; kpass agent bind --agent did:kite:acme-buyer-01 --token; active |
| 59 | missing | fail | kpass agent status; --output json; binding.status |
| 60 | missing | fail | runtime_agent_mismatch; different agent; ask rather than |
| 61 | missing | fail | kagent init; --output json; thumbprint |
| 62 | missing | fail | kpass agent token create --agent did:kite:acme-seller-01; kagent bind --agent did:kite:acme-seller-01 --token; active |
| 63 | missing | fail | kagent card fetch --pin; kagent card publish --file; card_hash_verified |
| 64 | missing | fail | registration template; registration validate; registration publish; --storefront; --rate-card; --workflow-terms |
| 65 | missing | fail | acceptance_policy_violation; set its acceptance policy; owner action |
| 66 | missing | fail | card_hash_verified; PUBLISHED, BUT THE HASH COULD NOT BE CONFIRMED; buyers verify this hash |
| 67 | missing | fail | ksearch find; --output json; rewrite_applied; verified_tier |
| 68 | missing | fail | ksearch agent offerings; --offering-kind dataset; --max-total-price-minor; --ready |
| 69 | missing | fail | ksearch agent card did:kite:example-seller; card_hash_verified; exit 8 |
| 70 | missing | fail | ksearch agent keys; active_count; --seller-key-id |
| 71 | missing | fail | kpass agent card fetch --pin; chain_context_complete |
| 72 | missing | fail | kagent agreement status --agreement-id agr_7f2a; kagent agreement accept --agreement-id agr_7f2a; --output json |
| 73 | missing | fail | acceptance_policy_violation; kagent escalate; --kind acceptance-override; approval_url |
| 74 | missing | fail | kagent agreement funding get --agreement-id agr_7f2a; activation_signable; kagent agreement funding sign --agreement-id agr_7f2a |
| 75 | missing | fail | kagent agreement deliver --agreement-id agr_7f2a --file; not funded; NOT uploaded |
| 76 | missing | fail | kagent serve; --config; kite.config.yaml |
| 77 | missing | fail | kagent message send --to; --body; --idempotency-key |
| 78 | missing | fail | kpass agent agreement propose --seller did:kite:example-seller; --terms-file; registrationBasis |
| 79 | missing | fail | kpass agent session request --agreement-id agr_123; --max-amount-per-tx; --max-total-amount; approval_url |
| 80 | missing | fail | kpass agent fund --agreement-id agr_123; funding_submission_incomplete; identical command |
| 81 | missing | fail | agreement proofs --agreement-id agr_123 --verify; deliveryHash; sha256 |
| 82 | missing | fail | kpass agent agreement reject --agreement-id agr_123; --reason-code delivery-hash-mismatch |
| 83 | missing | fail | kpass agent agreement review --agreement-id agr_123; --rating; --output json |
| 84 | missing | fail | kpass upgrade --output json; no permission prompt; bundle 22 |
| 85 | missing | fail | KPASS_AUTO_UPGRADE=0; ask before running; kpass upgrade |
| 86 | missing | fail | KPASS_NO_UPDATE_CHECK=1; update_available; kpass upgrade --check |
| 87 | missing | fail | kpass upgrade --check --output json; kpass upgrade --output json; up to date |
| 88 | missing | fail | irm https://cli.gokite.ai/install.ps1 &#124; iex; I can't run it for you on Windows; PowerShell |
| 89 | missing | fail | kite-discovery; image generation; cannot produce locally |
| 90 | missing | fail | wallet-send; no spending session; wallet |
| 91 | missing | fail | ASCII; no paid service; produces it directly |
| 92 | missing | fail | kite-discovery; exchange rate; real-time |
| 93 | missing | fail | kagent serve --config; the cwd IS the configuration; kite.config.yaml |
| 94 | missing | fail | one executable path; wrapper script; AGENT_MAX_TURNS |
| 95 | missing | fail | seller-agent-setup; active binding; seller-fulfill |
| 96 | missing | fail | out/active-registration.json; kagent registration get --output json; cannot quote right now |
| 97 | missing | fail | seller-acceptance; .claude/skills/; escalates every proposal to the owner |
| 98 | missing | fail | agent-delivery; exactly ONE JSON object; no shell |
| 99 | missing | fail | out/active-registration.json; priceSchedule; requiredBeforeDeliveryMinor |
| 100 | missing | fail | out/quotes/used; unconsumed; the same work, not merely the same money |
| 101 | missing | fail | dispute; undesigned; escalates it to the owner |
| 102 | missing | fail | seller-onboarding; phase; public name |
| 103 | missing | fail | resume; live |
| 104 | missing | fail | UID; permanent |
| 105 | missing | fail | propose; advertise; model-visible |
| 106 | missing | fail | recruiting/v1; silence; confirm |
| 107 | missing | fail | dashboard; reserve; confirm |
| 108 | missing | fail | 35000000; reserve; explicit |
| 109 | missing | fail | seller-acceptance; request |
| 110 | missing | fail | seller-acceptance; rejected; consent-refund |
| 111 | missing | fail | fail-closed; refuse |
| 112 | missing | fail | kagent serve; does not run |
| 113 | missing | fail | Playground; GOK-1272 |
| 114 | missing | fail | standard/v1; confirm |
| 115 | missing | fail | pending; fail-closed |
| 116 | missing | fail | identifier claim; owner; card fetch --pin |
| 117 | missing | fail | pending; dashboard |
| 118 | missing | fail | checkpoint; compare |
| 119 | missing | fail | fixed/v1; --expected-revision; directory workflow |
| 120 | missing | fail | negotiated/v1; totalBounds; out/active-registration.json |
| 121 | missing | fail | details.problems; card fetch --pin |
| 122 | missing | fail | serve --config; 6.6.0; does not run |
| 123 | missing | fail | .claude/skills; README |
| 124 | missing | fail | unlisted; directory search; card_hash_verified |
| 125 | missing | fail | resume; serve |
| 126 | missing | fail | readiness; workflowHash; directory workflow |
| 127 | missing | fail | card_hash_verified; stop |
| 128 | missing | fail | USDC; operator; CAIP-19 |
| 129 | missing | fail | silence; DEFAULT; confirm |
| 130 | missing | fail | appeal; revise; REJECTED |
| 131 | missing | fail | onboarding_status; identifier_already_claimed; owner |
| 132 | missing | fail | pending; dashboard; not re |
| 133 | missing | fail | redacted; placeholder; onboarding status |
| 134 | missing | fail | model; cannot guarantee; deterministic |
| 135 | missing | fail | roll-forward-only; author card; authorization |
| 136 | missing | fail | directory search; sufficient; optional |
| 137 | missing | fail | sha256sum; 64-hex; first |
| 138 | missing | fail | registration/prev; before phase 3; author card |

