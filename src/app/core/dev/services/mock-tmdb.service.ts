import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ITmdbResultObject } from "@models/interfaces";
import { TMDB_External_Id } from "@models/tmdb-external-id.model";
import { IProfile } from "@modules/user/profile/profile.component";


@Injectable({ providedIn: "root" })
export class MockListService {

  constructor(private http: HttpClient) { }

  getExternalId() {
    this.http.get<TMDB_External_Id>('assets/mock-data/tmdb-external-id.json');
  }

  getFindMovie() {
    this.http.get<IProfile>('assets/mock-data/profile.json');
  }

  getTmdbMovieDetails() {
    this.http.get<IProfile>('assets/mock-data/profile.json');
  }

  searchTmdb() {
    this.http.get<ITmdbResultObject>('assets/mock-data/tmdb-movie-list.json');
  }

  getTmdbVideos() {
    // `..../movie/1234/videos?...
    this.http.get<IProfile>('assets/mock-data/tmdb-video-list.json');
  }

}
