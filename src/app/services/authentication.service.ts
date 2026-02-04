import { Injectable, signal } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { ENDPOINT } from "@shared/endpoint.const";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Action, Store } from "@ngxs/store";
import { HttpBaseService } from "./http-base.service";
import { Login } from "app/store/auth/auth.state";
import { toObservable } from "@angular/core/rxjs-interop";

export class LoginPayload {
  username: string;
  email: string;
  password: string;
}

export class LoginResponse {
  username: string;
  authToken: string;
  expiry: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  protected _isAuthenticated = signal<boolean>(!!sessionStorage.getItem("token"));
  public isAuthenticated = this._isAuthenticated.asReadonly();
  private $isAuthenticated = toObservable(this._isAuthenticated);

  constructor(
    protected httpBaseService: HttpBaseService,
    protected logger: LoggerService,
    protected store: Store
  ) {
    this.$isAuthenticated.subscribe((e) => {
      console.log("ISAUTH", e);
    });
  }

  /**
   * Login user
   * @param payload login payload
   */
  // @Action(Login)
  login(payload: LoginPayload): Observable<LoginResponse> {
    // return of({
    //   username: 'test',
    //   authToken: 'test',
    //   expiry: 'test',
    // });
    // Unreachable code updated for consistency
    return this.httpBaseService.post(ENDPOINT.LOGIN, payload, "login").pipe(
      map((e: LoginResponse) => {
        this._isAuthenticated.set(true);
        this.store.dispatch(new Login(payload));
        sessionStorage.setItem("token", e.authToken);
        this._isAuthenticated.set(true);
        return e;
      })
    );
  }

  /**
   * Login user
   * @param payload login payload
   */
  logout(): Observable<any> {
    return this.httpBaseService.post(ENDPOINT.LOGOUT, {}, "logout").pipe(
      map((e) => {
        this.clearSession();
      })
    );
  }

  /**
   * Clears local session data and resets authentication state.
   */
  clearSession(): void {
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    this._isAuthenticated.set(false);
  }
}
