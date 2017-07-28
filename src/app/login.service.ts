import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Http, Headers} from '@angular/http';
import { environment } from '../environments/environment';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {isUndefined} from 'util';

const CurrentUser = gql`
  query CurrentUserId {
    thisUser {
    id,
    perms
    }
  }
`;

interface Rtrn {
  thisUser: any;
}



@Injectable()
export class LoginService {
  l: boolean;
  private logged = new Subject<boolean>();
  logged$ = this.logged.asObservable();
  user: any;

  constructor (
    private apollo: Apollo,
    private http: Http,
  ) {}

  change(logged: boolean) {
    this.l = logged;
    this.logged.next(logged);
  }


  isLogged(): Promise<boolean> {
    return new Promise((res, rej) => {
      if (localStorage.getItem('token') != null) {
        if (this.l) {
          res(this.l);
        }
          this.apollo.query<Rtrn>({
            query: CurrentUser,
          }).subscribe(({data}) => {
            if (data.thisUser) {
              this.user = data.thisUser;
              this.change(true);
              res(true);
            } else  {
              this.change(false);
              res(false);
            }
          });
        } else {
        res(false);
      }
    });
  }

  login (username: string, password: string): Promise<{first_login: boolean}> {
    return new Promise((res, rej) => {
      this.apollo.getClient().resetStore();
      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', environment.url);
      this.http.put(environment.url + 'login',
        JSON.stringify({user: username, pass: password})).subscribe((r) => {
        if (r.json().token != null) {
          localStorage.setItem('token', r.json().token);
          this.change(true);
          res({first_login: r.json().first});
        } else {
          rej({errors: [r.json().error]});
        }
      });
    });
  }

  logout (): Promise<boolean> {
    return new Promise((res, rej) => {
      this.apollo.getClient().resetStore();
      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', environment.url);
      headers.append('token', localStorage.getItem('token'));
      this.http.get(environment.url + 'logout',
        {headers: headers}).subscribe((r) => {
        localStorage.removeItem('token');
        this.change(false);
        res(true);
      });
    });
  }

  isAdmin(): Promise<boolean> {
    return new Promise((res, rej) => {
      this.isLogged().then((r) => {
        if (this.user && !isUndefined(this.user.perms)) {
          res(this.user.perms.includes('admin'));
        } else {
          res(false);
        }
      });
    });
  }


}
