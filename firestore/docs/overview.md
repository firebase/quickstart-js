# Friendly Eats Documentation

Welcome to the documentation for the Friendly Eats application. This document provides a high-level overview of the project's purpose, architecture, and technology stack.

For more detailed information, please see the following documents:

*   [Architecture](./architecture.md)
*   [Frontend](./frontend.md)
*   [Backend](./backend.md)
*   [Data Model](./data-model.md)
*   [Setup](./setup.md)

## Project Purpose

The Friendly Eats application is a demonstration of Firebase capabilities, specifically the JavaScript SDK, Firebase Auth, Firestore rules, and Firestore triggers. It is a simple restaurant review app where customers can anonymously find restaurants and read reviews. Once authenticated, they can create new restaurants and review them.

## Technology Stack

The application is built with the following technologies:

*   **Language**: [TypeScript](https://www.typescriptlang.org/) - The primary programming language for the application.
*   **Frontend**:
    *   [Angular](https://angular.dev/) - A popular web application framework. Please note that this project currently uses an older version of Angular, while the Firebase integrations are more recent.
    *   [Angular Material](https://material.angular.dev/) - UI component library for Angular.
*   **Backend**: [Firebase Functions](https://firebase.google.com/docs/functions) - Serverless functions to extend Firebase services.
*   **Database**: [Firestore](https://firebase.google.com/docs/firestore) - A flexible, scalable NoSQL cloud database.
*   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) - A service for managing user authentication.
*   **Storage**: [Cloud Storage for Firebase](https://firebase.google.com/docs/storage) - A service for storing and serving user-generated content.
*   **Tooling**:
    *   [npm](https://www.npmjs.com/) - Package manager for JavaScript.
    *   [Angular CLI](https://angular.dev/cli) - Command-line interface for Angular.
    *   [Firebase CLI](https://firebase.google.com/docs/cli) - Command-line interface for Firebase.