import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MDBMovieListModel, MDBMovieModel, MDBPaginatedResultModel, TmdbMovieModel } from './interface/movie';
import { MDBMovieState, MDBMovieStore, TMDBMovieStore, TmdbMovieState as TMDBMovieState, MDBMovieSearchState, MDBMovieSearchStore } from './movie.store';

@Injectable({ providedIn: 'root' })
export class TMDBMovieQuery extends QueryEntity<TMDBMovieState, TmdbMovieModel> {
  constructor(protected store: TMDBMovieStore) {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class MDBMovieQuery extends QueryEntity<MDBMovieState, MDBMovieModel> {
  constructor(protected store: MDBMovieStore) {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class MDBMovieDiscoverQuery extends QueryEntity<MDBMovieState, MDBPaginatedResultModel> {
  constructor(protected store: MDBMovieStore) {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class SearchMovieQuery extends QueryEntity<MDBMovieSearchState, MDBMovieListModel> {
  constructor(protected store: MDBMovieSearchStore) {
    super(store);
  }
}

