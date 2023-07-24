import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { map } from "rxjs";

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({ providedIn: 'root' })
export class MovieService {

  constructor(
    private http: HttpClient) { }


  YOUTUBE_API_KEY = environment.youtube.apiKey;

  /**
   * Gets movie clips from YouTube.
   * @param query query to search
   */
  getRandomVideoClip(query: string) {
    const index = Math.round(Math.random() * (25));
    console.log(index);
    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
    let myHttpParam = new HttpParams().append('part', 'snippet');
    myHttpParam = myHttpParam.append('key', this.YOUTUBE_API_KEY);
    myHttpParam = myHttpParam.append('q', query);
    myHttpParam = myHttpParam.append('maxResults', '50');
    myHttpParam = myHttpParam.append('order', 'relevance');
    myHttpParam = myHttpParam.append('type', 'video');
    const httpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    // https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAC1kcZu_DoO7mbrMxMuCpO57iaDByGKV0&q=Toy%20Story%204%202019&maxResults=50&order=relevance&type=video
    return this.http.get<any>(baseUrl, httpOptions).pipe(map((e) => e.items));
  }
}
