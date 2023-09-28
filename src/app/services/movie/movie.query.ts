import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MDBMovieDashboardModel, MDBMovieListModel, MDBMovieModel, MDBMoviePreviewModel, MDBPaginatedResultModel, TmdbMovieModel } from './interface/movie';
import { MDBMovieState, MDBMovieStore, TMDBMovieStore, TmdbMovieState as TMDBMovieState, MDBMovieSearchState, MDBMovieSearchStore, MDBMovieDiscoverStore, MDBMovieDiscoverState, MDBMoviePreviewStore, MDBMoviePreviewState, MDBMovieDashboardState, MDBMovieDashboardStore } from './movie.store';

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
export class MDBMovieSearchQuery extends QueryEntity<MDBMovieSearchState, MDBMovieListModel> {
  constructor(protected store: MDBMovieSearchStore) {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class MDBMovieDiscoverQuery extends QueryEntity<MDBMovieDiscoverState, MDBPaginatedResultModel> {
  constructor(protected store: MDBMovieDiscoverStore) {
    super(store);
  }
}


@Injectable({ providedIn: 'root' })
export class MDBMoviePreviewQuery extends QueryEntity<MDBMoviePreviewState, MDBMoviePreviewModel> {
  constructor(protected store: MDBMoviePreviewStore) {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class MDBMovieDashboardQuery extends QueryEntity<MDBMovieDashboardState, MDBMovieDashboardModel> {
  constructor(protected store: MDBMovieDashboardStore) {
    super(store);
  }
}