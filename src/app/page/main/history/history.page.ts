import { HistoryListService } from './../../../services/history-list.service';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  Lists = [];
  constructor(private storage: Storage, private histoList: HistoryListService) {}
  ngOnInit() {
    this.histoList.getHistoList().forEach(element => {
      this.Lists.push(element);
    });
  }
}
