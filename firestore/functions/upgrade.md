## Detailed Plan for Upgrading `firebase-functions`

**Goal:** Systematically, incrementally, safely, and verifiably upgrade the `firebase-functions` dependency in `@firestore/functions` to its latest stable version.

**Plan:**

1.  **Initial Assessment:**
    *   Confirm the current installed version of `firebase-functions` from `package.json`.
    *   Identify the latest stable version of `firebase-functions` available on npm.
    *   **Crucial:** Search for official migration guides and release notes for `firebase-functions` covering all versions between our current version and the target latest stable version. This step is paramount for understanding potential breaking changes and necessary code modifications.
    *   Identify existing tests that cover `firebase-functions` related logic.
    *   Identify the project's commands for running tests, linting, and type-checking.

2.  **Preparation:**
    *   Ensure your current git working directory is clean (no uncommitted changes).
    *   Create a new git branch dedicated to this upgrade (e.g., `feature/upgrade-firebase-functions`).

3.  **Incremental Upgrade (if major version jump):**
    *   If there are multiple major versions between your current `firebase-functions` version and the target latest stable version, it is safer to upgrade one major version at a time.
    *   For each intermediate major version (e.g., if currently on v4 and target is v6, first upgrade to v5, then to v6):
        *   Install the intermediate major version: `npm install firebase-functions@<intermediate-major-version>`.
        *   Review and apply necessary code changes based on the migration guide for this specific major version jump.
        *   Run the project's tests.
        *   Run the project's linting and type-checking commands.
        *   Address any errors or warnings.
        *   If all checks pass, commit the changes: `feat: Upgrade firebase-functions to v<intermediate-major-version>`.
        *   If issues persist, revert the changes and investigate further before retrying.

4.  **Direct Upgrade to Latest Stable:**
    *   Once all intermediate major versions (if any) have been successfully upgraded and verified, or if directly upgrading to the next minor/patch version:
        *   Install the latest stable version: `npm install firebase-functions@latest`.
        *   Review and apply any remaining code changes based on the migration guides.

5.  **Verification:**
    *   Run all existing tests to ensure no regressions.
    *   Run the project's linting and type-checking commands to ensure code quality and type safety.
    *   **Manual Smoke Testing:** Deploy the functions to a staging or development Firebase project and manually trigger/test critical functions that utilize `firebase-functions` to ensure they behave as expected.

6.  **Cleanup & Commit:**
    *   Run `npm prune` to remove any unused packages.
    *   Commit the final changes with a clear and concise message (e.g., `feat: Upgrade firebase-functions to latest stable`).

**Todo List:**

- [ ] **Step 1: Initial Assessment**
    - [x] Read `package.json` to confirm current `firebase-functions` version.
    - [x] Run `npm view firebase-functions version` to find the latest stable version.
    - [x] Performed web search for "firebase-functions upgrade guide from 4 to 5".
    - **Key Findings:** Upgrading from v4 to v5 (and v6) involves migrating to 2nd Generation Cloud Functions. v6 defaults to v2 functions; 1st Gen functions require `firebase-functions/v1` import.
    - [x] Identified test command: No explicit `test` script found in `package.json`. Will need to investigate.
    - [x] Identified linting/type-checking commands: Type-checking is done via `npm run build` (which runs `tsc`). No explicit `lint` script found.
- [x] **Step 2: Preparation**
    - [x] Run `git status` to ensure a clean working directory.
    - [x] Run `git checkout -b feature/upgrade-firebase-functions`.
- [ ] **Step 3: Incremental Upgrade (Iterative - repeat as needed for major versions)**
    - [x] `npm install firebase-functions@5.1.1`
    - [x] Review migration guide for `5.x.x` (no breaking changes for v2 functions).
    - [x] Modify code as required (no changes needed).
    - [x] Run tests (No automated tests found).
    - [x] Run linting/type-checking (Passed).
    - [ ] `git add . && git commit -m "feat: Upgrade firebase-functions to v<intermediate-major-version>"` (if successful)
- [x] **Step 4: Direct Upgrade to Latest Stable**
    - [x] `npm install firebase-functions@latest`
    - [x] Modify code as required (no changes needed).
- [ ] **Step 5: Verification**
    - [x] Run tests (No automated tests found).
    - [x] Run linting/type-checking (Passed).
    
- [ ] **Step 6: Cleanup & Commit**
    - [ ] `npm prune`
    - [ ] `git add . && git commit -m "feat: Upgrade firebase-functions to latest stable"`
