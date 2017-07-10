import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
const CurrentUser = gql`
  query CurrentUserName {
    thisUser {
    id,
    name
    }
  }
`;

interface Rtrn {
  thisUser: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user;
  date = new Date('2017-01-02');

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.query<Rtrn>({
      query: CurrentUser,
    }).subscribe(({data}) => {
      this.user = data.thisUser;
    });
  }

}
