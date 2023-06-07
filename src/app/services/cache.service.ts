import { Observable, of, Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
/**
 * Data sharing service.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ICacheContent {
  expiry: number;
  value: any;
}
@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache: Map<string, ICacheContent> = new Map<string, ICacheContent>();
  private inFlightObservables: Map<string, Subject<any>> = new Map<string, Subject<any>>();

  // readonly DEFAULT_MAX_AGE: number = 900000;
  readonly DEFAULT_MAX_AGE: number = 43200000; // 12 hours
  constructor() { }

  get(key: string, fallback?: Observable<any>, maxAge?: number): Observable<any> | Subject<any> {

    if (this.hasValidCachedValue(key)) {
      // console.log(`Getting from cache: Key - ${key}`);
      const cacheValue = this.cache.get(key).value;
      return of(cacheValue);
    }

    if (!maxAge) {
      maxAge = this.DEFAULT_MAX_AGE;
    }

    if (this.inFlightObservables.has(key)) {
      const inFlight = this.inFlightObservables.get(key);
      const observersCount = inFlight.observers.length;
      if (this.isEmpty(observersCount)) {
        return fallback.pipe(tap((value) => { this.set(key, value, maxAge); }));
      }
      return inFlight;
    } else if (fallback && fallback instanceof Observable) {
      this.inFlightObservables.set(key, new Subject());
      // console.log(`Calling api for ${key}`);
      return fallback.pipe(tap((value) => this.set(key, value, maxAge)));
    } else {
      return throwError(`Requested key (${key}) is not available in Cache`);
    }

  }
  set(key: string, value: any, maxAge: number = this.DEFAULT_MAX_AGE): void {
    this.cache.set(key, { value, expiry: Date.now() + maxAge });
    this.notifyInFlightObservers(key, value);
  }


  isEmpty(obj) {
    if (obj === null || obj === undefined) {
      return true;
    }

    if (Array.isArray(obj)) {
      return obj.length === 0;
    }

    switch (typeof (obj)) {
      case 'object':
        return Object.keys(obj).length === 0;
      case 'string':
        return obj.length === 0;
      case 'number':
        return obj === 0;
      case 'boolean':
      case 'function':
      case 'symbol':
      default:
        return false;
    }
  }

  private notifyInFlightObservers(key: string, value: any): void {
    if (this.inFlightObservables.has(key)) {
      const inFlight = this.inFlightObservables.get(key);
      const observersCount = inFlight.observers.length;
      if (observersCount) {
        // console.log(`Notifying ${inFlight.observers.length} flight subscribers for ${key}`);
        inFlight.next(value);
      }
      inFlight.complete();
      this.inFlightObservables.delete(key);
    }
  }
  private hasValidCachedValue(key: string): boolean {
    if (this.cache.has(key)) {
      if (this.cache.get(key).expiry < Date.now()) {
        this.cache.delete(key);
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
}
