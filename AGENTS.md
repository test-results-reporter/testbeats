# AGENTS.md

## Project Overview
**TestBeats** is a tool designed to streamline the process of publishing test results from various automation testing frameworks to communication platforms like **Slack**, **Microsoft Teams**, and **Google Chat**. It unifies your test reporting to build quality insights and make faster decisions.

- **Primary Source Code**: Located in `src/`.
- **Main Entry Point**: `src/index.js` (API) and `src/cli.js` (CLI).
- **Configuration**: Uses `package.json` for dependencies and scripts.

## Setup commands
- **Install dependencies**: `npm install`
- **Build the project**: `npm run build` (uses `pkg` to create executables in `dist/`)

## Testing instructions
- **Run all tests**: `npm test`
- **Test environment**: Mocha is used as the test runner.
- **Coverage**: `c8` is used for code coverage tracking.
- **Test files**: Located in the `test/` directory.

## Code style
- Follow standard JavaScript practices for Node.js.
- Maintain existing coding patterns seen in `src/`.
- Ensure new features include appropriate tests in the `test/` directory.

## PR Instructions
- **PR Titles**: Must follow semantic commit messages (e.g., `feat: ...`, `fix: ...`, `chore: ...`). There is a "Lint PR Title" workflow to enforce this.
- **Tests**: Ensure all tests pass (`npm test`) before submitting a PR.
- **Documentation**: Update `README.md` if your changes introduce new features or change existing behavior.
