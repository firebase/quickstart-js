import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as util from "util";
import { DocumentSnapshot, DocumentData } from "@google-cloud/firestore";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

"use strict";

// Uncomment these lines to run our Cloud Functions in the emulator

// const sa = require( './super_secret/new-test-projects-a746c-firebase-adminsdk-ttdbm-3227776c2b.json');

// admin.initializeApp({
//   credential: admin.credential.cert(sa),
//   databaseURL: "http://localhost:8080/"
// });

const app = admin.initializeApp();
const firestore = app.firestore();


/**
 * Demonstrate a basic working cloud function
 */
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

/**
 * Callable cloud function to get back a list of favorite restaurants for a user
 */
export const getFavorites_v0 = functions.https.onCall(async (data, context) => {
  const userID = data.uid;
  try {
    if (userID) {
      console.log(`I am going to get favorites for user ${userID}`);
      const userDoc = await firestore
        .doc(`users/${userID}`)
        .get();
      console.log(`Here is my user doc`);
      console.log(util.inspect(userDoc.data()));
      const userData = userDoc.data();
      if (!userData) {
        console.error("Data not found for ", userID);
        return [];
      }
      const favorites = userData.favorites;
      if (!favorites) {
        console.log("User has no favorites");
        return [];
      }
      const fetchPromises: Promise<DocumentSnapshot>[] = favorites.map((restID: String) => {
        console.log('I\'m gonna fetch data for ', restID);
        return firestore.doc(`restaurants/${restID}`).get();
      });
      const docSnaps = await Promise.all(fetchPromises);
      const responseArray = docSnaps.map(snapshot => {
        // Fancy people could use the spread operator here.
        const docData = snapshot.data()!;
        docData[".id"] = snapshot.id;
        return docData;
      })
      return responseArray;
    } else {
      console.error("No user ID");
      return [];
    }
  } catch (error) {
    console.error("Received an error: ", error);
    throw new functions.https.HttpsError(
      "internal",
      "Got some unknown error " + error
    );
  }
});

/**
 * The getFavorites function as an HTTPS call, which was a little easier to demo at first
 */
export const getFavorites_as_http = functions.https.onRequest(
  async (request, response) => {
    const userID = request.query.uid;
    if (userID !== null) {
      console.log(`I am going to get favorites for user ${userID}`);
      const userDoc = await firestore
        .doc(`users/${userID}`)
        .get();
      console.log(`Here is my user doc: `);
      console.log(util.inspect(userDoc.data()));
      const userData = userDoc.data();
      if (userData === null) {
        response.send("No user data");
        return;
      }
      const favorites = userData!.favorites;
      if (favorites === null) {
        response.send("You have no favorites");
        return;
      }
      const fetchPromises: Promise<DocumentSnapshot>[] = favorites.map((restID: String) => {
          console.log('I\'m gonna fetch data for ', restID);
          return firestore.doc(`restaurants/${restID}`).get();
      })
      const docSnaps = await Promise.all(fetchPromises);
      const responseArray = docSnaps.map(snapshot => snapshot.data()!);
      response.send(responseArray);
    } else {
      response.send("No user id!");
    }
  }
);
