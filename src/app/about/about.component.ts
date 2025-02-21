import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent {
  age;

  constructor() {
    const now = new Date();
    const birthday = new Date(1997, 1, 10);
    this.age = now.getFullYear() - birthday.getFullYear();
    const monthDiff = now.getMonth() - birthday.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < birthday.getDate())
    ) {
      this.age--;
    }
  }
}
