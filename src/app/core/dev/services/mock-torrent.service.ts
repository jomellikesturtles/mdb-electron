import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IYTSSingleQueryResponse } from "@models/yts-torrent.model";


@Injectable({ providedIn: "root" })
export class MockTorrentService {

  constructor(private http: HttpClient) { }

  getExternalId() {
    this.http.get<IYTSSingleQueryResponse>('assets/mock-data/yts-single-query.json');
  }

}
