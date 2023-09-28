import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { MDBMovieDashboardModel, MDBMovieListModel, MDBMovieModel, MDBMoviePreviewModel, MDBPaginatedResultModel, TmdbMovieModel } from "./interface/movie";

export interface TmdbMovieState extends EntityState<TmdbMovieModel> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tmdbMovie' })
export class TMDBMovieStore extends EntityStore<TmdbMovieState, TmdbMovieModel>{
  constructor() {
    super();
  }
}

export interface MDBMovieState extends EntityState<MDBMovieModel> { }
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'mdbMovie' })
export class MDBMovieStore extends EntityStore<MDBMovieState, MDBMovieModel>{
  constructor() {
    super();
  }
}

export interface MDBMovieSearchState extends EntityState<MDBMovieListModel> { }
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'mdbSearchMovie' })
export class MDBMovieSearchStore extends EntityStore<MDBMovieSearchState, MDBMovieListModel>{
  constructor() {
    super();
  }
}

export interface MDBMovieDiscoverState extends EntityState<MDBPaginatedResultModel> { }
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'mdbMovieDiscover' })
export class MDBMovieDiscoverStore extends EntityStore<MDBMovieDiscoverState, MDBPaginatedResultModel>{
  constructor() {
    super();
  }
}


export interface MDBMoviePreviewState extends EntityState<MDBMoviePreviewModel> { }
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'mdbMoviePreview' })
export class MDBMoviePreviewStore extends EntityStore<MDBMoviePreviewState, MDBMoviePreviewModel>{
  constructor() {
    super();
  }
}

export interface MDBMovieDashboardState extends EntityState<MDBMovieDashboardModel> { }
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'mdbMovieDashboard' })
export class MDBMovieDashboardStore extends EntityStore<MDBMovieDashboardState, MDBMovieDashboardModel>{
  constructor() {
    super();
  }
}

