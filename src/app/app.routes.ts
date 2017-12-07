import {Routes} from '@angular/router';
import {WorkplacesComponent} from './workplaces/workplaces.component';
import {AuthGuard} from './auth.guard';
import {WorkplaceFormComponent} from './workplace-form/workplace-form.component';
import {ShiftsGridComponent} from './shifts-grid/shifts-grid.component';
import {LoginComponent} from './login/login.component';
import {UsersComponent} from './users/users.component';
import {UserFormComponent} from './user-form/user-form.component';
import {HomeComponent} from './home/home.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AdminGuard} from './admin.guard';
import {RacesListComponent} from './races-list/races-list.component';
import {RaceFormComponent} from './race-form/race-form.component';
import {ResultsTableComponent} from './results-table/results-table.component';


export const appRoutes: Routes = [
  { path: 'first_login',      component: ChangePasswordComponent, canActivate: [AuthGuard]},
  { path: 'pass',      component: ChangePasswordComponent, canActivate: [AuthGuard]},
  { path: 'workplaces',      component: WorkplacesComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'workplace',      component: WorkplaceFormComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'workplace/:id',      component: WorkplaceFormComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'shifts',      component: ShiftsGridComponent, canActivate: [AuthGuard]},
  { path: 'login',      component: LoginComponent},
  { path: 'users',      component: UsersComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'user',      component: UserFormComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'user/:id',      component: UserFormComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'results',      component: ResultsTableComponent},
  { path: 'races',      component: RacesListComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'racesnew',      component: RaceFormComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: '**', component: HomeComponent, canActivate: [AuthGuard]}
];
