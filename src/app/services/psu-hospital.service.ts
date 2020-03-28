import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

export interface Locations {
  id?: string;
  neighbor: {};
  x_point: number;
  y_point: number;
  floor: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class PsuHospitalService {

  private locations: Observable<Locations[]>;
  private locationCollection: AngularFirestoreCollection<Locations>;
  constructor(private https: HttpClient, private afs: AngularFirestore) {
    this.locationCollection = this.afs.collection<Locations>('location');
    this.locations = this.locationCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllLocations(): Observable<Locations[]> {
    return this.locations;
  }

  public loadLocation(): Observable<any> {
    return this.https.get('../../assets/map.json');
  }

}
