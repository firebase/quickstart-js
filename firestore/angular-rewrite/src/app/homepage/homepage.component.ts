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

import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Restaurant } from '../restaurant-card/restaurant';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { DEFAULT_SORT_DATA, DialogData } from '../filter-dialog/dialogdata';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent {
  title = 'FriendlyEats-Homepage';
  restaurants = this.store.collection('restaurants').valueChanges({ idField: 'id' }) as Observable<Restaurant[]>;
  sortingData: DialogData = DEFAULT_SORT_DATA;

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: this.sortingData
    });

    dialogRef.afterClosed().subscribe(result => this.sortingData = result);

  }

  constructor(public dialog: MatDialog, private router: Router, private store: AngularFirestore) { }
}
