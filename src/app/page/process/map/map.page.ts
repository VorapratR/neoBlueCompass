import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  backBeforePage() {
    this.location.back();
    console.log('back');
  }

}
