# Benchmarking loadersz

The benchmark suite keeps visual equivalence, CPU work, real Canvas work, and bundle size separate. A change is accepted only when it preserves rendered output and produces a repeatable improvement in its target workload.

## Build the benchmark bundle

```sh
npm run build:benchmark -- --out-dir .benchmark/current
```

To compare a candidate with a previously built baseline:

```sh
npm run benchmark:equivalence -- --baseline .benchmark/baseline/frames.js --candidate .benchmark/current/frames.js
npm run benchmark:cpu -- --baseline .benchmark/baseline/frames.js --bundle .benchmark/current/frames.js --output benchmark-results/cpu-ab.json
npm run benchmark:browser:ab -- --baseline .benchmark/baseline/frames.js --candidate .benchmark/current/frames.js --output benchmark-results/browser-ab.json
```

The equivalence gate compares every mode across 47,250 combinations of time, density, size, and particle radius. It also compares exact Canvas command traces for representative dots, lines, rectangles, and arcs.

The CPU and browser runners alternate baseline/candidate and candidate/baseline samples to reduce warm-up, scheduler, and thermal bias. Use medians and p95 values; never select the fastest individual run.

## Browser stress page

To open the interactive production-build benchmark locally:

```sh
npm run benchmark:ui
```

Open <http://127.0.0.1:4174>, choose a scenario, and select **Run benchmark**. The page shows the loaders while it measures one scenario. Stop the local server with `Ctrl+C`.

The interactive page measures the current checkout. Use the terminal A/B command when you need a controlled baseline-versus-candidate comparison.

To run every browser stress scenario without the UI:

```sh
npm run benchmark:browser -- --duration 5000 --warmup 2000 --output benchmark-results/browser-stress.json
```

This production-build benchmark runs projector-heavy, mixed, and control scenarios with 1, 10, 25, and 50 simultaneous loaders. It records the detected refresh period, effective FPS, p50/p95/p99 frame intervals, missed frame budgets, and supported Long Tasks.

For an iPhone, serve `.benchmark/browser` over the local network after running the browser benchmark build. Measure the page first without Web Inspector attached, then take a separate Safari Web Inspector Timelines recording for JavaScript, rendering, allocations, and garbage collection. Never compare an attached run with an unattached run.

## Continuous integration

The benchmark workflow runs on an ephemeral GitHub-hosted runner in the version-matched Playwright container. It has read-only repository permissions, receives no repository secrets, and uses the `pull_request` event rather than `pull_request_target`.

Exact frame and Canvas command equivalence is a required check. The browser benchmark also rejects malformed reports and median regressions above 20%. This deliberately broad guardrail catches large regressions without treating noisy shared CI runners as precision instruments. P95 values and smaller changes remain informational and must be confirmed locally on the same hardware and browser.

Each CI run writes a readable table to the GitHub Actions job summary. It shows baseline and candidate median time, the raw percentage delta, and a plain-English “faster” or “slower” interpretation for every workload.

Benchmark reports contain repository-relative paths only. They do not read or include files outside the checked-out repositories.

## Bundle size

```sh
npm run build
npm run benchmark:size -- --output benchmark-results/size.json
```

The report records raw, gzip, and Brotli sizes using stable names for hashed chunks. A runtime optimization may add at most roughly 100 gzip bytes to a relevant entry and should improve its targeted median by at least 10%. Smaller changes are treated as inconclusive unless they also reduce size or allocations with no measurable regression.

## Measurement rules

- Compare production-target ES2017 bundles from the same lockfile and Node version.
- Keep other CPU-heavy work closed and alternate A/B order.
- Separate frame generation from Canvas painting and end-to-end frame pacing.
- Use a real device before making battery or iPhone performance claims.
- Reject changes that alter frame geometry or Canvas command order.
