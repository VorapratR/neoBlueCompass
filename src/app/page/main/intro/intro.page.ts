import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  showButton = true;
  statusPage = true;
  constructor(private router: Router) {
    this.checkState(this.statusPage);
  }

  ngOnInit() {
  }

  endSlide() {
    this.showButton = true;
  }

  goToMainPage() {
    this.statusPage = false;
    this.checkState(this.statusPage);
  }

  checkState(status: boolean) {
    if (status === false) {
      this.router.navigate(['/app/tabs/feeds']);
    }
  }

}
