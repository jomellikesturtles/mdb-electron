import { MDBMovie } from "@models/mdb-movie.model";
import { IMdbMoviePaginated } from "@models/media-paginated.model";


export interface TmdbMovieModel {
  id: string | number,
  movie: any;
}

export interface MDBMovieModel {
  id: string | number,
  movie: MDBMovie;
}


export interface TmdbMovieListModel {
  id: string | number,
  movies: any[];
}


export interface MDBMovieListModel {
  id: string | number,
  movies: MDBMovie[];
}

export interface MDBPaginatedResultModel {
  id: string | number,
  paginatedResult: IMdbMoviePaginated;
}

export interface MDBMoviePreviewModel {
  id: string | number,
  moviePreview: any;
}

export interface MDBMovieDashboardModel {
  id: string | number,
  movieDashboard: {
    name: string;
    data: any;
    queryParams?: Map<any, any>;
  };
  timestamp?: number;
}
