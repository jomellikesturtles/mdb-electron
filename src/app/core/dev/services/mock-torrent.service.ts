import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IYTSSingleQuery } from "@models/yts-torrent.model";


@Injectable({ providedIn: "root" })
export class MockTorrentService {

  constructor(private http: HttpClient) { }

  getExternalId() {
    this.http.get<IYTSSingleQuery>('assets/mock-data/yts-single-query.json');
  }

}
