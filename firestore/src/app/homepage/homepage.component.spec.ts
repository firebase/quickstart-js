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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageComponent } from './homepage.component';
import { HomepageFirestore } from './hompage.service';

import { MatDialogModule } from '@angular/material/dialog';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { projectConfig } from 'src/environments/environment.default';
import {
  QueryConstraint,
  getFirestore,
  provideFirestore
} from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Injectable } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DEFAULT_SORT_DATA } from '../filter-dialog/dialogdata';
import { Observable, of } from 'rxjs';
import { Restaurant } from 'types/restaurant';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { MatCardModule } from '@angular/material/card';

/**
 * This is a mock implementation of the `HomepageFirestore` class that returns
 * mock restaurant data without calling Firestore methods. For more information
 * about this class, and dependency inject in Angular more generally, see the 
 * comment on line 29 of `homepage.service.ts`.
 */
@Injectable()
export class MockHomepageFirestore extends HomepageFirestore {

  override getRestaurantCollectionData(): Observable<Restaurant[]> {
    return of([{
      id: "Mock 1",
      avgRating: 3,
      category: "Italian",
      city: "New York",
      name: "Mock Eats 1",
      numRatings: 0,
      photo: "Mock Photo URL",
      price: 1
    },
    {
      id: "Mock 2",
      avgRating: 3,
      category: "Soul Food",
      city: "Atlanta",
      name: "Mock Eats 2",
      numRatings: 0,
      photo: "Mock Photo URL",
      price: 2
    }])
  }

  override getRestaurantsGivenConstraints(
    constraints: QueryConstraint[]): Observable<Restaurant[]> {
    return of([{
      id: "Mock 2",
      avgRating: 3,
      category: "Soul Food",
      city: "Atlanta",
      name: "Mock Eats 2",
      numRatings: 0,
      photo: "Mock Photo URL",
      price: 2
    }]);
  }
}


describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        provideFirebaseApp(() => initializeApp(projectConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
      ],
      declarations: [HomepageComponent, RestaurantCardComponent],
      providers: [{
        provide: HomepageFirestore,
        useClass: MockHomepageFirestore
      }]
    });
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /** 
   * Tests to see that the #empty-restaurants-container div has not
   * been rendered. This div is rendered only when no restaurants have been 
   * retrieved from Firestore (or, in this case, the MockHomepageFirestore 
   * element).
   * */
  it('should call service and get restuarants on init', () => {
    const emptyRestaurantsDiv = fixture.debugElement
      .query(By.css("#empty-restaurants-container"));

    expect(emptyRestaurantsDiv).toBeNull();
  });

  /**
   * Tests to see that exactly 1 restaurant is rendered when filtering for
   * restaurants with a price of just one $. This tests that the 
   * `getRestaurantsGivenConstraints` function is called in the 
   * MockHomepageFirestoreClass, and that the `sortingData` field
   * was correctly updated.
   */
  it('should change restaurants when filters change', () => {
    let mockDialogRef = jasmine.createSpyObj('MatDialogRef',
      ['close', 'afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of({
      ...DEFAULT_SORT_DATA, price: 1,
    }));
    spyOn(component.dialog, 'open').and.returnValue(mockDialogRef);

    component.openFilterDialog();
    mockDialogRef.close();
    fixture.detectChanges();

    const restaurantDivs = fixture.debugElement
      .queryAll(By.css(".grid-cell"));
    expect(restaurantDivs.length).toEqual(1);
  });
});
