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
import { Firestore, QueryConstraint, collection, collectionData, query } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { Restaurant } from "types/restaurant";

@Injectable()
export abstract class HomepageFirestore {
    store: Firestore;
    constructor(store: Firestore) {
        this.store = store;
    }

    abstract getRestaurantCollectionData(): Observable<Restaurant[]>;

    abstract getRestaurntsGivenConstraints(constraints: QueryConstraint[]): Observable<Restaurant[]>;
}


@Injectable()
export class DefaultHomepageFirestore extends HomepageFirestore {
    override getRestaurantCollectionData(): Observable<Restaurant[]> {
        const restaurantsCollectionRef = collection(this.store, 'restaurants');
        return collectionData(restaurantsCollectionRef, { idField: 'id' }) as Observable<Restaurant[]>;
    }

    override getRestaurntsGivenConstraints(constraints: QueryConstraint[]): Observable<Restaurant[]> {
        const restaurantsCollectionRef = collection(this.store, 'restaurants');
        return collectionData(query(restaurantsCollectionRef, ...constraints),
            { idField: 'id' }) as Observable<Restaurant[]>;
    }
}

@Injectable()
export class MockHomepageFirestore extends HomepageFirestore {
    override getRestaurantCollectionData(): Observable<Restaurant[]> {
        const mockRestaurants: Restaurant[] = [{
            id: "Mock 1",
            avgRating: 3,
            category: "Italian",
            city: "Atlanta",
            name: "Mock Eats 1",
            numRatings: 0,
            photo: "Mock Photo URL",
            price: 1
        }]

        return of(mockRestaurants);
    }

    override getRestaurntsGivenConstraints(constraints: QueryConstraint[]): Observable<Restaurant[]> {
        const mockRestaurants: Restaurant[] = [{
            id: "Mock 1",
            avgRating: 3,
            category: "Italian",
            city: "Atlanta",
            name: "Mock Eats 1",
            numRatings: 0,
            photo: "Mock Photo URL",
            price: 1
        }]

        return of(mockRestaurants);
    }
}