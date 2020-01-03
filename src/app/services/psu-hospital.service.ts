import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationQuery } from '../model/location';
@Injectable({
  providedIn: 'root'
})
export class PsuHospitalService {

  constructor(private https: HttpClient) {}

  loadLocation(page): Observable<LocationQuery> {
    const url = `http://stapi.co/api/v1/rest/location/search?pageNumber=${page}`;
    return this.https.get(url).pipe(
      map(data => {
          return {
            results: data['locations'],
            lastPage: data['page']['lastPage']
          };
        })
      );
  }
}
