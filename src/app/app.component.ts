import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ravel';
  login = '';

  addItem(newItem: string) {
    this.login = newItem;
  }
}

