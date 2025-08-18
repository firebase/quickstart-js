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

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, doc, docData, } from '@angular/fire/firestore';
import { Restaurant } from '../../types/restaurant';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  SubmitReviewModalComponent
} from '../submit-review-modal/submit-review-modal.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ReviewListComponent } from '../review-list/review-list.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-restuarant-page',
  templateUrl: './restuarant-page.component.html',
  styleUrls: ['./restuarant-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    ReviewListComponent,
  ]
})
export class RestuarantPageComponent implements OnInit {
  restaurantData: Observable<Restaurant> = new Observable();
  private firestore: Firestore = inject(Firestore);
  private restaurantId = "";

  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }

  openDialog(): void {
    this.dialog.open(SubmitReviewModalComponent, { data: this.restaurantId });
  }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id') as string;
    const docRef = doc(this.firestore, `restaurants/${this.restaurantId}`);

    this.restaurantData = docData(
      docRef, { idField: "id" }) as Observable<Restaurant>;
  }
}
