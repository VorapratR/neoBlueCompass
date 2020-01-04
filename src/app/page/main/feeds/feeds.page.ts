import { Component, OnInit } from '@angular/core';
import { Location } from '../../../model/location';
import { PsuHospitalService } from '../../../services/psu-hospital.service';
@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit {
  allLocations: Array<Location> = [];
  filterLocations: Array<Location>  = [];
  lastPage  = false;
  textStatus = 'สถานที่ทั้งหมด';
  searchInput = '';
  typeShowData = true;
  constructor(private psuHospitalService: PsuHospitalService) {
    this.psuHospitalService.loadLocation(0).subscribe(
      results => {
        this.allLocations = results.results;
        this.filterLocations = results.results;
        this.lastPage = results.lastPage;
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

}
