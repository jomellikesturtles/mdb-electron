import { Action, StateContext, Select, State, Selector } from '@ngxs/store'
import { AddMovie, RemoveMovie, ClearList, AddWatched, AddBookmark } from './movie.actions'
import { BookmarkService, IBookmark } from './services/bookmark.service'
import { UserDataService } from './services/user-data.service'
// import { IBookmark } from './components/bookmarks/view/bookmarks.component'

export interface MovieList {
  id: number,
  title: string,
  imdbId?: string,
  tmdbId?: number,
  poster_path: number,
  [propName: string]: any,

}
export interface MovieListStateModel {
  change: 'add' | 'remove' | 'clear' | 'watched' | '';
  idChanged?: number | number[];
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

  constructor(private userDataService: UserDataService,
    private bookmarkService: BookmarkService) { }

  @Selector()
  static getList(state: MovieListStateModel) {
    return state
  }
  @Action(AddMovie)
  addMovie(context: StateContext<MovieListStateModel>, action: AddMovie) {
    console.log('ACTION: ', action)
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

  @Action(AddWatched)
  addWatched(context: StateContext<MovieListStateModel>, action: AddWatched) {
    const current = context.getState()
    console.log('BEFORE:', current.movies)
    const numberList = []
    current.movies.forEach(e => {
      e.isWatched = true; e.watchedProgress = '100%'; numberList.push(e.id)
    })

    // this.watched = {
    //   percentage: '100%',
    //   tmdbId: this.movie.id,
    //   cre8Ts: new Date().getTime(),
    //   id: '',
    //   imdbId: '',
    //   timestamp: 0
    // }
    const movies = current.movies

    console.log('AFTER:', current.movies)
    context.patchState({
      movies,
      change: 'watched',
      idChanged: numberList,
    })
  }

  @Action(AddBookmark)
  addBookmark(context: StateContext<MovieListStateModel>) {
    const current = context.getState()
    console.log('BEFORE:', current.movies)
    const bookmarksList = []
    const createTimestamp = new Date().getDate()
    current.movies.forEach(e => {
      const bookmark: IBookmark = {
        id: e.bookmarkDocId,
        tmdbId: e.id ? e.id : 0,
        imdbId: e.imdbId ? e.imdbId : '',
        title: e.title ? e.title : '',
        year: e.year ? e.year : '',
        // createTs: createTimestamp
      }
      bookmarksList.push(bookmark)
      // e.bookmark = bookmark
    })

    this.bookmarkService.saveBookmarkMulti(bookmarksList)

    // current.movies.forEach(e => {
    //   const bookmark: IBookmark = {
    //     tmdbId: e.id ? e.id : 0,
    //     imdbId: e.imdbId ? e.imdbId : '',
    //     createTs: createTimestamp
    //   }
    //   e.bookmark = bookmark
    // })

    // this.watched = {
    //   percentage: '100%',
    //   tmdbId: this.movie.id,
    //   cre8Ts: new Date().getTime(),
    //   id: '',
    //   imdbId: '',
    //   timestamp: 0
    // }

    const movies = current.movies

    // console.log('AFTER:', current.movies)
    // context.patchState({
    //   movies,
    //   change: 'watched',
    //   idChanged: numberList,
    // })
  }
}
