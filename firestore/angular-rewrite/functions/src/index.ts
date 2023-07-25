/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {
    onDocumentWritten,
} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

import { Restaurant } from '../../types/restaurant';
import { Rating } from '../../types/ratings';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


initializeApp();
const db = getFirestore();


export const updateNumRatings = onDocumentWritten(
    "restaurants/{restaurtantID}/ratings/{ratingID}", async (event) => {
        logger.info(`Updatuing the numRatings and avgRatings for restuarant ${event.params.restaurtantID}`);

        // Get num reviews from restaurant and compare to actual num reviews
        let numRatingsReported: number;
        let actualRatings: Rating[] = [];
        let restaurantData: Restaurant;
        const restuarantDocRef = db.doc(`restaurants/${event.params.restaurtantID}`);

        logger.info(`Fetching data for restaurant ${event.params.restaurtantID}`);
        return restuarantDocRef.get().then(snapshot => {
            restaurantData = snapshot.data() as Restaurant;
            numRatingsReported = restaurantData.numRatings;
        }).then(() => {
            return db.collection(`restaurants/${event.params.restaurtantID}/ratings`).get().then(snapshot => {
                logger.info(`Fetching list of reviews for restuarant ${event.params.restaurtantID}`);
                const rawRatingDocs = snapshot.docs
                rawRatingDocs.forEach(doc => {
                    actualRatings.push(doc.data() as Rating);
                });
            })
        }).finally(() => {
            if (numRatingsReported !== actualRatings.length) {
                // Calculate New Average Review
                let sumOfRatings = 0;
                actualRatings.forEach(currentRating => {
                    sumOfRatings += currentRating.rating;
                })
                logger.info(`Calculated sum of ratings: ${sumOfRatings}`)

                const newAvgRating = Math.round(sumOfRatings / actualRatings.length);
                logger.info(`Calculated newAvgRating: ${newAvgRating}`)

                // Crete restuarant obj. w/ updated info
                const newRestaurant: Restaurant = {
                    ...restaurantData,
                    avgRating: newAvgRating,
                    numRatings: actualRatings.length
                }

                logger.info(`Setting updated avg. and num reviews for restaurant ${event.params.restaurtantID}`);

                // Set restaurant obj to have updated info
                return restuarantDocRef.set(newRestaurant);
            }
            return;
        })

    }
)