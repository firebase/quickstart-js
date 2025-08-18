# Architecture

The Friendly Eats application is a full-stack application with a clear separation of concerns between the frontend, backend, and helper scripts.

## Frontend

The frontend is an [Angular](https://angular.io/) application located in the root directory of the project. It is responsible for rendering the user interface and interacting with the Firebase services. For more details, see the [frontend documentation](./frontend.md).

## Backend

The backend consists of a set of [Firebase Functions](https://firebase.google.com/docs/functions) located in the `functions` directory. These functions are triggered by events in the Firestore database and are used to perform actions such as calculating the average rating of a restaurant. For more details, see the [backend documentation](./backend.md).

## Scripts

The `scripts` directory contains helper scripts for populating the Firestore database with mock data. This is useful for development and testing purposes.

## Integration

The frontend, backend, and scripts are integrated through the `firebase.json` file. This file configures the Firestore rules and indexes, the emulators, and the Firebase Functions.

For more information about the data model, see the [data model documentation](./data-model.md).