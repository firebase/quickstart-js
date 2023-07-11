import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Restaurant } from '../restaurant-card/restaurant';

@Component({
  selector: 'app-restuarant-page',
  templateUrl: './restuarant-page.component.html',
  styleUrls: ['./restuarant-page.component.css']
})
export class RestuarantPageComponent implements OnInit {
  restaurantID: string = "";
  restaurantData: Observable<Restaurant> = new Observable();
  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.restaurantID = id;

    this.restaurantData = this.route.paramMap.pipe(
      switchMap(params => {
        return this.firestore.doc('restaurants/' + id).valueChanges() as Observable<Restaurant>;
      })
    )
  }
}
