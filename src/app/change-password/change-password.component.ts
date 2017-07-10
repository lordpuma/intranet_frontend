import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

const passMutation = gql`
  mutation editPassword($pass: String!, $id: Int!) {
    editUser(Id: $id, Password: $pass) {
      id
    }
  }
`;

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

interface Result {
  insertUser: User;
}

interface User {
  id: number;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passForm: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.passForm = this.fb.group({
      pass: '',
      pass2: '',
    });
    this.apollo.query<Rtrn>({
      query: CurrentUser,
    }).subscribe(({data}) => {
      this.user = data.thisUser;
    });
  }

  change(e: Event) {
    e.preventDefault();
    this.apollo.mutate<Result>({
      mutation: passMutation,
      variables: {
        id: this.user.id,
        pass: this.passForm.value.pass,
      },
    }).subscribe(() => {
      this.router.navigate(['/']);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

}
