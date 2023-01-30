import { IUserSavedData } from '@models/interfaces';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class BaseLibraryService {

  constructor(
  ) {

  }

  /**
   * Opens a video stream to watch.
   * @param id library id to open stream
   * @returns stream link/url
   */
  protected abstract openVideoStream(id): Promise<any>;

  /**
   * Gets movie library.
   * @param id - tmdbId or imdbId
   */
  protected abstract getMovieFromLibrary(id: number | string): Promise<any>;

  /**
   * Gets multiple library using list. Movie(s) eventually becomes available in status.
   * @param idList
   */
  protected abstract getMoviesFromLibraryInList(idList: number[]): Promise<any>;

  /**
   * Gets first page of list. Gets multiple videos. Movie(s) eventually becomes available in status.
   */
  protected abstract getLibraryPaginatedFirstPage(): Promise<any>;

  /**
   * Gets multiple library.
   * @param lastVal the last value to start with.
   */
  protected abstract getLibraryPaginated(lastVal: string | number): Promise<any>;

}

export interface IVideo extends IUserSavedData {
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  id: string,
  videoUrl: string,
  filePath?: string,
  cre8Ts?: number, // create timestamp
  timestamp?: number,
}

export interface IRawLibrary {
  fullFilePath: string,
  title: string,
  year: number,
  tmdbId: number,
  _id: string;
}

interface Library {
  type: 'movie' | 'video' | 'audio' | 'music' | 'podcast' | 'videogame',
  source: 'local' | 'online',
  id: string,
  title: string;
}
