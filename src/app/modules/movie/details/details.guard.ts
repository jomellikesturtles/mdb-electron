import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MovieService } from '@services/movie/movie.service';
import { Observable } from 'rxjs';

@Injectable()
export class MovieDetailsGuard  {
  constructor(private movieService: MovieService) { }
  canActivate(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.movieService.getMovieDetails(Number.parseInt(activatedRouteSnapshot.paramMap.get('id')), 'videos,images,credits,similar,external_ids,recommendations').subscribe(data => {

    });
    return true;
    // else display details not found
  }

}
