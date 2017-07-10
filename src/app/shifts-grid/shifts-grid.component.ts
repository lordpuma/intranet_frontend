import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

const CurrentWorkplaces = gql`
  query CurrentWorkplaces {
    workplaces {
    id, name, bgColor, color
    }
  }
`;


interface QueryResponse {
  workplaces: [Workplace];
}

interface Workplace {
  username: string;
  color: string;
  bgColor: string;
  name: string;
  id: number;
}


@Component({
  selector: 'app-shifts-grid',
  templateUrl: './shifts-grid.component.html',
  styleUrls: ['./shifts-grid.component.scss']
})
export class ShiftsGridComponent implements OnInit {
  t;
  days;
  workplaces;
  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.t = new Date().toISOString().substr(0, 7);
    this.days = Array.from(new Array(this.daysInMonth(new Date(this.t))), (val, index) => index + 1);
    this.apollo.query<QueryResponse>({
      query: CurrentWorkplaces,
    }).subscribe(({data}) => {
      if (data) {
        this.workplaces = data.workplaces;
      }
    });
  }

  daysInMonth(anyDateInMonth) {
    return new Date(anyDateInMonth.getYear(),
      anyDateInMonth.getMonth() + 1,
      0).getDate();
  }

  getDate(d) {
    return this.t + '-' + d;
  }

  isWeekend(d) {
    return new Date(this.getDate(d)).getDay() === 0 || new Date(this.getDate(d)).getDay() === 6;
  }

  getBgForDay(d) {
    return this.isWeekend(d) ? '#999999' : '#FFFFFF';
  }
}
