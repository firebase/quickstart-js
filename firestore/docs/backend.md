# Backend

The backend of the Friendly Eats application consists of a set of [Firebase Functions](https://firebase.google.com/docs/functions).

## Commands

The following commands are available for the backend (run from the `functions` directory):

*   `npm install`: Install dependencies.
*   `npm run build`: Build the functions.
*   `npm run serve`: Run the functions emulator.

## Functions

The Firebase Functions are located in the `functions/src/index.ts` file. Here is a brief overview of their purpose:

*   **`updateNumRatings`**: This function is triggered when a new rating is added to a restaurant's `ratings` sub-collection. It recalculates the average rating for the restaurant and updates the `avgRating` and `numRatings` fields in the corresponding restaurant document.
