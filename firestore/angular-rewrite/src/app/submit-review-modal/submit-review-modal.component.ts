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

import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Firestore } from '@angular/fire/firestore';
import { Rating } from '../review-list/ratings';

@Component({
  selector: 'app-submit-review-modal',
  templateUrl: './submit-review-modal.component.html',
  styleUrls: ['./submit-review-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SubmitReviewModalComponent {
  private firestore: Firestore = inject(Firestore);
  public review: Rating = {
    rating: 5,
    text: ""
  }

  constructor(
    public dialogRef: MatDialogRef<SubmitReviewModalComponent>,
  ) { }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSubmitClick() {
    this.dialogRef.close();
  }

  public submitNewReview() { }
}
