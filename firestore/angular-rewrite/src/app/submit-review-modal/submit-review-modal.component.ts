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

import { Component, ViewEncapsulation, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Rating } from '../review-list/ratings';

@Component({
  selector: 'app-submit-review-modal',
  templateUrl: './submit-review-modal.component.html',
  styleUrls: ['./submit-review-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SubmitReviewModalComponent {
  private firestore: Firestore = inject(Firestore);
  private restaurantId = this.data;
  public review: Rating = {
    rating: 5,
    text: ""
  }

  constructor(
    public dialogRef: MatDialogRef<SubmitReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string,
  ) { }

  onCancelClick() {
    this.dialogRef.close();
  }

  public async onSubmitClick() {
    const collectionRef = collection(
      this.firestore,
      `restaurants/${this.restaurantId}/ratings`);

    await addDoc(collectionRef,
      { ...this.review, userName: "Anonymous" } as Rating)
    this.dialogRef.close();
  }
}
