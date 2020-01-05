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
  }

  goToPlanpage() {
    const data = `/plan/${this.index}/${this.location.name}`;
    this.router.navigateByUrl(data);
  }


}
