import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';

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

const AllShifts = gql`
  query allShifts($date: String!) {
    allShifts(Date: $date) {
      Day, Workplaces {
        Id, Shifts {
          id,
          user {id, shortName, color, bgColor},
          note
        }
      }
    },
  }
`;
interface Rtrn {
  allShifts: [DayType];
}
interface DayType {
  Day: number;
  Workplaces: [W];
}

interface W {
  Id: number;
  Shifts: [Shift];
}

interface Shift {
  id: number;
  user: User;
}
interface User {
  id: number;
  name: string;
  color: string;
  bgColor: string;
  perms: [string];
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
  query: ApolloQueryObservable<Rtrn>;
  shifts: [DayType];
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
    this.query = this.apollo.watchQuery<Rtrn>({
      query: AllShifts,
      variables: {
        'date': this.t
      }
    });
    this.query.subscribe((res) => {
      this.shifts = res.data.allShifts;
    });
  }

  getShifts(d, w) {
    if (this.shifts) {
      const x = this.shifts.find((r) => r.Day === d);
      if (x) {
        const v = x.Workplaces.find((r) => r.Id === w);
        return v ? v.Shifts : [];
      } else {
        return [];
      }
    }
    return [];
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

  omg() {
    this.query.setVariables({date: this.t});
    this.query.refetch();
  }
}
