import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import gql from 'graphql-tag';
import {Subscription} from 'apollo-client';
import {OrderByImpurePipe, OrderByPipe} from 'ngx-pipes';

const CurrentWorkplaces = gql`
  query races {
    races {
      id, name, active
    }
  }
`;
const FormattedResutls = gql`
  query results($id: Int!) {
    raceResults(Id: $id) {
      name, min, average, times
    }
  }
`;


interface Races {
  races: any;
}
interface RaceResults {
  raceResults: any;
}


@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
  providers: [OrderByPipe]
})
export class ResultsTableComponent implements OnInit, OnDestroy {
  races;
  race = 0;
  style = 'min';
  query: ApolloQueryObservable<RaceResults>;
  sub: Subscription;
  results;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.query<Races>({query: CurrentWorkplaces}).subscribe((resp) => this.races = resp.data.races);
    this.query = this.apollo.watchQuery({
      query: FormattedResutls,
      pollInterval: 2000,
      variables: {
        id: this.race
      },
    });
    this.sub = this.query.subscribe(resp => this.results = resp.data.raceResults);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  change() {
    this.query.setVariables({id: this.race});
    this.query.refetch();
  }

}
