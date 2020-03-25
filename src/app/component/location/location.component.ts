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
  public imagePath: string;
  public defaulfImage: string;
  constructor(private router: Router) { }

  ngOnInit() {
    this.defaulfImage = '../../../assets/icon/compass-with-white-needles.svg';
    if (this.location.id.includes('baramee')) {
      this.location.building = 'อาคารบารมี';
    } else if (this.location.id.includes('main')) {
      this.location.building = 'อาคารคณะแพทย์';
    } else if (this.location.id.includes('srivajchavat')) {
      this.location.building = 'อาคารศรีเวชวัต';
    } else if (this.location.id.includes('ratana')) {
      this.location.building = 'อาคารรัตนชีวรัต';
    }

    if (this.location.name.includes('สะพาน')) {
      this.imagePath = '../../../assets/icon/สะพาน.svg';
      // console.log(`${this.location.id} | ${this.location.name}`);
    } else if (this.location.name.includes('บันได')) {
      this.imagePath = '../../../assets/icon/บันได.svg';
      // console.log(`${this.location.id} | ${this.location.name}`);
    } else if (this.location.name.includes('ลิฟ')) {
      this.imagePath = '../../../assets/icon/elevator.svg';
      // console.log(`${this.location.id} | ${this.location.name}`);
    } else if (this.location.name.includes('ห้องน้ำ')) {
      this.imagePath = '../../../assets/icon/ห้องน้ำ.svg';
      // console.log(`${this.location.id} | ${this.location.name}`);
    } else if (this.location.name.includes('การเงิน')) {
      this.imagePath = '../../../assets/icon/การเงิน.svg';
      // console.log(`${this.location.id} | ${this.location.name}`);
    } else if (this.location.name.includes('ธนาคาร')) {
      this.imagePath = '../../../assets/icon/atm.svg';
      // console.log(`${this.location.id} | ${this.location.name}`);
    } else if (this.location.name.includes('ประชาสัมพันธ์')) {
      this.imagePath = '../../../assets/icon/PR.svg';
      // console.log(`${this.location.id} | ${this.location.name}`);
    } else if (this.location.name.includes('คลินิก')) {
      this.imagePath = '../../../assets/icon/cross.svg';
      // console.log(`${this.location.id} | ${this.location.name}`);
    }
  }

  goToPlanpage() {
    const data = `/plan/${this.location.id}/${this.location.name}`;
    console.log(data);
    this.router.navigateByUrl(data);
  }
}
