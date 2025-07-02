## Angular Core and Related Packages Upgrade Plan - Exhaustive Checklist

This exhaustive checklist details the incremental upgrade process for Angular core and related packages. Follow each step carefully and document any observations or issues.

### Dependencies to Upgrade (Incremental Major Upgrades):

- `@angular/animations`
- `@angular/cdk`
- `@angular/common`
- `@angular/compiler`
- `@angular/core`
- `@angular/forms`
- `@angular/material`
- `@angular/platform-browser`
- `@angular/platform-browser-dynamic`
- `@angular/router`
- `@angular-devkit/build-angular`
- `@angular/cli`
- `@angular/compiler-cli`

(Note: `@angular/fire`, `@angular/flex-layout`, and `@material/layout-grid` are excluded from this phase and will be handled separately.)

### General Guidelines:
- [x] Keep detailed notes throughout this process, including exact commands run, output, any issues encountered, and their resolutions.
- [ ] If any step fails, investigate the cause thoroughly and resolve it before proceeding. Do not skip steps.
- [ ] Ensure your Git working directory is clean before starting (no uncommitted changes).

### Pre-requisites:
- [x] Ensure you are on the correct branch (e.g., `develop` or a feature branch for the upgrade).
- [ ] Pull the latest changes from the remote repository to ensure your local branch is up-to-date.
- [x] Create a new dedicated branch for this upgrade (e.g., `feature/upgrade-angular-deps`).
- [x] Ensure Node.js and npm are up-to-date to recommended versions for your Angular version.
- [x] Clear npm cache (optional, but recommended for clean slate):
    ```bash
    npm cache clean --force
    ```

### Step-by-Step Instructions:

#### Step 2.1: Angular 16.x to 17.x

1.  **Update `package.json`:**
    Modify the `dependencies` and `devDependencies` sections in `package.json` to reflect the new versions. Use a text editor to manually change the version numbers.

    - [x] Locate `package.json` in the project root.
    - [x] For each of the listed Angular packages (excluding the three exceptions), change their version to `^17.0.0`.
    - [x] Save `package.json`.
    - [x] **Verification:** Open `package.json` again to visually confirm the changes.

2.  **Install Dependencies:**
    Run `npm install` to download and install the updated packages. This will also update `package-lock.json`.

    ```bash
    npm install
    ```

    - [x] **Observation:** `npm install` failed with an `ERESOLVE` error. `@angular/core@17.3.12` expects `zone.js@~0.14.0`, but `zone.js` is currently `0.15.1`. (Resolved by downgrading `zone.js` to `~0.14.0`.)
    - [x] **Observation:** `npm install` failed again with an `ERESOLVE` error. `@angular/compiler-cli@17.3.12` expects `typescript@">=5.2 <5.5"`, but `typescript` is `5.1.6`. (Resolved by upgrading `typescript` to `~5.2.0`.)
    - [x] **Observation:** `npm install` failed again with an `ERESOLVE` error. `@angular/common@17.3.12` conflicts with `@angular/fire@7.6.1` which expects `@angular/common@"^12.0.0 || ^13.0.0 || ^14.0.0 || ^15.0.0 || ^16.0.0"`. Temporarily removing `@angular/fire` to proceed with Angular core upgrade. It will be re-added and upgraded in Phase 3.
    - [x] **Observation:** `npm install` completed successfully after removing `@angular/fire`. Noted deprecation warnings for `read-package-json`, `inflight`, `rimraf`, `glob`, and `@angular/flex-layout`.
    - [x] **Verification:** Checked that `node_modules` directory has been updated.
    - [x] **Verification:** Confirmed that `package-lock.json` has been updated with the new dependency versions.
    - [x] **Troubleshooting:** `npm install` failed. Cleaned `node_modules` and `package-lock.json` and retried `npm install`.

3.  **Run Tests:**
    Execute the project's unit and integration tests to ensure no regressions were introduced by the dependency updates. This uses the `test` script defined in `package.json`.

    ```bash
    npm run test -- --no-watch
    ```

    - [x] **Observation:** Tests failed with "Module not found" errors for `@angular/fire` modules (e.g., `@angular/fire/app`, `@angular/fire/firestore`, `@angular/fire/auth`). This is expected as `@angular/fire` was temporarily removed from `package.json`.
    - [x] **Verification:** Ensure all tests pass (0 failures).
    - [x] **Troubleshooting:** Tests failed due to missing `@angular/fire` dependencies. This needs to be addressed before proceeding.

4.  **Build Project:**
    Build the project to verify that it compiles successfully with the new dependencies and that there are no build-time errors or warnings. This uses the `build` script defined in `package.json`.

    ```bash
    npm run build
    ```

    - [x] **Observation:** Build failed with multiple errors:
        - "Module not found" errors for `@angular/fire` modules (expected).
        - `NG8001` and `NG8002` errors related to Angular Material components (e.g., `mat-icon`, `mat-toolbar`, `mat-card`, `mat-form-field`, `mat-select`, `mat-option`, `mat-divider`, `mat-dialog-actions`).
        - `TS2307` errors for `@angular/fire` type declarations (expected).
        - `TS2531` errors for possibly `null` objects.
        - `NG2003` error for `Firestore` injection.
    - [x] **Verification:** Ensure the build completes successfully with no errors. Ideally, no new warnings should appear.
    - [x] **Troubleshooting:** Build failed. Need to investigate Angular Material module imports and other Angular-related errors.
        - [x] **Action:** Attempt to automatically update Angular Material using `ng update @angular/material`. (Failed: `ng` command not found. Retrying with `npx ng update @angular/material`.)
        - [x] **Observation:** `npx ng update @angular/material` failed due to outdated Node.js version (v18.20.5). Angular CLI v20.0.5 requires Node.js v20.19 or v22.12.
        - [x] **Action:** User attempted `nvm use 20`, but `nvm` command was not found.
        - [ ] **Action:** User needs to ensure `nvm` is installed and configured, or manually update Node.js to v20.19 or v22.12 before proceeding.

5.  **Post-Upgrade Verification (Manual/Exploratory):**
    - [ ] Start the application locally (`npm start` or `ng serve`).
    - [ ] Perform a quick smoke test of key functionalities in the application to ensure everything is working as expected.
    - [ ] Check the browser console for any new errors or warnings.

6.  **Commit Changes:**
    Commit the changes to your feature branch with a descriptive message.

    ```bash
    git add package.json package-lock.json
    git commit -m "feat: Upgrade Angular to v17"
    ```

#### Step 2.2: Angular 17.x to 18.x

1.  **Update `package.json`:**
    - [ ] For each of the listed Angular packages (excluding the three exceptions), change their version to `^18.0.0`.
    - [ ] Save `package.json`.
    - [ ] **Verification:** Open `package.json` again to visually confirm the changes.

2.  **Install Dependencies:**
    Run `npm install`.

    - [ ] **Observation:** Monitor the console output for any warnings or errors.
    - [ ] **Verification:** Check `node_modules` and `package-lock.json`.

3.  **Run Tests:**
    Run `npm run test -- --no-watch`.

    - [ ] **Observation:** Note test results.
    - [ ] **Verification:** Ensure all tests pass.

4.  **Build Project:**
    Run `npm run build`.

    - [ ] **Observation:** Monitor build output.
    - [ ] **Verification:** Ensure build completes successfully.

5.  **Post-Upgrade Verification (Manual/Exploratory):**
    - [ ] Start the application locally.
    - [ ] Perform a quick smoke test.
    - [ ] Check browser console.

6.  **Commit Changes:**
    Commit the changes to your feature branch.

    ```bash
    git add package.json package-lock.json
    git commit -m "feat: Upgrade Angular to v18"
    ```

#### Step 2.3: Angular 18.x to 19.x

1.  **Update `package.json`:**
    - [ ] For each of the listed Angular packages (excluding the three exceptions), change their version to `^19.0.0`.
    - [ ] Save `package.json`.
    - [ ] **Verification:** Open `package.json` again to visually confirm the changes.

2.  **Install Dependencies:**
    Run `npm install`.

    - [ ] **Observation:** Monitor the console output for any warnings or errors.
    - [ ] **Verification:** Check `node_modules` and `package-lock.json`.

3.  **Run Tests:**
    Run `npm run test -- --no-watch`.

    - [ ] **Observation:** Note test results.
    - [ ] **Verification:** Ensure all tests pass.

4.  **Build Project:**
    Run `npm run build`.

    - [ ] **Observation:** Monitor build output.
    - [ ] **Verification:** Ensure build completes successfully.

5.  **Post-Upgrade Verification (Manual/Exploratory):**
    - [ ] Start the application locally.
    - [ ] Perform a quick smoke test.
    - [ ] Check browser console.

6.  **Commit Changes:**
    Commit the changes to your feature branch.

    ```bash
    git add package.json package-lock.json
    git commit -m "feat: Upgrade Angular to v19"
    ```

#### Step 2.4: Angular CDK and Material 19.x to 20.x

1.  **Update `package.json`:**
    - [ ] Change `@angular/cdk` to `^20.0.0`.
    - [ ] Change `@angular/material` to `^20.0.0`.
    - [ ] Save `package.json`.
    - [ ] **Verification:** Open `package.json` again to visually confirm the changes.

2.  **Install Dependencies:**
    Run `npm install`.

    - [ ] **Observation:** Monitor the console output for any warnings or errors.
    - [ ] **Verification:** Check `node_modules` and `package-lock.json`.

3.  **Run Tests:**
    Run `npm run test -- --no-watch`.

    - [ ] **Observation:** Note test results.
    - [ ] **Verification:** Ensure all tests pass.

4.  **Build Project:**
    Run `npm run build`.

    - [ ] **Observation:** Monitor build output.
    - [ ] **Verification:** Ensure build completes successfully.

5.  **Post-Upgrade Verification (Manual/Exploratory):**
    - [ ] Start the application locally.
    - [ ] Perform a quick smoke test.
    - [ ] Check browser console.

6.  **Commit Changes:**
    Commit the changes to your feature branch.

    ```bash
    git add package.json package-lock.json
    git commit -m "feat: Upgrade Angular CDK and Material to v20"
    ```

### Rollback Plan:
- [ ] If any critical issues are encountered that cannot be quickly resolved, revert the changes using Git:
    ```bash
    git reset --hard HEAD
    git clean -fd
    ```
    (This will discard all uncommitted changes and revert to the last commit. Use with caution.)
- [ ] Alternatively, if you have committed the changes to your feature branch, you can revert the commit:
    ```bash
    git revert <commit-hash>
    ```

### Completion:
- [ ] Once all steps are completed successfully and verified, commit your changes to the feature branch.
- [ ] Create a pull request (PR) for review and merge into the main development branch.
