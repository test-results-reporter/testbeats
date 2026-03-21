# AGENTS.md - TestBeats

## Project Overview
TestBeats is a Node.js tool designed to publish test results from various automation testing frameworks to communication platforms like Slack, Microsoft Teams, and Google Chat.

## Tech Stack
- **Runtime**: Node.js (>=14.0.0)
- **CLI**: `sade`
- **Testing**: `mocha` with `pactum` (API testing)
- **Coverage**: `c8`
- **Build**: `pkg` (generates executables in `dist/`)

## Architecture & Key Locations
- `src/index.js`: Main API entry point.
- `src/cli.js`: CLI entry point.
- `src/commands/`: Core command implementations (e.g., `publish`, `manual-sync`).
- `src/platforms/`: Logic for communication platforms (Slack, Teams, etc.).
- `src/targets/`: Destination logic for reporting.
- `src/helpers/`: Utility functions and CI environment helpers.
- `test/`: Comprehensive test suite.

## Development Commands
- `npm install`: Install all dependencies.
- `npm test`: Run the full test suite with coverage reporting.
- `npm run build`: Package the application into executables.

## Implementation Guidelines
- **Consistency**: Follow existing JavaScript patterns found in `src/`.
- **Testing**: All new features or bug fixes must include corresponding tests in `test/`.
- **Dependencies**: Prefer using existing helpers in `src/helpers/` over adding new dependencies.
