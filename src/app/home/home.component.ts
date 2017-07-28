import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

const Shift = gql`
  query allShifts($date: String!) {
    allShifts(Date: $date) {
      Day, Workplaces {
        Id, Shifts {
          id
        }
      }
    },
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

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.query({
      query: Shift,
      variables: {
        'date': '2017-07'
      }
      }).subscribe((res) => {
      console.log(res);
    });
  }

}
