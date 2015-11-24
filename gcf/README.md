# Firebase Cloud Functions Quickstart - Web

This quickstart demonstrates using **Google Cloud Functions** and its interaction with a **Firebase database** through a simple **Web app**.


## Introduction

This sample app is a Message board where anyone can add messages through a Web app.
A Server Side Cloud Function automatically makes all the messages uppercase as soon as they are inserted in the Firebase database.

Further reading:

 - [Read more about Cloud Functions](https://developers.google.com/firebase/docs/cloud-functions/setup)


## Initial setup, build tools and dependencies

### 1. Install the Firebase CLI Alpha

You need to have installed [npm](https://www.npmjs.com/) which typically comes with [Node.js](https://nodejs.org).

Download the [Firebase CLI 3.0.0 Alpha](https://developers.google.com/firebase/downloads/firebase-cli.3.0.0-alpha.latest.tar.gz) and install it using:

```
npm install -g firebase-cli.3.0.0-alpha.latest.tar.gz
```

> You might have to `sudo` the command above.

Run `firebase login` and authenticate with your Google account.


### 2. Clone this repo

Clone this repo and enter the `web/gcf` directory:

```bash
git clone sso://devrel/samples/firebase/quickstart/web
cd web/gcf
```


### 3. Create a Firebase project and configure the quickstart

Create a Firebase Project on the [Firebase Console](http://g.co/firebase).

Note your Firebase database URL and your App ID. You can find your Firebase database URL in the **Database** section. It will look like:
`https://<YOUR_APP_ID>.firebaseio.com/` Note your **App ID** and also the whole **Database URL**.

Use these values to replace `<APP_ID>` in `firebase.json` and the `<DATABASE_URL>` in `scripts/main.js` and `functions/config.json`.
You can also do this automatically by running:

```bash
./setup.sh <DATABASE_URL>
```

For example: `./setup.sh https://functions-quickstart-12345.firebaseio.com/`.


### 4. Enable the Google Cloud Functions APIs

Enable the Google Cloud APIs required to run Cloud Functions on your project:

 - Open [this page](https://console.developers.google.com/flows/enableapi?apiid=cloudfunctions,container,compute_component,storage_component,pubsub,logging)
 - Choose the project you created earlier and click **Continue**

Enable Billing on your project:

 - Open [this page](https://console.developers.google.com/project/_/settings)
 - Choose the project you created earlier and click **Continue**
 - Click **Enable Billing**
 - Select one of your **Billing accounts**. You may have to [create a Billing account](https://console.developers.google.com/billing/create) first.


## Deploy the app to prod

Deploy to Firebase using the following command:

```bash
firebase deploy
```

This deploys the Web app on Firebase static hosting.
This also deploys and activate the Cloud Function that will make all of your messages uppercase.

> The first time you call `firebase deploy` on a new project the Google Compute Engine instances and Kubernetes clusters required to run Cloud Functions will be spin-up. This may take a few minutes but things will be a lot faster on subsequent deploys.


## See the results

Once your Cloud Function is deployed add the following objects to your Firebase Database manually using the Firebase Console:

```
\functions-quickstart-12345
    \messages
        \key-123456
            text: "This is my first message!"
        \key-123457
            text: "This is my second message!"
```

Adding these objects triggers the cloud function which makes the messages uppercase:

```
\functions-quickstart-12345
    \messages
        \key-123456
            text: "THIS IS MY FIRST MESSAGE!"
        \key-123457
            text: "THIS IS MY SECOND MESSAGE!"
```

Now try to add messages using the Web app which is now served from `https://<APP_ID>.firebaseapp.com`. You can open the app using:

```bash
firebase open
```

On the Web app messages will get uppercased automatically shortly after you add them.


## Debugging

Within Cloud Functions any `console.log()` statements will be logged to Cloud Logging. You can view these logs by using [this Cloud Logging filter](https://console.developers.google.com/project/_/logs?advancedFilter=metadata.serviceName:"cloudfunctions.googleapis.com").

Alternatively, you can view logs locally by entering the following in your terminal from within your project's directory:

```bash
firebase functions:log [function-name]
```

Replace `function-name` with the name of the function you'd like to view logs for. You can add an optional `-f` flag to see logs as they are written.

> To view logs locally you'll need to have [gcloud](https://cloud.google.com/sdk/) installed and have run `gcloud auth login`.


## Contributing

We'd love that you contribute to the project. Before doing so please read our [Contributor guide](../CONTRIBUTING.md).


## License

© Google, 2015. Licensed under an [Apache-2](../LICENSE) license.
