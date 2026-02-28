/**
 * Copyright 2023 Google LLC
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

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { projectConfig } from './environments/environment.default';
import { connectFirestoreEmulator } from '@firebase/firestore';
import { DefaultHomepageFirestore, HomepageFirestore } from './app/homepage/hompage.service';
import { provideRouter, Routes } from '@angular/router';
import { HomepageComponent } from './app/homepage/homepage.component';
import { RestuarantPageComponent } from './app/restuarant-page/restuarant-page.component';

const routes: Routes = [
  { path: 'restaurant/:id', component: RestuarantPageComponent },
  { path: '**', component: HomepageComponent },
];

bootstrapApplication(AppComponent, { providers : [    provideFirebaseApp(() => initializeApp(projectConfig)),
    provideAuth(() => {
      const auth = getAuth();
      if (auth.app.options.projectId!.indexOf('demo') === 0)
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');

      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();

      if (firestore.app.options.projectId!.indexOf('demo') === 0)
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);

      return firestore;
    }),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    { provide: HomepageFirestore, useClass: DefaultHomepageFirestore },
   provideRouter(routes)
] })
  .catch(err => console.error(err));
