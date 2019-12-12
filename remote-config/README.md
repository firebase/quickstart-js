Firebase Remote Config Quickstart
==============================

The Firebase Remote Config Web quickstart app demonstrates using Remote
Config to define user-facing text in a web app.

Introduction
------------

This is a simple example of using Remote Config to override in-app default
values by defining server-side parameter values in the Firebase console. This
example demonstrates a small subset of the capilities of Firebase Remote
Config. To learn more about how you can use Firebase Remote Config in your app,
see
[the Firebase Remote Config introduction](https://firebase.google.com/docs/remote-config/).

Getting started
---------------

1. Follow step 1 and 2 [here](https://firebase.google.com/docs/web/setup#register-app) to register a web app with your Firebase project
1. Set up Remote Config for your Firebase project:
    1. In the Firebase console, open your project
    1. Select Remote Config from the menu to view the Remote Config dashboard
    1. Define a parameter with key `welcome_message` and default value `Hello World`
    1. Click "Add parameter", and then click "Publish changes"
1. You must have the Firebase CLI installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
1. On the command line run `firebase use --add` and select the Firebase project you have created
1. On the command line run `firebase serve` using the Firebase CLI tool to serve your web app
1. Change the parameter value in the Firebase Console (the value of
  `welcome_message`), and then click "Publish changes"
1. Tap **Fetch Remote Welcome** in the app to fetch new parameter values and see
  the resulting change in the app.

Best practices
--------------
This section provides some additional information about how the quickstart
example sets in-app default parameter values and fetches values from the Remote
Config service

### In-app default parameter values ###

In-app default values are set using a JSON object using the `setDefaults` method.
Then, you can override only those values that you need to change from the
Firebase console or the REST API. This lets you use Remote Config for any default
value that you might want to override in the future, without the need to set all of
those values in the Firebase console.

### Fetch values from the Remote Config service ###

When an app calls `fetch`, locally stored parameter values are used unless the
minimum fetch interval is reached. The minimal fetch interval is determined by:

1. The parameter passed to `fetch(long minFetchInterval)`.
2. The minimum fetch interval set in Remote Config settings.
3. The default minimum fetch interval, 12 hours.

Fetched values are immediately activated when retrieved using `fetchAndActivate`.
In the quickstart sample app, you call `fetchAndActivate` from the UI by tapping
**Fetch Remote Welcome**.

To control when fetched values are activated and available to your app use `fetch`.
The values are locally stored, but not immediately activated. To activate fetched
values so that they take effect, call the `activate` method.

You can also create a Remote Config Setting to enable "developer mode". By
using a small (even 0) value for `minimumFetchIntervalInSeconds`, you can make many
more requests per hour, so you can test your app with different Remote Config
parameter values during development.

- To learn more about fetching data from remote config, see [Firebase Remote Config
  loading strategies](https://firebase.google.com/docs/remote-config/loading).
- To learn about parameters and conditions that you can use to change the
  behavior and appearance of your app for segments of your userbase, see
  [Remote Config Parameters and Conditions](https://firebase.google.com/docs/remote-config/parameters).

Support
-------

- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase-remote-config)
- [Firebase Support](https://firebase.google.com/support/)

License
-------

Copyright 2019 Google, Inc.

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
