import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MDBMovie } from '@models/mdb-movie.model';
import { MDBMovieListModel, MDBMovieModel, TmdbMovieModel } from './interface/movie';
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

// @Injectable({ providedIn: 'root' })
// export class DiscoverMovieQuery extends QueryEntity<MDBMovieState, TmdbMovieModel> {
//   constructor(protected store: MDBMovieStore) {
//     super(store);
//   }
// }

@Injectable({ providedIn: 'root' })
export class SearchMovieQuery extends QueryEntity<MDBMovieSearchState, MDBMovieListModel> {
  constructor(protected store: MDBMovieSearchStore) {
    super(store);
  }
}

