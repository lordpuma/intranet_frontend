import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import gql from 'graphql-tag';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import {Subject} from 'rxjs/Subject';
import {LoginService} from '../login.service';

const CurrentUsers = gql`
  query shifts($date: String!, $workplace: Int!) {
    freeUsers(Workplace: $workplace, Date: $date) {
      name, id
    }
  }
`;


const insertShift = gql`
  mutation insertShift($user: Int!, $date: String!, $workplace: Int!, $note: String) {
    insertShift(Userid: $user, Date: $date, Workplaceid: $workplace, Note: $note) {
      id,
      user {id, shortName, color, bgColor}
    }
  }
`;

const editShift = gql`
  mutation editShift($user: Int!, $id: Int!) {
    editShift(Id: $id, Userid: $user) {
      id,
      user {id, shortName, color, bgColor}
    }
  }
`;

const deleteShift = gql`
  mutation deleteShift($id: Int!) {
    deleteShift(Id: $id) 
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
  @Input() shifts: Shift[];
  @Output() r = new EventEmitter<boolean>();

  uquery: ApolloQueryObservable<Shifts>;
  users: User[];
  query: ApolloQueryObservable<Shifts>;
  $date: Subject<string> = new Subject<string>();
  user: User;

  constructor(private apollo: Apollo, private login: LoginService) {}

  ngOnInit() {
    this.uquery = this.apollo.watchQuery<Shifts>({
      query: CurrentUsers,
      variables: {date: this.getDate(), workplace: this.workplace},
    });
    this.uquery.subscribe(({data}) => {
      this.users = data.freeUsers;
    });
    this.apollo.query<Rtrn>({
      query: CurrentUser,
    }).subscribe(({data}) => {
      this.user = data.thisUser;
    });
    this.$date.next(this.getDate());
  }


  getDate() {
    return this.date + '-' + this.day;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.$date.next(this.getDate());
  }

  refetch() {
    this.r.emit(true);
    this.fetchUsers();
  }

  fetchUsers() {
  this.uquery.refetch();
  }
}
