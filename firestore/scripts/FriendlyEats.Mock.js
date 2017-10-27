/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * Adds a set of mock Restaurants to the Cloud Firestore.
 */
FriendlyEats.prototype.addMockRestaurants = function() {
  const promises = [];

  for (let i = 0; i < 20; i++) {
    let name =
        this.getRandomItem(this.data.words) +
        ' ' +
        this.getRandomItem(this.data.words);
    let category = this.getRandomItem(this.data.categories);
    let city = this.getRandomItem(this.data.cities);
    let price = Math.floor(Math.random() * 4) + 1;
    let photoID = Math.floor(Math.random() * 22) + 1;
    let photo = `https://storage.googleapis.com/firestorequickstarts.appspot.com/food_${photoID}.png`;
    let numRatings = 0;
    let avgRating = 0;

    const promise = this.addRestaurant({
      name,
      category,
      price,
      city,
      numRatings,
      avgRating,
      photo
    });

    if (!promise) {
      alert('addRestaurant() is not implemented yet!');
      return Promise.reject();
    } else {
      promises.push(promise);
    }
  }

  return Promise.all(promises);
};

/**
 * Adds a set of mock Ratings to the given Restaurant.
 */
FriendlyEats.prototype.addMockRatings = function(restaurantID) {
  const ratingPromises = [];
  for (let r = 0; r < 5*Math.random(); r++) {
    const rating = this.data.ratings[
      parseInt(this.data.ratings.length*Math.random())
    ];
    rating.userName = 'Bot (Web)';
    rating.timestamp = new Date();
    rating.userId = firebase.auth().currentUser.uid;
    ratingPromises.push(this.addRating(restaurantID, rating));
  }
  return Promise.all(ratingPromises);
};
