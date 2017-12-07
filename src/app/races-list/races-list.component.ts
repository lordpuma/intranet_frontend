import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import gql from 'graphql-tag';
import {Subscription} from 'apollo-client';
import {forEach} from '@angular/router/src/utils/collection';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {Router} from '@angular/router';
const CurrentWorkplaces = gql`
  query races {
    races {
      id, name, active
    }
  }
`;

const setActiveRace = gql`
  mutation setActiveRace($race: Int!, $active: Boolean!) {
    setActiveRace(Id: $race, Active: $active) {
      id, active
    }
  }
`;

interface Races {
  races: any;
}

interface RaceM {
  setActiveRace: any;
}

@Component({
  selector: 'app-races-list',
  templateUrl: './races-list.component.html',
  styleUrls: ['./races-list.component.scss']
})
export class RacesListComponent implements OnInit, OnDestroy {
  races;
  query: ApolloQueryObservable<Races>;
  sub: Subscription;
  constructor(private apollo: Apollo,
  private router: Router) { }

  ngOnInit() {
    this.query = this.apollo.watchQuery<Races>({
      query: CurrentWorkplaces,
    });
    this.sub = this.query.subscribe(resp => this.races = resp.data.races);
    this.query.refetch();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  activate(id: number, bool: boolean) {
    this.apollo.mutate<RaceM>({
      mutation: setActiveRace,
      variables: {
        race: id,
        active: bool,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        setActiveRace: {
          __typename: 'Race',
          active: bool,
          id: id,
        },
      },
      updateQueries: {
        races: (prev: Races, { mutationResult }) => {
          if (!mutationResult) { return prev; }
          prev.races.forEach(race => {
            race.active = race.id === id;
          });
          return prev;
        },
      },
    });
  }

}
