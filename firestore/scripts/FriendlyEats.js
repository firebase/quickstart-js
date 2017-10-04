/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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
"use strict";

function FriendlyEats() {
  const self = this;

  self.filters = {
    city: "",
    price: "",
    category: "",
    sort: "Rating"
  };

  self.dialogs = {};

  firebase.auth().signInAnonymously().then(function ()  {
    self.initTemplates();
    self.initRouter();
    self.initReviewDialog();
    self.initFilterDialog();
  }).catch(function (err) {
    console.log(err);
  });
}

FriendlyEats.prototype.initRouter = function() {
  const self = this;
  self.router = new Navigo();

  self.router
    .on({
      "/": function ()  {
        self.updateQuery(self.filters);
      }
    })
    .on({
      "/setup": function ()  {
        self.viewSetup();
      }
    })
    .on({
      "/restaurants/*": function ()  {
        let path = self.getCleanPath(document.location.pathname);
        const id = path.split("/")[2];
        self.viewRestaurant(id);
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection("restaurants")
    .limit(1)
    .onSnapshot(function (snapshot) {
      if (snapshot.empty) {
        self.router.navigate("/setup");
      }
    });
};

FriendlyEats.prototype.getCleanPath = function(dirtyPath) {
  if (dirtyPath.startsWith("/index.html")) {
    return dirtyPath.split("/").slice(1).join("/");
  } else {
    return dirtyPath;
  }
};

FriendlyEats.prototype.getFirebaseConfig = function() {
  return firebase.apps[0].options_;
};

FriendlyEats.prototype.getRandomItem = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

FriendlyEats.prototype.data = {
  words: [
    "Bar",
    "Fire",
    "Grill",
    "Drive Thru",
    "Place",
    "Best",
    "Spot",
    "Prime",
    "Eatin'"
  ],
  cities: [
    "Albuquerque",
    "Arlington",
    "Atlanta",
    "Austin",
    "Baltimore",
    "Boston",
    "Charlotte",
    "Chicago",
    "Cleveland",
    "Colorado Springs",
    "Columbus",
    "Dallas",
    "Denver",
    "Detroit",
    "El Paso",
    "Fort Worth",
    "Fresno",
    "Houston",
    "Indianapolis",
    "Jacksonville",
    "Kansas City",
    "Las Vegas",
    "Long Island",
    "Los Angeles",
    "Louisville",
    "Memphis",
    "Mesa",
    "Miami",
    "Milwaukee",
    "Nashville",
    "New York",
    "Oakland",
    "Oklahoma",
    "Omaha",
    "Philadelphia",
    "Phoenix",
    "Portland",
    "Raleigh",
    "Sacramento",
    "San Antonio",
    "San Diego",
    "San Francisco",
    "San Jose",
    "Tucson",
    "Tulsa",
    "Virginia Beach",
    "Washington",
  ],
  categories: [
    "Brunch",
    "Burgers",
    "Coffee",
    "Deli",
    "Dim Sum",
    "Indian",
    "Italian",
    "Mediterranean",
    "Mexican",
    "Pizza",
    "Ramen",
    "Sushi",
  ],
  ratings: [
    {
      rating: 1,
      text: "Would never eat here again!"
    },
    {
      rating: 2,
      text: "Not my cup of tea."
    },
    {
      rating: 3,
      text: "Exactly okay :/"
    },
    {
      rating: 4,
      text: "Actually pretty good, would recommend!"
    },
    {
      rating: 5,
      text: "This is my favorite place. Literally."
    }
  ]
};

window.onload = function() {
  window.app = new FriendlyEats();

  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function(registration) {
        console.log(
          "ServiceWorker registration successful with scope:",
          registration.scope
        );
      })
      .catch(function(error) {
        console.log("ServiceWorker registration failed:", error);
      });
  }
};
