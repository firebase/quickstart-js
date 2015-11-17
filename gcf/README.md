# Firebase Cloud Functions Quickstart

This quickstart demonstrates using Google Cloud Functions and its interaction with a Firebase DB through a simple Web UI.


## Introduction

This sample app is a Message board where anyone can add messages using a Web UI.
A Server Side Cloud Function automatically makes all the messages uppercase.

Further reading:

 - [Read more about Cloud Functions](https://sites.google.com/a/google.com/apheleia/)
 - [Read more about Hearth: Cloud Functions integration with Firebase](https://sites.google.com/a/google.com/hearth/home)


## Initial setup, build tools and dependencies

You need to have installed [npm](https://www.npmjs.com/) which typically comes with [Node.js](https://nodejs.org).

Install the Firebase CLI Alpha:

 - Download the [Firebase CLI 3.0.0 Alpha](https://developers.google.com/firebase/downloads/firebase-cli.3.0.0-alpha.latest.tar.gz)
 - Install it using `npm install -g firebase-cli.3.0.0-alpha.latest.tar.gz` (might have to `sudo`)

Clone this repo and enter the `functions` directory:

```bash
git clone sso://devrel/samples/firebase/quickstart/web
cd web/gcf
```

Create a Firebase/Google Developer Project. Do this on the [Firebase App Manager](http://go/appmanager-staging)

Find your Firebase DB URL and your App ID. You can find this in the **Database** section. It will look like:
`https://<YOUR_APP_ID>.firebaseio.com/` Note your **App ID** and the **Database URL**.

Use these values to replace `<APP_ID>` in the `firebase.json` and the `<DATABASE_URL>` in `scripts/main.js` and `functions/config.json`.
You can also do this automatically by running:

```bash
./setup.sh <DATABASE_URL>
```

For example: `setup.sh https://hearth-quickstart-752c4.firebaseio.com/`.

Enable the Google Cloud Functions APIs on your project:

 - Open [this page](https://console.developers.google.com/flows/enableapi?apiid=cloudfunctions,container,compute_component,storage_component,pubsub,logging)
 - Choose the project you created earlier and click **Continue**

Enable Billing on your project:

 - Open [this page](https://console.developers.google.com/project/_/settings)
 - Choose the project you created earlier and click **Continue**
 - Click **Enable Billing**
 - Select one of your **Billing accounts**. You may have to [create a Billing account](https://pantheon.corp.google.com/billing/create) first.

Run `firebase auth` and authenticate with your Google account.


## Start a local development server

You can start a local development server by running:

```bash
firebase serve
```

Then open [http://localhost:5000](http://localhost:5000)

You'll see a working Message Board. Simply add some messages and they should appear in the card below.

The Cloud Function hasn't been deployed yet so they are not active. Once we've deployed the Cloud Function in the next step the messages will be uppercased.


## Deploy the app to prod

Deploy to Firebase using the following command:

```bash
firebase deploy
```

This deploys a new version of your front end code on Firebase static hosting.
This also deploys and activate the Cloud Function taht will make all of your messages uppercase.

> The first time you call `firebase deploy` your GCP project is spinning up the GCE instances and Kubernetes clusters required to run Cloud Functions. This may take a while but things will be a lot faster on subsequent deploys.

Once the deploy succeeds your app is served from `https://<APP_ID>.firebaseapp.com`. Open the app using:

```bash
firebase open
```

On the Web UI messages will now get uppercased automatically shortly after you add them.

Also have a look at the [Cloud Function logs](https://console.developers.google.com/project/_/logs?advancedFilter=metadata.serviceName:"cloudfunctions.googleapis.com") of your app and you should see entries written by the Cloud Function.


## Contributing

We'd love that you contribute to the project. Before doing so please read our [Contributor guide](../CONTRIBUTING.md).


## License

© Google, 2015. Licensed under an [Apache-2](../LICENSE) license.
