import { Injectable } from '@angular/core';
import { DisplayedTorrent } from '@models/torrent.model';

@Injectable({
  providedIn: 'root'
})
export class DisplayedTorrents {
  private myDisplayedTorrents: DisplayedTorrent[] = [];
  
  getDisplayedTorrents() {
    return this.myDisplayedTorrents;
  }

  setDisplayedTorrents(torrents: DisplayedTorrent[]) {
    this.myDisplayedTorrents = torrents;
  }
}
