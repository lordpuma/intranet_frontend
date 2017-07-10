import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import gql from 'graphql-tag';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import {Subject} from 'rxjs/Subject';

const Shift = gql`
  query shifts($date: String!, $workplace: Int!) {
    shifts(Date: $date, Workplace: $workplace) {
      id,
      user {id, name, color, bgColor}
    },
    freeUsers(Workplace: $workplace, Date: $date) {
      name, id
    }
  }
`;


const insertShift = gql`
  mutation insertShift($user: Int!, $date: String!, $workplace: Int!, $note: String) {
    insertShift(Userid: $user, Date: $date, Workplaceid: $workplace, Note: $note) {
      id,
      user {id, name, color, bgColor}
    }
  }
`;

const editShift = gql`
  mutation editShift($user: Int!, $id: Int!) {
    editShift(Id: $id, Userid: $user) {
      id,
      user {id, name, color, bgColor}
    }
  }
`;

const deleteShift = gql`
  mutation deleteShift($id: Int!) {
    deleteShift(Id: $id) {
      id,
      user {id, name, color, bgColor}
    }
  }
`;

const CurrentUser = gql`
  query CurrentUserName {
    thisUser {
    id,
    perms
    }
  }
`;

interface Rtrn {
  thisUser: User;
}


interface Shifts {
  shifts: [Shift];
  freeUsers: [User];
}
interface UserR {
  user: User;
}
interface InsShifts {
  insertShift: Shift;
}
interface EdtShifts {
  editShift: Shift;
}
interface DltShifts {
  deleteShift: number;
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
  selector: 'app-shift-button',
  templateUrl: './shift-button.component.html',
  styleUrls: ['./shift-button.component.scss'],
})
export class ShiftButtonComponent implements OnInit, OnChanges {
  @Input() date: string;
  @Input() day: number;
  @Input() workplace: number;
  shifts: Shift[];
  users: User[];
  query: ApolloQueryObservable<Shifts>;
  $date: Subject<string> = new Subject<string>();
  user: User;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.query<Rtrn>({
      query: CurrentUser,
    }).subscribe(({data}) => {
      this.user = data.thisUser;
    });
    this.query = this.apollo.watchQuery<Shifts>({
      query: Shift,
      variables: {date: this.$date, workplace: this.workplace},
    });
    this.query.subscribe(({data}) => {
      this.shifts = data.shifts;
      this.users = data.freeUsers;
    });
    this.$date.next(this.getDate());
  }

  isAdmin() {
    if (!this.user) {
      return false;
    }
    return this.user.perms.includes('admin');
  }

  getDate() {
    return this.date + '-' + this.day;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.$date.next(this.getDate());
    if (this.query) {this.query.refetch().then(() => console.log('heh')); }
  }

  refetch() {
    this.query.refetch();
  }
}
