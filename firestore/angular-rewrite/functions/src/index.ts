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

import { Restaurant } from '../../src/types/restaurant';
import { Rating } from '../../src/types/ratings';
import { strict as assert } from 'assert';

initializeApp();
const db = getFirestore();

export const updateNumRatings = onDocumentWritten(
    "restaurants/{restaurtantID}/ratings/{ratingID}", async (event) => {
        // Get num reviews from restaurant and compare to actual num reviews
        const restuarantDocRef = db.doc(
            `restaurants/${event.params.restaurtantID}`);

        logger.info(`Fetching data for restaurant ` +
            `${event.params.restaurtantID}`);
        const restaurantDocFromFirebase = await restuarantDocRef.get();
        const restaurantData = restaurantDocFromFirebase.data() as Restaurant;
        const fetchedRatingDocs = (await db.collection(
            `restaurants/${event.params.restaurtantID}/ratings`).get()).docs
        const actualRatings: Rating[] = fetchedRatingDocs.map(
            rating => rating.data() as Rating);

        /**
         * In general, since the application only allows for the creation of
         * new reviews (and not the deletion of existing reviews), we can 
         * expect that when this function is triggered the number of reviews
         * listed in the `restaurant.numRatings` field will be strictly less
         * than the actual length of the `ratings` sub-collection. In the case
         * of a race condition, restuarant.numRatings will be corrected on the
         * next write to the `ratings` collection. 
         */
        assert(restaurantData.numRatings < actualRatings.length)

        // Calculate average review
        const sumOfRatings = actualRatings.reduce(
            (currentSum, currentRating) => currentSum + currentRating.rating,
            0);
        const newAvgRating = Math.round(sumOfRatings / actualRatings.length);
        const newRestaurant: Restaurant = {
            ...restaurantData,
            avgRating: newAvgRating,
            numRatings: actualRatings.length
        }

        // Save result to Firestore
        logger.info(`Saving new avgRating: ${actualRatings.length}` +
            ` for restaurant ${event.params.restaurtantID}`)
        return restuarantDocRef.set(newRestaurant)
    }
)

