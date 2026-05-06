import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';
import { AddMovie, AddSearchMovie, AddDiscoverMovie, AddPreviewMovie, AddDashboardMovie } from './movie.actions';
import { MDBMovieDashboardModel, MDBMovieListModel, MDBMovieModel, MDBMoviePreviewModel, MDBPaginatedResultModel } from "@services/movie/interface/movie";

export interface MovieStateModel {
  movies: { [id: string]: MDBMovieModel; };
  searchMovies: { [id: string]: MDBMovieListModel; };
  discoverMovies: { [id: string]: MDBPaginatedResultModel; };
  previewMovies: { [id: string]: MDBMoviePreviewModel; };
  dashboardMovies: { [id: string]: MDBMovieDashboardModel; };
}


/**
 * TODO: add persistence; fix quota error
 */
// @Persistence({
//     path: 'auth.accessToken',
//     existingEngine: localStorage,
//     ttl: 1000 * 60 * 15 // 15min
// })
@State<MovieStateModel>({
  name: 'movie',
  defaults: {
    movies: {},
    searchMovies: {},
    discoverMovies: {},
    previewMovies: {},
    dashboardMovies: {}
  }
})
@Injectable()
export class MovieState {

  static getMovie(id: string | number) {
    return createSelector([MovieState], (state: MovieStateModel) => {
      // console.log('Selector getMovie input state:', state);
      // console.log('Selector getMovie id:', id);
      return state?.movies ? state.movies[id] : undefined;
    });
  }

  static getSearchMovie(id: string | number) {
    return createSelector([MovieState], (state: MovieStateModel) => {
      return state?.searchMovies ? state.searchMovies[id] : undefined;
    });
  }

  static getDiscoverMovie(id: string | number) {
    return createSelector([MovieState], (state: MovieStateModel) => {
      return state?.discoverMovies ? state.discoverMovies[id] : undefined;
    });
  }

  static getPreviewMovie(id: string | number) {
    return createSelector([MovieState], (state: MovieStateModel) => {
      return state?.previewMovies ? state.previewMovies[id] : undefined;
    });
  }

  static getDashboardMovie(id: string | number) {
    return createSelector([MovieState], (state: MovieStateModel) => {
      return state?.dashboardMovies ? state.dashboardMovies[id] : undefined;
    });
  }

  @Action(AddMovie)
  addMovie(ctx: StateContext<MovieStateModel>, action: AddMovie) {
    const state = ctx.getState();
    ctx.patchState({
      movies: {
        ...state.movies,
        [action.payload.id]: action.payload
      }
    });
  }

  @Action(AddSearchMovie)
  addSearchMovie(ctx: StateContext<MovieStateModel>, action: AddSearchMovie) {
    const state = ctx.getState();
    ctx.patchState({
      searchMovies: {
        ...state.searchMovies,
        [action.payload.id]: action.payload
      }
    });
  }

  @Action(AddDiscoverMovie)
  addDiscoverMovie(ctx: StateContext<MovieStateModel>, action: AddDiscoverMovie) {
    const state = ctx.getState();
    ctx.patchState({
      discoverMovies: {
        ...state.discoverMovies,
        [action.payload.id]: action.payload
      }
    });
  }

  @Action(AddPreviewMovie)
  addPreviewMovie(ctx: StateContext<MovieStateModel>, action: AddPreviewMovie) {
    const state = ctx.getState();
    ctx.patchState({
      previewMovies: {
        ...state.previewMovies,
        [action.payload.id]: action.payload
      }
    });
  }

  @Action(AddDashboardMovie)
  addDashboardMovie(ctx: StateContext<MovieStateModel>, action: AddDashboardMovie) {
    const state = ctx.getState();
    ctx.patchState({
      dashboardMovies: {
        ...state.dashboardMovies,
        [action.payload.id]: action.payload
      }
    });
  }
}
