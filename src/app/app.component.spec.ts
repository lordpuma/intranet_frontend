import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {LogoutComponent} from './logout/logout.component';
import ApolloClient from 'apollo-client/ApolloClient';
import {ApolloModule} from 'apollo-angular';
import {LoginService} from './login.service';
import {Http, HttpModule} from '@angular/http';
const gqlResponse = '...';

function provideClient() {
  return new ApolloClient({
    networkInterface: {
      query: function() {
        return new Promise(resolve => resolve(gqlResponse));
      }
    }
  });
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LogoutComponent,
      ],
      providers: [
        LoginService
      ],
      imports: [RouterTestingModule.withRoutes([
        { path: 'first_login',      component: AppComponent},
        { path: 'workplaces',      component: AppComponent},
        { path: 'workplace',      component: AppComponent},
        { path: 'workplace/:id',      component: AppComponent},
        { path: 'shifts',      component: AppComponent},
        { path: 'login',      component: AppComponent},
        { path: 'users',      component: AppComponent},
        { path: 'user',      component: AppComponent},
        { path: 'user/:id',      component: AppComponent},
        { path: '**', component: AppComponent}
      ]),
        ApolloModule.withClient(provideClient),
        HttpModule
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app works!'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));

  it('should render navbar', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.navbar-brand').textContent).toContain('Intranet');
  }));
});
