## Dependency Upgrade Plan Checklist

### General Guidelines
- [ ] Keep detailed notes throughout the upgrade process, including any issues encountered and their resolutions.

This checklist outlines the steps to safely and incrementally upgrade the project's dependencies to their latest versions. Each major version upgrade should be performed and verified before proceeding to the next.

### Phase 1: Minor/Patch Updates (Low Risk)
- [x] Upgrade `rxjs` to `7.8.2`
- [x] Upgrade `tslib` to `2.8.1`
- [x] Upgrade `zone.js` to `0.15.1`
- [x] Upgrade `karma` to `6.4.4`

### Phase 2: Angular Core and Related Packages (Incremental Major Upgrades)

#### Step 2.1: Angular 16.x to 17.x
- [ ] Upgrade all `@angular/*` packages (excluding `@angular/fire`, `@angular/flex-layout`, and `@material/layout-grid`) to `^17.0.0`. This includes:
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

#### Step 2.2: Angular 17.x to 18.x
- [ ] Upgrade the same set of `@angular/*` packages to `^18.0.0`.

#### Step 2.3: Angular 18.x to 19.x
- [ ] Upgrade the same set of `@angular/*` packages to `^19.0.0`.

#### Step 2.4: Angular CDK and Material 19.x to 20.x
- [ ] Upgrade `@angular/cdk` to `^20.0.0`.
- [ ] Upgrade `@angular/material` to `^20.0.0`.

### Phase 3: Other Major Dependency Upgrades
- [ ] Upgrade `@angular/fire` from `7.6.1` to `^20.0.0`. (Requires consulting AngularFire migration guides)
- [ ] Upgrade `@types/jasmine` from `4.3.5` to `^5.0.0`.
- [ ] Upgrade `jasmine-core` from `4.6.0` to `^5.0.0`.
- [ ] Upgrade `typescript` from `5.1.6` to `^5.0.0`.
- [ ] Upgrade `prettier` from `1.19.1` to `^3.0.0`.

### Phase 4: Investigate Problematic Dependencies
- [ ] Investigate `@angular/flex-layout` status (e.g., deprecated, new alternative).
- [ ] Investigate `@material/layout-grid` (why `npm outdated` suggests a downgrade to `14.0.0`, and determine correct upgrade path or alternative).

### Verification Steps (after each major upgrade step):
- [ ] Run `npm install`
- [ ] Run `ng test`
- [ ] Run `ng build`
- [ ] Run `npm run fmt`
