import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../../model/location';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  @Input() location: Location;
  @Input() index: number;
  @Input() typeShowData: boolean;
  constructor(private router: Router) { }

  ngOnInit() {
    if (this.location.id.includes('baramee')) {
      this.location.building = 'อาคารบารมี ';
    } else {
      this.location.building = 'อาคารคณะแพทย์ ';
    }
  }

  goToPlanpage() {
    const data = `/plan/${this.location.id}/${this.location.name}`;
    this.router.navigateByUrl(data);
  }


}
