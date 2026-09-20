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

## Note on Billing

Firebase offers two main pricing plans: the Spark Plan (free) and the Blaze Plan (pay-as-you-go). The Spark Plan has a generous free tier for many services, including Cloud Functions. If you exceed the limits of the Spark Plan, your app's usage of that particular service will be capped for the rest of the billing cycle to prevent any charges. The Blaze Plan gives you the same free tier as the Spark Plan, but you are billed for any usage that exceeds those limits.

For more information, see the [Firebase pricing page](https://firebase.google.com/pricing).