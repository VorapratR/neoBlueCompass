import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

export interface Location {
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

  private locations: Observable<Location[]>;
  private locationCollection: AngularFirestoreCollection<Location>;
  constructor(private https: HttpClient, private afs: AngularFirestore) {
    this.locationCollection = this.afs.collection<Location>('location');
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

  getAllLocations(): Observable<Location[]> {
    return this.locations;
  }

  public loadLocation(): Observable<any> {
    return this.https.get('../../assets/map.json');
  }

}
