import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryListService {
  histolist = [];
  constructor() {}
  addHistolist(end: string) {
    this.histolist.push(end);
    console.log(this.histolist);
  }
  getHistoList() {
    return this.histolist;
  }
}
