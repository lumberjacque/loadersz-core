# Release checklist

This file is intentionally excluded from the npm package. The public README is for package users.

## Before every release

1. Choose a new, unused semver version in `package.json`.
2. Install dependencies from the committed lockfile with `npm ci`.
3. Run the checks below from the repository root:

```sh
npm audit
npm run verify
npm run build:package
npm run verify:package
npm pack --dry-run --ignore-scripts
npm publish --dry-run
```

Review the `npm pack` file list. It must contain only the npm metadata, `README.md`, `LICENSE`, and `dist/` output. Do not publish if secrets, source files, tests, or unexpected scripts appear.

## Publish

After reviewing the dry-run output, publish exactly the prepared package:

```sh
npm publish
```

`prepublishOnly` reruns the project verification, builds the package, and checks its manifest before upload. A published package version cannot be reused, so do not skip the dry run.
