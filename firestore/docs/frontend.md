# Frontend

The frontend of the Friendly Eats application is an [Angular](https://angular.io/) application.

## Commands

The following commands are available for the frontend:

*   `npm install`: Install dependencies.
*   `npm start`: Run the application with emulators.
*   `npm run production`: Run the application against a production Firebase project.
*   `npm test`: Run unit tests.
*   `npm run fmt`: Format code.

## Components

The main Angular components are located in the `src/app` directory. Here is a brief overview of their roles:

*   **`app.component`**: The root component of the application.
*   **`homepage`**: The main page of the application, which displays a list of restaurants.
*   **`restaurant-card`**: A card component that displays information about a single restaurant.
*   **`restuarant-page`**: A page that displays the details of a single restaurant, including its reviews.
*   **`review-list`**: A component that displays a list of reviews for a restaurant.
*   **`filter-dialog`**: A dialog that allows users to filter the list of restaurants.
*   **`sign-in-modal`**: A modal that allows users to sign in.
*   **`submit-review-modal`**: A modal that allows users to submit a review.

## Firebase Connection

The frontend connects to Firebase services through the `firebaseConfig` object in the `src/environments/environment.default.ts` and `src/environments/environment.prod.ts` files. This object contains the Firebase project configuration.
