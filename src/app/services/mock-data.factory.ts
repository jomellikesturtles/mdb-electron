import { HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { TMDB_URL } from '../constants';
import { Observable } from 'rxjs';
import { TMDB_SEARCH_RESULTS } from '../mock-data';
import { TMDB_FULL_MOVIE_DETAILS } from '../mock-data-movie-details';

export function mockDataFactory(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | any {
  const url = request.url;
  const method = request.method
  let toReturn = { status: 200, body: null }
  if (url.startsWith(TMDB_URL) && url.includes('/discover/movie')) {
    toReturn.body = TMDB_SEARCH_RESULTS
  } else if (new RegExp(`/movie/+\\d+`, `gi`).exec(url) != null) {
    if (url.includes('videos') === true) { // `..../movie/1234/videos?...`
      toReturn.body = TMDB_MOVIE_VIDEO_LIST
    } else {
      toReturn.body = TMDB_FULL_MOVIE_DETAILS
    }
  }
  else if (url.includes('/search/movie')) {
    toReturn.body = TMDB_SEARCH_RESULTS
  }
  else {
    return next.handle(request)
  }

  return new Observable((res) => {
    res.next(new HttpResponse({
      status: 200,
      body: toReturn
    }))
    res.complete()
  })
}

const TMDB_MOVIE_VIDEO_LIST =
{
  "id": 454626,
  "results": [
    {
      "id": "5dcac05a6e44bf000fef48e7",
      "iso_639_1": "en",
      "iso_3166_1": "US",
      "key": "szby7ZHLnkA",
      "name": "New Official Trailer",
      "site": "YouTube",
      "size": 1080,
      "type": "Trailer"
    },
    {
      "id": "5e318333326c1900121e540d",
      "iso_639_1": "en",
      "iso_3166_1": "US",
      "key": "MDgs6JRSJvg",
      "name": "Sonic The Hedgehog (2020) - \"Classic\" - Paramount Pictures",
      "site": "YouTube",
      "size": 1080,
      "type": "Featurette"
    },
    {
      "id": "5e343aa6ac8e6b0018c25fa5",
      "iso_639_1": "en",
      "iso_3166_1": "US",
      "key": "hshTmTjI1Vs",
      "name": "Sonic The Hedgehog (2020) - Big Game Spot - Paramount Pictures",
      "site": "YouTube",
      "size": 1080,
      "type": "Featurette"
    },
    {
      "id": "5e344b9c43250f0015bf8df7",
      "iso_639_1": "en",
      "iso_3166_1": "US",
      "key": "t-mee176CNk",
      "name": "Sonic The Hedgehog (2020) - \"Super\" - Paramount Pictures",
      "site": "YouTube",
      "size": 1080,
      "type": "Featurette"
    },
    {
      "id": "5e344b714ca67600144f11d1",
      "iso_639_1": "en",
      "iso_3166_1": "US",
      "key": "hoRLCr5NG3Y",
      "name": "Sonic The Hedgehog (2020) - \"Drive\" - Paramount Pictures",
      "site": "YouTube",
      "size": 1080,
      "type": "Featurette"
    },
    {
      "id": "5e4507830c271000138457dd",
      "iso_639_1": "en",
      "iso_3166_1": "US",
      "key": "EwgM3sKaO54",
      "name": "Sonic The Hedgehog - Featurettes - Becoming Robotnik - Texted 1080p",
      "site": "YouTube",
      "size": 1080,
      "type": "Featurette"
    }
  ]
}
