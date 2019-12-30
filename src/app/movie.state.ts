import { Action, StateContext, Select, State, Selector } from '@ngxs/store'
import { AddMovie, RemoveMovie, ClearList } from './movie.actions'

export interface MovieList {
  id: number,
  title: string,
  imdbId?: string,
  tmdbId?: number,
  poster_path: number,
  [propName: string]: any,

}
export interface MovieListStateModel {
  change: 'add' | 'remove' | 'clear' | '';
  idChanged: number;
  movies: MovieList[];
}

const defaults: MovieListStateModel = {
  change: '',
  idChanged: 0,
  movies: [],
}

@State<MovieListStateModel>({
  name: 'moviesList',
  defaults
})

export class SelectedMoviesState {
  @Selector()
  static getList(state: MovieListStateModel) {
    return state
  }
  @Action(AddMovie)
  addMovie(context: StateContext<MovieListStateModel>, action: AddMovie) {
    const current = context.getState()
    const movies = [...current.movies, action.payload]
    context.patchState({
      movies,
      change: 'add',
      idChanged: action.payload.id
    })
  }

  @Action(RemoveMovie)
  removeMovie(context: StateContext<MovieListStateModel>, action: RemoveMovie) {
    const current = context.getState()
    const movies = current.movies.filter(e => e !== action.payload)
    context.patchState({
      movies,
      change: 'remove',
      idChanged: action.payload.id
    })
  }

  @Action(ClearList)
  clearList({ setState }: StateContext<MovieListStateModel>) {
    setState({
      movies: [],
      change: 'clear',
      idChanged: 0
    })
  }
}
