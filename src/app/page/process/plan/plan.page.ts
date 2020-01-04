import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit {
  findLocationDetail = '';
  showDetail = false;
  statusFindMyLocation = true;
  constructor(private location: Location) { }

  ngOnInit() {
  }

  onQrCode() {
    this.showDetail = true;
    this.findLocationDetail = 'เป็นการระบุตำแหน่งโดยการสแกน Qr Code บริเวณที่คุณอยู่';
  }

  onStart() {
    this.statusFindMyLocation = false;
  }

  onBeacon() {
    this.showDetail = true;
    this.findLocationDetail = 'เป็นการระบุตำแหน่งโดยการสแกน Bluetooth Low Energy บริเวณที่คุณอยู่กรุณาเปิดbluetooth ขณะใช้งาน';
  }

  backBeforePage() {
    this.location.back();
  }

}
