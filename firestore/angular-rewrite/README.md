# Firestore Quickstart: Friendly Eats

![Photo of the FriendlyEats Homepage](images/FriendlyEatsHomepage.png)

## Introduction

FriendlyEats is a restaurant recommendation app built on Firestore. It was built with the [Angular](https://angular.io/) Javascript framework, and can make use of [Firebase's Local Emulator Suite](emulator-docs) (specifically, the [Authentication](https://firebase.google.com/docs/emulator-suite/connect_auth), [Storage](https://firebase.google.com/docs/emulator-suite/connect_storage), [Functions](https://firebase.google.com/docs/emulator-suite/connect_functions), and [Firestore](https://firebase.google.com/docs/emulator-suite/connect_firestore) emulators) so that the quickstart can be run without needing to create a project in the [Firebase Console](https://console.firebase.google.com).

For more information about Firestore visit the [Firestore docs][firestore-docs].
For more information about the Firebase Emulator Suite visit the [Emulator Suite docs][emulator-docs]

[firestore-docs]: https://firebase.google.com/docs/firestore/
[emulator-docs]: https://firebase.google.com/docs/emulator-suite

## Prerequisites
Before following the steps to build and run this quickstart you will need:
 1. [Node.Js](https://nodejs.org/en/download) Version 16.0 or higher
 2. [Java](https://jdk.java.net/) JDK version 11 or higher.

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

 1. Install and build all project dependencies
   ```bash
   npm install && (cd functions && npm install && npm run build)
   ```

   *Note, when modifying the contents of `functions/src`, be sure to run `npm run build` in the `functions/` directory so that Typescript changes can be compiled bundled into the next emulator run.*

 1. Run and serve the project locally:
    ```bash
    firebase --project demo-friendly-eats emulators:exec --import ./imported-firebase-data 'ng serve'
    ```
 1. As indicated, open [http://127.0.0.1:4200](http://127.0.0.1:4200) in your browser and try out the app!
 
## Support

- [Firebase Support](https://firebase.google.com/support/)

## License

© Google, 2023. Licensed under an [Apache-2](../LICENSE) license.