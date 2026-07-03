import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseLibraryService } from "@services/base-library.service";
import { Observable, firstValueFrom } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockLibraryService extends BaseLibraryService {

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  openVideoStream(id: any) {
    return Promise.resolve('http://localhost:3002/0/The.Super.Mario.Galaxy.Movie.2026.720p.BluRay.x264.AAC-%5BYTS.BZ%5D.mp4');
    return Promise.resolve('src/assets/scripts/videoplayback.mp4');
  }

  async getMovieFromLibrary(id: string | number): Promise<any> {
    const movies = await firstValueFrom(this.http.get<any[]>('assets/mock-responses/library-movies.json'));
    // return movies.filter(m => m.tmdbId == id);
    return movies;
  }

  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    const mockAvailable = idList
      .filter(id => id % 2 === 0)
      .map(id => ({ tmdbId: id, fullFilePath: 'mock-path', title: 'Mock', year: 2026, _id: '123' }));
    return Promise.resolve(mockAvailable);
  }
  getLibraryPaginated(lastVal: string | number): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
