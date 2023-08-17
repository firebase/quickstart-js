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

import { Component, inject } from '@angular/core';
import {
  where,
  QueryConstraint,
  orderBy,
} from '@angular/fire/firestore';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Restaurant } from '../../types/restaurant';
import { Observable } from 'rxjs';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { DEFAULT_SORT_DATA, DialogData } from '../filter-dialog/dialogdata';
import { Auth, signOut } from '@angular/fire/auth';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';
import { HomepageFirestore } from './hompage.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers: [
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ]
})

export class HomepageComponent {
  public auth: Auth = inject(Auth);
  title = 'FriendlyEats-Homepage';
  private sortingData: DialogData = DEFAULT_SORT_DATA;
  private homepageFirestore = inject(HomepageFirestore);
  restaurants = this.homepageFirestore
    .getRestaurantCollectionData() as Observable<Restaurant[]>;

  private fetchWithUpdatedFilters = () => {
    const constraints: QueryConstraint[] = []

    if (this.sortingData.city !== 'Any') {
      constraints.push(where('city', '==', this.sortingData.city))
    }
    if (this.sortingData.category !== 'Any') {
      constraints.push(where('category', '==', this.sortingData.category))
    }
    if (this.sortingData.price !== -1) {
      constraints.push(where('price', '==', this.sortingData.price))
    }
    if (this.sortingData.sortBy === 'Rating') {
      constraints.push(orderBy('numRatings', 'desc'));
    } else {
      constraints.push(orderBy('avgRating', 'desc'));
    }

    this.restaurants = this.homepageFirestore
      .getRestaurantsGivenConstraints(constraints);
  }

  openFilterDialog(): void {
    this.dialogRef = this.dialog.open(FilterDialogComponent, {
      data: this.sortingData
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.sortingData = result;
      this.fetchWithUpdatedFilters()
    });

  }

  openSignInDialog(): void {
    this.dialog.open(SignInModalComponent,
      { data: { isCreatingAccount: false } });
  }

  openCreateAccountDialog(): void {
    this.dialog.open(SignInModalComponent,
      { data: { isCreatingAccount: true } });
  }

  public signOutWithFirebase() {
    signOut(this.auth);
  }

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FilterDialogComponent>) { }
}
