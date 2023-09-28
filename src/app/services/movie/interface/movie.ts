import { ID } from "@datorama/akita";
import { MDBMovie } from "@models/mdb-movie.model";
import { IMdbMoviePaginated } from "@models/media-paginated.model";


export interface TmdbMovieModel {
  id: ID,
  movie: any;
}

export interface MDBMovieModel {
  id: ID,
  movie: MDBMovie;
}


export interface TmdbMovieListModel {
  id: ID,
  movies: any[];
}


export interface MDBMovieListModel {
  id: ID,
  movies: MDBMovie[];
}

export interface MDBPaginatedResultModel {
  id: ID,
  paginatedResult: IMdbMoviePaginated;
}

export interface MDBMoviePreviewModel {
  id: ID,
  moviePreview: any;
}

export interface MDBMovieDashboardModel {
  id: ID,
  movieDashboard: {
    name: string;
    data: any;
    queryParams?: Map<any, any>;
  };
}
