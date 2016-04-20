Firebase Storage Quickstart
=============================

The Firebase Storage quickstart demonstrates how to connect to Firebase storage, store data, and retrieve a download URL.

Introduction
------------

- [Read more about Firebase Storage](https://developers.google.com/firebase)

Getting Started
---------------

- Create your project on the [Firebase Console](http://g.co/firebase).
- Copy the initialization snippet from **Auth > WEB SETUP** into the `<head>` section of `index.html`.
- Enable Anonymous auth in the **Auth** section.
- See [these instructions](https://developers.google.com/firebase/docs/storage/configure-a-bucket) to create a Firebase Storage bucket.
- Specify the bucket name in the web initialization snippet `config` object by adding a `storageBucket` attribute:
```javascript
var config = {
  storageBucket: "<PROJECT_ID>.appspot.com", // Add this line!
  apiKey: "...",
  ...
}
```
- Open the sample index.html in a web browser or run `firebase serve`

Support
-------

https://developers.google.com/firebase/support/

License
-------

© Google, 2016. Licensed under an [Apache-2](../LICENSE) license.
