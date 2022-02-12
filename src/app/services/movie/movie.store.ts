import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { MDBMovieListModel, MDBMovieModel, TmdbMovieModel } from "./interface/movie";

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

