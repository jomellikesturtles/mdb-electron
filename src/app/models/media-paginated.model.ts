import { MDBMovie } from "./mdb-movie.model";

export interface IMdbMoviePaginated {
  page?: number,
  totalPages: number,
  totalResults: number,
  results: MDBMovie[],
}
