import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

const CurrentUsers = gql`
  query CurrentUsers {
    users {
    id, name, bgColor, color, username
    }
  }
`;


interface QueryResponse {
  users: [User];
}

interface User {
  username: string;
  color: string;
  bgColor: string;
  name: string;
  id: number;
}


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: [User];
  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery<QueryResponse>({
      query: CurrentUsers,
      pollInterval: 2000,
    }).subscribe(({data}) => {
      if (data) {
        this.users = data.users;
      }
    });
  }

  remove(id: number, e: Event) {
    e.preventDefault();
  }

}
