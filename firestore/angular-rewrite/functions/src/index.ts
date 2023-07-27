/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    onDocumentWritten,
} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

import { Restaurant } from '../../types/restaurant';
import { Rating } from '../../types/ratings';

initializeApp();
const db = getFirestore();

export const updateNumRatings = onDocumentWritten(
    "restaurants/{restaurtantID}/ratings/{ratingID}", async (event) => {
        logger.info(
            `Updatuing the numRatings and avgRatings for restuarant
             ${event.params.restaurtantID}`);

        // Get num reviews from restaurant and compare to actual num reviews
        let numRatingsReported: number;
        let actualRatings: Rating[] = [];
        let restaurantData: Restaurant;
        const restuarantDocRef = db.doc(
            `restaurants/${event.params.restaurtantID}`);

        logger.info(`Fetching data for restaurant 
                    ${event.params.restaurtantID}`);

        return restuarantDocRef.get().then(snapshot => {
            restaurantData = snapshot.data() as Restaurant;
            numRatingsReported = restaurantData.numRatings;
        }).then(() => {
            return db.collection(`restaurants/${event.params.restaurtantID}/ratings`)
                .get().then(
                    snapshot => {
                        logger.info(`Fetching list of reviews for restuarant 
                                    ${event.params.restaurtantID}`);

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
