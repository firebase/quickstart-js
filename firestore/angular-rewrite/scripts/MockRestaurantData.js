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
 * TODO(abradham): Grab project ID and Firestore URL from environments.js file
 */



/**
 * Adds a set of mock Restaurants to Firestore database.
 */
const generateMockRestaurants = () =>  {
  var promises = [];

  for (var i = 0; i < 20; i++) {
    var name =
        this.getRandomItem(this.data.words) +
        ' ' +
        this.getRandomItem(this.data.words);
    var category = this.getRandomItem(this.data.categories);
    var city = this.getRandomItem(this.data.cities);
    var price = Math.floor(Math.random() * 4) + 1;
    var photoID = Math.floor(Math.random() * 22) + 1;
    var photo = 'https://storage.googleapis.com/firestorequickstarts.appspot.com/food_' + photoID + '.png';
    var numRatings = 0;
    var avgRating = 0;

    var promise = this.addRestaurant({
      name: name,
      category: category,
      price: price,
      city: city,
      numRatings: numRatings,
      avgRating: avgRating,
      photo: photo
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
const addMockRatings = (restaurantID) =>  {
  var ratingPromises = [];
  for (var r = 0; r < 5*Math.random(); r++) {
    var rating = this.data.ratings[
      parseInt(this.data.ratings.length*Math.random())
    ];
    rating.userName = 'Bot (Web)';
    rating.timestamp = new Date();
    rating.userId = firebase.auth().currentUser.uid;
    ratingPromises.push(this.addRating(restaurantID, rating));
  }
  return Promise.all(ratingPromises);
};


const addRating = (restaurantID, rating) => {
    const collection = firebase.firestore().collection('restaurants');
    const document = collection.doc(restaurantID);
    const newRatingDocument = document.collection('ratings').doc();
  
    return firebase.firestore().runTransaction((transaction) => {
      return transaction.get(document).then((doc) => {
        const data = doc.data();
  
        const newAverage =
            (data.numRatings * data.avgRating + rating.rating) /
            (data.numRatings + 1);
  
        transaction.update(document, {
          numRatings: data.numRatings + 1,
          avgRating: newAverage
        });
        return transaction.set(newRatingDocument, rating);
      });
    });
  };

addRestaurant =  (data) => {
    const collection = firebase.firestore().collection('restaurants');
    return collection.add(data);
  };
  