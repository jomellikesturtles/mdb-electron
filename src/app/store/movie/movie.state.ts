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
      const entry = state?.dashboardMovies ? state.dashboardMovies[id] : undefined;
      if (!entry) return undefined;
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (entry.timestamp && (now - entry.timestamp < oneDay)) {
        return entry;
      }
      return undefined;
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
    const now = Date.now();
    const oneDay = 3 * 1000;
    const dashboardMovies: { [id: string]: MDBMovieDashboardModel; } = {};

    if (state.dashboardMovies) {
      for (const key of Object.keys(state.dashboardMovies)) {
        const entry = state.dashboardMovies[key];
        if (entry && entry.timestamp && (now - entry.timestamp < oneDay)) {
          dashboardMovies[key] = entry;
        }
      }
    }

    dashboardMovies[action.payload.id] = {
      ...action.payload,
      timestamp: now
    };

    ctx.patchState({ dashboardMovies });
  }
}
