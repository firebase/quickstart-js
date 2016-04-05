Firebase Auth Quickstart
=============================

The Firbase auth quickstart demonstrate several methods for signing in. 

The Firebase email/password quickstart demonstrates using a Firebase stored email & password - you can both create and sign in a user. 

The Firebase Google Sign in quickstart demonstrates using a Google account to authenticate to Firebase. 

The Firebase Facebook Login quickstart demonstrates using a Facebook account to authenticate to Firebase.

The Firebase custom auth web quickstart demonstrates how to authenticate with the Firebase user management
system with a user who has been authenticated from your own pre-existing authentication system.This is done by generating a token in a specific format, which is signed using the private key from a service account downloaded from the Google Developer Console. This token can then be passed to your client application which uses it to authenticate to Firebase.

Introduction
------------

- [Read more about Firebase Custom Auth](https://developers.google.com/firebase)

Getting Started
---------------

- Set up your project on the [Firebase Console](http://g.co/firebase).
- Enable the authentication method you want to use in the User Management tab - you don't need to enable custom auth.
- In the [Google Developer Console](https://console.developers.google.com), access the project you created in the Firebase Console. 
- In the search box search for an select "Credentials" and create a Browser API key restricted to the domain you are using.
- For Custom Auth, also create a new Service Account, and download the JSON representation.
- For Google Sign In you will need to create a client ID with a Javascript Origin field set to your domain.
- Edit the .html for the authentication method you want to try and fill in the API key and Database URL values in index.html. You can see the database URL from the Database section on the Firebase Console.
- Open the sample .html in a web browser. Note that for Google Sign In you must use a webserver of some kind, file:// hosted pages wont work.

Support
-------

https://developers.google.com/firebase/support/

License
-------

Copyright 2016 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor
license agreements.  See the NOTICE file distributed with this work for
additional information regarding copyright ownership.  The ASF licenses this
file to you under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License.  You may obtain a copy of
the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
License for the specific language governing permissions and limitations under
the License.
