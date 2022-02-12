import { ID } from "@datorama/akita";
import { MDBMovie } from "@models/mdb-movie.model";


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
