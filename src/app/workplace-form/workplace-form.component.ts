import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Apollo} from 'apollo-angular';
import {ActivatedRoute, Router} from '@angular/router';
import gql from 'graphql-tag';

interface QR {
  workplace: Workplace;
}
interface MR {
  insertWorkplace: Workplace;
}
interface ER {
  editWorkplace: Workplace;
}

interface Workplace {
  name: string;
  bgColor: string;
  color: string;
}


const userQuery = gql`
  query Workplace($id: Int!) {
    workplace(Id: $id) {
      bgColor, color, name
    }
  }
`;
//noinspection TsLint
const workplaceMutation = gql`
  mutation insertWorkplace($bgColor: String!, $color: String!, $name: String!) {
    insertWorkplace(BgColor: $bgColor, Color: $color, Name: $name) {
      id
    }
  }
`;

//noinspection TsLint
const workplaceEdit = gql`
  mutation workplaceUser($id: Int!, $bgColor: String, $color: String, $name: String) {
   editWorkplace(Id: $id,BgColor: $bgColor, Color: $color, Name: $name) {
      bgColor, color, name
    }
  }
`;


@Component({
  selector: 'app-workplace-form',
  templateUrl: './workplace-form.component.html',
  styleUrls: ['./workplace-form.component.scss']
})
export class WorkplaceFormComponent implements OnInit {
  form: FormGroup;
  id: number;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: '',
      color: '#FFFFFF',
      bg_color: '#000000',
    });
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
          name: data.workplace.name,
          color: data.workplace.color,
          bg_color: data.workplace.bgColor,
        });
      });
    }
  }

  submit() {
    if (!this.id) {
      this.apollo.mutate<MR>({
        mutation: workplaceMutation,
        variables: {
          name: this.form.value.name,
          color: this.form.value.color,
          bgColor: this.form.value.bg_color,
        },
      }).subscribe(({data}) => {
        console.log(data);
        this.router.navigate(['/workplaces']);
      });
    } else {
      this.apollo.mutate<ER>({
        mutation: workplaceEdit,
        variables: {
          id: this.id,
          name: this.form.value.name,
          color: this.form.value.color,
          bgColor: this.form.value.bg_color,
        },
      }).subscribe(({data}) => {
        console.log(data);
        this.router.navigate(['/workplaces']);
      });
    }
  }
}
