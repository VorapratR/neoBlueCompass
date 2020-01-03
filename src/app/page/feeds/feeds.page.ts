import { Component, OnInit } from '@angular/core';
import { Location } from '../../model/location';
import { PsuHospitalService } from './../../services/psu-hospital.service';
@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit {
  locations: Array<Location> = [];
  lastPage  = false;
  constructor(private psuHospitalService: PsuHospitalService) {}

  ngOnInit() {
    this.psuHospitalService.loadLocation(0).subscribe(
      results => {
        this.locations = results.results;
        this.lastPage = results.lastPage;
      }
    );
  }

}
