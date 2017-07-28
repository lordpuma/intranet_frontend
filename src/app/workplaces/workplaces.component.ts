import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

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
  selector: 'app-workplaces',
  templateUrl: './workplaces.component.html',
  styleUrls: ['./workplaces.component.scss']
})
export class WorkplacesComponent implements OnInit {
  workplaces: [Workplace];
  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.query<QueryResponse>({
      query: CurrentWorkplaces,
    }).subscribe(({data}) => {
      if (data) {
        this.workplaces = data.workplaces;
      }
    });
  }


}
