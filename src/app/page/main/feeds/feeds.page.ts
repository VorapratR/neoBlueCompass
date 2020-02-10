import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '../../../model/location';
import { PsuHospitalService } from '../../../services/psu-hospital.service';
import { Subscriber, Subscription } from 'rxjs';
@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit, OnDestroy {
  allLocations: Array<Location> = [];
  filterLocations: Array<Location>  = [];
  lastPage  = false;
  textStatus = 'สถานที่ทั้งหมด';
  searchInput = '';
  typeShowData = true;
  asub: Subscription;
  constructor(private psuHospitalService: PsuHospitalService) {
    this.asub = this.psuHospitalService.loadLocation().subscribe(
      data => {
        this.allLocations = data.locations;
        this.filterLocations = data.locations;
      }
    );
  }

  ngOnInit() {
  }

  inputSearch(event) {
    this.textStatus = 'ผลการค้นหา';
    const result = event.target.value;
    this.searchInput = result;
    console.log(this.searchInput);
    this.setFilteredLocations();
  }

  setFilteredLocations() {
    this.filterLocations = this.allLocations.filter((item) => {
      return item.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1;
    });
  }

  setTypeShowData() {
    this.typeShowData = !this.typeShowData;
  }

  ngOnDestroy() {
    this.asub.unsubscribe();
  }
}
