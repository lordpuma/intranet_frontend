import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {LoginService} from '../login.service';
import {Subscription} from 'rxjs/Subscription';
const CurrentUser = gql`
  query CurrentUserName {
    thisUser {
      id,
      shortName
    }
  }
`;

interface Rtrn {
  thisUser: any;
}


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  logged = false;
  user = false;
  subscription: Subscription;

  constructor(
    private router: Router,
    private apollo: Apollo,
    private login: LoginService
  ) {
    login.isLogged().then(val => {
      this.logged = val;
          if (this.logged) {
            this.apollo.query<Rtrn>({
              query: CurrentUser,
            }).subscribe(({data}) => {
              this.user = data.thisUser;
            });
          }
        });
    this.subscription = login.logged$.subscribe(
      l => {
        this.logged = l;
        if (l) {
          this.fetchUser();
        }
      });
  }

  fetchUser(): void {
    this.apollo.query<Rtrn>({
      query: CurrentUser,
    }).subscribe(({data}) => {
      this.user = data.thisUser;
    });
  }

  ngOnInit() {
    if (this.login.l) {
      this.logged = true;
      this.fetchUser();
    }
  }

  logout() {
    this.login.logout().then((r) => {
      this.logged = false;
      this.user = false;
      this.router.navigate(['/login']);
    });
  }

}
