import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Apollo} from 'apollo-angular';
import {Router} from '@angular/router';
import gql from 'graphql-tag';

interface InsertRace {
  insertRace: Race;
}


interface Races {
  races: any;
}

interface Race {
  name: string;
  active: string;
}

const insertRace = gql`
  mutation insertRace($active: Boolean!, $name: String!) {
    insertRace(Active: $active, Name: $name) {
      id
    }
  }
`;

@Component({
  selector: 'app-race-form',
  templateUrl: './race-form.component.html',
  styleUrls: ['./race-form.component.scss']
})
export class RaceFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: '',
      active: false,
    });
  }

  submit() {
    this.apollo.mutate<InsertRace>({
      mutation: insertRace,
      variables: {
        name: this.form.value.name,
        active: this.form.value.active,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        insertRace: {
          __typename: 'Race',
          id: 0,
          active: this.form.value.active,
          name: this.form.value.name,
        },
      },
    }).subscribe(({data}) => {
      this.router.navigate(['/races']);
    });
  }
}
