import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  showButton = false;
  statusPage = true;
  constructor(private router: Router, private storage: Storage) {
    this.checkState(this.statusPage);
  }

  ngOnInit() {
    this.storage.get('intro').then((data) => {
      if (data === false) {
        this.checkState(data);
      }
    });
  }

  endSlide() {
    this.showButton = true;
  }

  goToMainPage() {
    this.statusPage = false;
    this.storage.set('intro', false);
    this.storage.get('intro').then((val) => {
      console.log('Intro is', val);
    });
    this.checkState(this.statusPage);
  }

  checkState(status: boolean) {
    if (status === false) {
      this.router.navigate(['/app/tabs/feeds']);
    }
  }

}
