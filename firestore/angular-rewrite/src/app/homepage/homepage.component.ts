import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Restaurant } from '../restaurant-card/restaurant';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { DialogData } from '../filter-dialog/dialogdata';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent {
  title = 'FriendlyEats-Homepage';
  restaurants = this.store.collection('restaurants').valueChanges({ idField: 'id' }) as Observable<Restaurant[]>;

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: {
        sortBy: "rating",
        category: null,
        city: null,
        price: null

      } as DialogData
    });
  }

  constructor(public dialog: MatDialog, private router: Router, private store: AngularFirestore) { }
}
