import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import gql from 'graphql-tag';


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
  selector: 'app-sbutton',
  templateUrl: './sbutton.component.html',
  styleUrls: ['./sbutton.component.scss']
})
export class SButtonComponent implements OnInit {
  @Input() s: Shift;
  @Input() date: string;
  @Input() workplace: number;
  @Input() admin: boolean;
  @Input() users: User[];
  @Output() refetch = new EventEmitter<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnInit() {
  }

  style(u: Shift) {
    if (u) {
      return {'background-color': u.user.bgColor, 'color': u.user.color};
    } else {
      return {'background-color': '#FFF', 'color': '#000'};
    }
  }

  name(name: Shift) {
    if (name) {
      return name.user.name;
    } else {
      return 'VOLNO';
    }
  }

  insertUser(id: number, e: Event) {
    e.preventDefault();
    this.apollo.mutate<InsShifts>({
      mutation: insertShift,
      variables: {
        note: '',
        date: this.date,
        workplace: this.workplace,
        user: id,
      },
    }).subscribe(() => {
      this.refetch.emit(true);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  changeUser(u: number, shift: Shift, e: Event) {
    if (!shift) {
      this.insertUser(u, e);
    } else {
      e.preventDefault();
      this.apollo.mutate<EdtShifts>({
        mutation: editShift,
        variables: {
          id: shift.id,
          user: u,
        }
      }).subscribe(() => {
        this.refetch.emit(true);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
    }
  }
  deleteUser(shift: number, e: Event) {
    e.preventDefault();
    this.apollo.mutate<DltShifts>({
      mutation: deleteShift,
      variables: {
        id: shift,
      }
    }).subscribe(() => {
      this.refetch.emit(true);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

}
