# Firebase Cloud Functions Quickstart

This quickstart demonstrates using Google Cloud Functions (GCF) and its interaction with a Firebase DB through a simple Web UI.

## Introduction

 - [Read more about GCF](https://sites.google.com/a/google.com/apheleia/)
 - [Read more about Hearth: GCF integration with Firebase](https://sites.google.com/a/google.com/hearth/home)


## Prerequisites

 - [Sign up for GCF EAP](http://go/apheleia-alpha-signup-internal)
 - [Sign up for Hearth EAP](go/hearth-alpha-signup)


## Initial setup, build tools and dependencies

The Firebase Cloud Functions Quickstart is build using JavaScript, Node and Firebase and hosted on Firebase static hosting and Google Cloud Functions. JavaScript dependencies are managed using [bower](http://bower.io/) and Build/Deploy tools dependencies are managed using [npm](https://www.npmjs.com/).

You need to have installed [npm](https://www.npmjs.com/) which typically comes with [Node.js](https://nodejs.org).

Install the Firebase CLI Alpha:
 - Download it at [go/hearth-alpha-cli](http://go/hearth-alpha-cli)
 - Install it using `npm install -g firebase-cli-hearth.tar.gz` (might have to `sudo`)

Clone this repo and enter the `functions` directory:

```bash
git clone sso://devrel/samples/firebase/quickstart/web
cd web/functions
```

Now you need to create a Firebase/Google Project. Do this on the [App Manager (Staging)](https://pantheon-staging-sso.corp.google.com/mobilesdk/console/)

> PS: If this give you an error you need to initially follow a small process to enable the experiment on [this doc](https://docs.google.com/document/d/18iI_4uG6uh_AcewWD9OVTQbq_xNZRNAUzgcf7QML2Ek/edit#heading=h.36bxeqj15c70)

Find your Firebase DB URL. You can find it in the **Database** section. It will look like:
`https://<YOUR_APP_ID>.firebaseio-staging.com/` Note your **App ID**.

Change `<YOUR_APP_ID>` in the `firebase.json` and in the `scripts/main.js` file with the App ID that's part of the Firebase DB URL.

Enable the Google Cloud Functions APIs on your project:
 - Open [this page](https://console.developers.google.com/flows/enableapi?apiid=cloudfunctions,container,compute_component,storage_component,pubsub,logging) to enable the APIs.
 - Choose the project you created earlier and click **Continue**.
 - Click the blue button which says **Go to credentials**.
 - Create a service account and download the credentials as a JSON file:
   - Click "Sandwich" menu button and select **Service Account**.
   - Make sure **JSON** is selected and click the **Create** button.
   - This downloads a JSON file. Save it in your quickstart directory as `secrets.json`

[Enable Billing](https://console.developers.google.com/project/_/settings) for your project. You may have to [create a Billing account](https://console.developers.google.com/project) first.

Run `firebase auth` and authenticate with your account.


## Start a local development server

You can start a local development server by running:

```bash
firebase serve
```

Then open [http://localhost:5000](http://localhost:5000)

You'll see a working Guestbook. Simply add some messages and they should appear in the card below.

The GCF haven't been deployed yet so they are not active. Once we've deployed the GCF in the next step all the messages will be changed to all uppercase characters.


## Deploy the app to prod

Deploy to Firebase using the following command:

```bash
firebase deploy -m "Cool new deploy"
```

This deploys a new version of your code that will be served from `https://<APP_ID>.firebaseapp-staging.com`

This also deploys and activate the GCF which will uppercase all your messages.


## Contributing

We'd love that you contribute to the project. Before doing so please read our [Contributor guide](../CONTRIBUTING.md).


## License

© Google, 2011. Licensed under an [Apache-2](../LICENSE) license.
