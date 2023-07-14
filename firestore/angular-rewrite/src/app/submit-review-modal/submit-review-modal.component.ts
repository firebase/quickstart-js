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

  public submitNewReview() { }
}
