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

import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Rating } from './ratings';
import { Observable, switchMap } from 'rxjs';;

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input() restaurantID: string | null = null;
  reviews: Observable<Rating[]> = new Observable();
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    if (this.restaurantID) {
      this.reviews = this.firestore.collection(`/restaurants/mRz0oeRzFU2Id9he90co/ratings`).valueChanges({ idField: 'id' }) as Observable<Rating[]>;
      console.log(this.restaurantID)
    }
  }
}
