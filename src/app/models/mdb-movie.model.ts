import { Department, IRating } from "../interfaces"

export class MDBMovie {
  constructor(value: any) { }
  mdbId: string
  imdbId: string
  tmdbId: number
  title: string
  originalTitle
  overview: string
  library: any
  watched: any
  bookmark: any
  credits
  rating: IRating
  vote: IVote
}

export interface ICredits {
  id: number;
  cast: ICast[];
  crew: ICrew[];
}

interface ICast {
  castId: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profile_path: null | string;
}

interface ICrew {
  credit_id: string;
  department: Department;
  gender: number;
  id: number;
  job: string;
  name: string;
  profile_path: null | string;
}


interface IVote {
  voteCount: number
  voteAverage: number
}
