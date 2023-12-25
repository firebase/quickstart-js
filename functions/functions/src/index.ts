/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import * as admin from 'firebase-admin';
import { setGlobalOptions } from 'firebase-functions/v2';
import {
  beforeUserCreated,
  beforeUserSignedIn,
} from 'firebase-functions/v2/identity';

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

export const beforeCreateUser = beforeUserCreated(async (event) => {
  console.log('beforeCreateUser', JSON.stringify(event));
  return {
    disabled: false,
  };
});

export const beforeSignIn = beforeUserSignedIn(async (event) => {
  console.log('beforeSignIn', JSON.stringify(event));
  return {
    disabled: false,
  };
});
