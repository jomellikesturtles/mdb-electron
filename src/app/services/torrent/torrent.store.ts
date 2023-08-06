import { Injectable } from "@angular/core";
import { EntityState, EntityStore, ID, StoreConfig } from "@datorama/akita";
import { MDBTorrentAndMovieObject } from "@models/interfaces";
// import { MDBTorrentModel } from "./interface/movie";

export interface MDBTorrentModel {
  id: ID,
  mdbTorrentAndMovieObject: MDBTorrentAndMovieObject;
}

export interface TorrentState extends EntityState<MDBTorrentModel> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'torrentStoreModel' })
export class TorrentStore extends EntityStore<TorrentState, MDBTorrentModel>{
  constructor() {
    super();
  }
}

