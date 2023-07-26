# Firestore Quickstart

## Introduction

FriendlyEats is a restaurant recommendation app built on Firestore. It was built with the [Angular](https://angular.io/) Javascript framework, and makes use of [Firebase's Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) so that the quickstart can be run without needing to create a project in the [Firebase Console](https://console.firebase.google.com).

For more information about Firestore visit [the docs][firestore-docs].

[firestore-docs]: https://firebase.google.com/docs/firestore/

## Setup and run the app locally:

Follow these steps to setup and run the quickstart:
 1. Install the Angular CLI if you do not already have it installed on your machine:
   ```
   npm install -g @angular/cli
   ```

 1. Install the Firebase CLI if you do not have it installed on your machine:
    ```bash
    npm -g i firebase-tools
    ```
 1. Initialize initialize / download the required emulators with the Firebase CLI
    ```bash
    firebase init emulators
    ```
    
    When prompted, select the `Firestore`, `Storage`, `Functions`, and `Authentication` Emulators.

 1. Install all project dependencies
   ```bash
   # In the current directory
   npm install
   ``` 
   
   ```bash
   # In ./functions
   npm install
   npm run build
   ```
    *Note, when modifying the contents of `functions/src`, be sure to run `npm run build` in the `functions/` directory so that Typescript changes can be compiled bundled into the next emulator run.*

 1. Run and serve the project locally:
    ```bash
    firebase --project demo-friendly-eats emulators:exec --import ./imported-firestore-data 'ng serve'
    ```
 1. As indicated, open [http://localhost:4200](http://localhost:4200) in your browser and try out the app!
 
## Support

- [Firebase Support](https://firebase.google.com/support/)

## License

© Google, 2023. Licensed under an [Apache-2](../LICENSE) license.