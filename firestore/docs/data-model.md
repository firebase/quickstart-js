# Data Model

The Friendly Eats application uses two main collections in Firestore: `restaurants` and `ratings`.

## `restaurants`

This collection contains a document for each restaurant. The structure of a restaurant document is as follows:

*   `id` (string): The unique identifier for the restaurant.
*   `avgRating` (number): The average rating of the restaurant.
*   `category` (string): The category of the restaurant (e.g., "Pizza", "Mexican").
*   `city` (string): The city where the restaurant is located.
*   `name` (string): The name of the restaurant.
*   `numRatings` (number): The number of ratings the restaurant has received.
*   `photo` (string): The URL of the restaurant's photo.
*   `price` (number): The price range of the restaurant (1-4).

## `ratings`

This is a sub-collection of a restaurant document. It contains a document for each rating that a restaurant has received. The structure of a rating document is as follows:

*   `id` (string, optional): The unique identifier for the rating.
*   `rating` (number): The rating given by the user (1-5).
*   `text` (string): The text of the review.
*   `timestamp` (Date, optional): The timestamp of the review.
*   `userId` (string, optional): The ID of the user who submitted the review.
*   `userName` (string, optional): The name of the user who submitted the review.
