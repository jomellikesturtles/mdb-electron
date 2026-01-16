import { MDBMovieDashboardModel, MDBMovieListModel, MDBMovieModel, MDBMoviePreviewModel, MDBPaginatedResultModel } from "@services/movie/interface/movie";

export class AddMovie {
  static readonly type = '[Movie] Add Movie';
  constructor(public payload: MDBMovieModel) { }
}

export class AddSearchMovie {
  static readonly type = '[Movie] Add Search Movie';
  constructor(public payload: MDBMovieListModel) { }
}

export class AddDiscoverMovie {
  static readonly type = '[Movie] Add Discover Movie';
  constructor(public payload: MDBPaginatedResultModel) { }
}

export class AddPreviewMovie {
  static readonly type = '[Movie] Add Preview Movie';
  constructor(public payload: MDBMoviePreviewModel) { }
}

export class AddDashboardMovie {
  static readonly type = '[Movie] Add Dashboard Movie';
  constructor(public payload: MDBMovieDashboardModel) { }
}
