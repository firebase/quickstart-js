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

import { Injectable } from "@angular/core";
import {
    Firestore,
    QueryConstraint,
    collection,
    collectionData,
    query
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Restaurant } from "types/restaurant";


/**
 * The `HomepageFirestore` service class provides functionality that allows
 * the Homepage component to recieve data from the Firestore database.
 * The class is marked with the @Injectable decorator, which allows it to be
 * injected into the Homepage component via the `inject()` function. The
 * benefit of injecting this service class, as opposed to calling the Firestore
 * methods from directly within the Homepage component, is that injection 
 * allows for the component's UI logic to be decoupled from its datafetching
 * logic. This decoupling enables the HomepageComponent to be unit tested with
 * a mock implementation of this datafetching class that simply returns 
 * predefined data without needing to establish a connection to a running 
 * instance of Firestore (as showcased by the MockHomepageFirestore implemented 
 * in `homepage.component.spec.ts`). Such decoupling, and the ability to be 
 * unit tested, would not be possible if the HomepageComponent's Firestore 
 * methods had been written directly into the`homepage.component.ts` file.
 * 
 * For more information about dependency injection and unit testing in Angular
 * visit the Angular docs: https://angular.io/guide/dependency-injection
 */

@Injectable()
export abstract class HomepageFirestore {
    abstract getRestaurantCollectionData(): Observable<Restaurant[]>;

    abstract getRestaurantsGivenConstraints(constraints: QueryConstraint[]):
        Observable<Restaurant[]>;
}


@Injectable()
export class DefaultHomepageFirestore extends HomepageFirestore {
    store: Firestore;
    constructor(store: Firestore) {
        super();
        this.store = store;
    }
    override getRestaurantCollectionData(): Observable<Restaurant[]> {
        const restaurantsCollectionRef = collection(this.store, 'restaurants');
        return collectionData(restaurantsCollectionRef,
            { idField: 'id' }) as Observable<Restaurant[]>;
    }

    override getRestaurantsGivenConstraints(
        constraints: QueryConstraint[]): Observable<Restaurant[]> {
        const restaurantsCollectionRef = collection(this.store, 'restaurants');
        return collectionData(query(restaurantsCollectionRef, ...constraints),
            { idField: 'id' }) as Observable<Restaurant[]>;
    }
}