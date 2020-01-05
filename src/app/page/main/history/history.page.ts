import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  name: string;
  constructor(private storage: Storage) { }

  ngOnInit() {
    this.storage.get('id').then((val) => {
      console.log('Your age is', val);
    });
  }

}
