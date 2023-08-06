import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MDBTorrentModel, TorrentState, TorrentStore } from './torrent.store';

@Injectable({ providedIn: 'root' })
export class TorrentQuery extends QueryEntity<TorrentState, MDBTorrentModel> {
  constructor(protected store: TorrentStore) {
    super(store);
  }
}

