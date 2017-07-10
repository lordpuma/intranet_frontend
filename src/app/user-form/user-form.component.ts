import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';

const userQuery = gql`
  query CurrentUser($id: Int!) {
    user(Id: $id) {
      bgColor, color, username, email, perms, firstName, lastName, workplaces {id}
    }
  }
`;
//noinspection TsLint
const userMutation = gql`
  mutation insertUser($bgColor: String!, $color: String!, $username: String!, $firstName: String!, $lastName: String!, $email: String, $perms: [String], $workplaces: [Int]) {
    insertUser(BgColor: $bgColor, Color: $color, Username: $username, FirstName: $firstName, LastName: $lastName, Email: $email, Perms: $perms, Workplaces: $workplaces) {
      id
    }
  }
`;

//noinspection TsLint
const userEdit = gql`
  mutation editUser($id: Int!, $bgColor: String, $color: String, $username: String, $firstName: String, $lastName: String, $email: String, $perms: [String], $workplaces: [Int], $password: String) {
   editUser(Id: $id,BgColor: $bgColor, Color: $color, Username: $username, FirstName: $firstName, LastName: $lastName, Email: $email, Perms: $perms, Workplaces: $workplaces, Password: $password) {
      bgColor, color, username, email, perms, firstName, lastName
    }
  }
`;

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

interface QR {
  user: User;
}
interface MR {
  insertUser: User;
}
interface ER {
  editUser: User;
}

interface User {
  id: number;
  name: string;
  bgColor: string;
  color: string;
  username: string;
  email: string;
  perms: string;
  lastName: string;
  firstName: string;
  workplaces: [string];
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  id: number;
  workplaces: [Workplace];

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.apollo.query<QueryResponse>({
      query: CurrentWorkplaces,
    }).subscribe(({data}) => {
      if (data) {
        this.workplaces = data.workplaces;
      }
    });
    this.form = this.fb.group({
      username: '',
      email: null,
      first_name: '',
      last_name: '',
      color: '#FFFFFF',
      bg_color: '#000000',
      perms: '',
      workplaces: ''
    });
    // console.log(this.route.params.subscribe(
    //   (val) => console.log(val['id'])
    // ));
    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id'];
    }
    if (this.id) {
      this.apollo.query<QR>({
        query: userQuery,
        variables: {
          id: this.id,
        }
      }).subscribe(({data}) => {
        this.form.setValue({
          username: data.user.username,
          email: data.user.email,
          first_name: data.user.firstName,
          last_name: data.user.lastName,
          color: data.user.color,
          bg_color: data.user.bgColor,
          perms: data.user.perms,
          workplaces: _.map(data.user.workplaces, (i) => i.id),
        });
      });
    }
  }


  resetPass() {
    this.apollo.mutate({
      mutation: userEdit,
      variables: {
        id: this.id,
        password: '1'
      }
    }).subscribe(({data}) => this.router.navigate(['/users']));
  }

  submit() {
    if (!this.id) {
      this.apollo.mutate<MR>({
        mutation: userMutation,
        variables: {
          username: this.form.value.username,
          email: this.form.value.email === '' ? null : this.form.value.email,
          firstName: this.form.value.first_name,
          lastName: this.form.value.last_name,
          color: this.form.value.color,
          bgColor: this.form.value.bg_color,
          perms: this.form.value.perms,
          workplaces: this.form.value.workplaces,
        },
      }).subscribe(({data}) => {
        this.router.navigate(['/users']);
      });
    } else {
      this.apollo.mutate<ER>({
        mutation: userEdit,
        variables: {
          id: this.id,
          username: this.form.value.username,
          email: this.form.value.email === '' ? null : this.form.value.email,
          firstName: this.form.value.first_name,
          lastName: this.form.value.last_name,
          color: this.form.value.color,
          bgColor: this.form.value.bg_color,
          perms: this.form.value.perms,
          workplaces: this.form.value.workplaces,
        },
      }).subscribe(({data}) => {
        this.router.navigate(['/users']);
      });
    }
  }

}
