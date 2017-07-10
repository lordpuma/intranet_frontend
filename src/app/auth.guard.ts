import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {LoginService} from './login.service';
import {LoginComponent} from './login/login.component';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private login: LoginService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.login.isLogged();
  }

  // canDeactivate(
  //   component: LoginComponent,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
  //   return this.login.l;
  // }
}
