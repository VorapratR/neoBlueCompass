import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationQuery } from '../model/location';
@Injectable({
  providedIn: 'root'
})
export class PsuHospitalService {

  constructor(private https: HttpClient) {
    this.loadLocation().subscribe(data => {
      // console.log(data);
    });
  }
  public loadLocation(): Observable<any> {
    return this.https.get('../../assets/map.json');
  }
  // loadLocation(): Observable<LocationQuery> {
  //   // const mapsData = require('../../assets/map.json');
  //   // const nodeDijkstra = require('node-dijkstra');
  //   console.log(typeof (mapsData));
  //   return this.https.get(mapsData).pipe(
  //     map(data => {
  //       return {
  //         // tslint:disable-next-line: no-string-literal
  //         results: data['locations']
  //       };
  //     })
  //   );

  // }
}
    // const url = `http://stapi.co/api/v1/rest/location/search?pageNumber=${page}`;
    // return this.https.get(url).pipe(
    //   map(data => {
    //       return {
    //         results: data['locations'],
    //         lastPage: data['page']['lastPage']
    //       };
    //     })
    //   );