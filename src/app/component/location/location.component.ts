import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../../model/location';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  @Input() location: Location;
  @Input() index: number;
  constructor() { }

  ngOnInit() {
  }


}
