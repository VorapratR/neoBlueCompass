import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PsuHospitalService, Locations} from 'src/app/services/psu-hospital.service';
@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit, OnDestroy {
  allLocations: Array<Locations> = [];
  filterLocations: Array<Locations>  = [];
  lastPage  = false;
  textStatus = 'สถานที่ทั้งหมด';
  searchInput = '';
  typeShowData = true;
  asub: Subscription;
  constructor(private psuHospitalService: PsuHospitalService) {
    this.psuHospitalService.getAllLocations().subscribe(
      data => {
        this.allLocations = data;
        this.filterLocations = data;
      }
    );
  }

  ngOnInit() {
  }

  inputSearch(event) {
    this.textStatus = 'ผลการค้นหา';
    const result = event.target.value;
    this.searchInput = result;
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
