import {Component, OnInit} from '@angular/core';
import {LoginService} from './login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  admin = false;
  logged = false;
  constructor(private ls: LoginService) {}

  ngOnInit() {
    this.ls.isAdmin().then((r) => this.admin = r);
    this.ls.isLogged().then((r) => this.logged = r);
    this.ls.logged$.subscribe(l => this.logged = l);
  }

  isAdmin() {
    return this.admin;
  }

  isLogged() {
    return this.logged;
  }

}
