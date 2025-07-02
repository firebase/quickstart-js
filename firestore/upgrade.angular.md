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
- [ ] Keep detailed notes throughout this process, including exact commands run, output, any issues encountered, and their resolutions.
- [ ] If any step fails, investigate the cause thoroughly and resolve it before proceeding. Do not skip steps.
- [ ] Ensure your Git working directory is clean before starting (no uncommitted changes).

### Pre-requisites:
- [ ] Ensure you are on the correct branch (e.g., `develop` or a feature branch for the upgrade).
- [ ] Pull the latest changes from the remote repository to ensure your local branch is up-to-date.
- [ ] Create a new dedicated branch for this upgrade (e.g., `feature/upgrade-angular-deps`).
- [ ] Ensure Node.js and npm are up-to-date to recommended versions for your Angular version.
- [ ] Clear npm cache (optional, but recommended for clean slate):
    ```bash
    npm cache clean --force
    ```

### Step-by-Step Instructions:

#### Step 2.1: Angular 16.x to 17.x

1.  **Update `package.json`:**
    Modify the `dependencies` and `devDependencies` sections in `package.json` to reflect the new versions. Use a text editor to manually change the version numbers.

    - [ ] Locate `package.json` in the project root.
    - [ ] For each of the listed Angular packages (excluding the three exceptions), change their version to `^17.0.0`.
    - [ ] Save `package.json`.
    - [ ] **Verification:** Open `package.json` again to visually confirm the changes.

2.  **Install Dependencies:**
    Run `npm install` to download and install the updated packages. This will also update `package-lock.json`.

    ```bash
    npm install
    ```

    - [ ] **Observation:** Monitor the console output for any warnings or errors during installation.
    - [ ] **Verification:** Check that `node_modules` directory has been updated.
    - [ ] **Verification:** Confirm that `package-lock.json` has been updated with the new dependency versions.
    - [ ] **Troubleshooting:** If `npm install` fails, review the error messages, try `npm cache clean --force` and `rm -rf node_modules package-lock.json` then `npm install` again.

3.  **Run Tests:**
    Execute the project's unit and integration tests to ensure no regressions were introduced by the dependency updates. This uses the `test` script defined in `package.json`.

    ```bash
    npm run test -- --no-watch
    ```

    - [ ] **Observation:** Note the number of tests run, passed, and failed.
    - [ ] **Verification:** Ensure all tests pass (0 failures).
    - [ ] **Troubleshooting:** If tests fail, analyze the error messages and stack traces. It might indicate breaking changes in the new versions. Revert changes if necessary to isolate the issue.

4.  **Build Project:**
    Build the project to verify that it compiles successfully with the new dependencies and that there are no build-time errors or warnings. This uses the `build` script defined in `package.json`.

    ```bash
    npm run build
    ```

    - [ ] **Observation:** Monitor the build output for any warnings or errors.
    - [ ] **Verification:** Ensure the build completes successfully with no errors. Ideally, no new warnings should appear.
    - [ ] **Troubleshooting:** If the build fails, review the error messages. This could be due to breaking changes in the updated libraries or compatibility issues.

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
