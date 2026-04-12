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
    return Promise.resolve('https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4');
  }

  async getMovieFromLibrary(id: string | number): Promise<any> {
    const movies = await firstValueFrom(this.http.get<any[]>('assets/mock-responses/library-movies.json'));
    return movies.filter(m => m.tmdbId == id);
  }

  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getLibraryPaginatedFirstPage(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getLibraryPaginated(lastVal: string | number): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
