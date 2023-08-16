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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomepageComponent } from './homepage.component';
import { HomepageFirestore } from './hompage.service';

import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { projectConfig } from 'src/environments/environment.default';
import { QueryConstraint, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Injectable } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DEFAULT_SORT_DATA } from '../filter-dialog/dialogdata';
import { Observable, of } from 'rxjs';
import { Restaurant } from 'types/restaurant';


/**
 * This is a mock implementation of the `HomepageFirestore` class that returns
 * mock restaurant data without calling Firestore methods. For more information
 * about this class, and dependency inject in Angular more generally, see the 
 * comment on line 29 of `homepage.service.ts`.
 */
@Injectable()
class MockHomepageFirestore extends HomepageFirestore {
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

  override getRestaurantsGivenConstraints(
    constraints: QueryConstraint[]): Observable<Restaurant[]> {
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


describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        provideFirebaseApp(() => initializeApp(projectConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth())],
      declarations: [HomepageComponent],
      providers: [
        {
          provide: HomepageFirestore,
          useClass: MockHomepageFirestore
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ],
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
    const emptyRestaurantsDiv = fixture.debugElement.query(By.css("#empty-restaurants-container"));

    expect(emptyRestaurantsDiv).toBeNull();
  });

  it('should change filters when dialog changes', waitForAsync(() => {
    let mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of({
      ...DEFAULT_SORT_DATA, price: 2,
    }));
    spyOn(component.dialog, 'open').and.returnValue(mockDialogRef);

    component.openFilterDialog();
    mockDialogRef.close();

    expect(component.sortingData).toEqual({
      ...DEFAULT_SORT_DATA, price: 2
    });

  }));


});
