import { MDBMovie } from '@models/mdb-movie.model';
import { IRawTmdbResultObject, IRawTmdbResult } from '@models/interfaces';
import { IMdbMoviePaginated } from '@models/media-paginated.model';

export class TmdbMapper {

  /**
   * Maps a single raw TMDB movie object to MDBMovie model.
   */
  static mapToMdbMovie(raw: any): MDBMovie {
    if (!raw) return null;
    return new MDBMovie(raw);
  }

  /**
   * Maps a raw TMDB paginated result object to IMdbMoviePaginated model.
   */
  static mapToPaginatedResults(raw: IRawTmdbResultObject): IMdbMoviePaginated {
    if (!raw) return null;

    const results: MDBMovie[] = (raw.results || []).map(item => this.mapToMdbMovie(item));

    return {
      totalPages: raw.total_pages,
      totalResults: raw.total_results,
      page: raw.page,
      results: results
    };
  }

  /**
   * Maps a list of raw TMDB objects.
   */
  static mapList(list: any[]): MDBMovie[] {
    if (!list) return [];
    return list.map(item => this.mapToMdbMovie(item));
  }
}
