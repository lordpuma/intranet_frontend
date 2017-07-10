import {Component, OnInit} from '@angular/core';
import {LoginService} from './login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  admin = false;
  constructor(private ls: LoginService) {}

  ngOnInit() {
    this.ls.isAdmin().then((r) => this.admin = r);
  }

  isAdmin() {
    return this.admin;
  }

}
