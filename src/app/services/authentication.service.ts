import { Injectable, signal } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { ENDPOINT } from "@shared/endpoint.const";
import { from, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Action, Store } from "@ngxs/store";
import { HttpBaseService } from "./http-base.service";
import { Login } from "app/store/auth/auth.state";
import { toObservable } from "@angular/core/rxjs-interop";
import * as openpgp from "openpgp";
import { environment } from "@environments/environment";

export class RegisterPayload {
  username: string;
  email: string;
  password: string;
}
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
export class RegisterResponse {
  success: boolean;
  message: string;
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
   * Login user by first encrypting the credentials and then authenticating.
   * @param payload login payload
   */
  login(payload: LoginPayload): Observable<LoginResponse> {

    return from(this.encryptMessage(payload.password)).pipe(

      switchMap((encryptedPayload: string) => {
        payload.password = encryptedPayload;
        return this.httpBaseService.post(ENDPOINT.LOGIN, payload, "login");
      }),
      map((e: LoginResponse) => {
        this._isAuthenticated.set(true);
        this.store.dispatch(new Login(payload));
        sessionStorage.setItem("token", e.authToken);
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
   * Login user by first encrypting the credentials and then authenticating.
   * @param payload login payload
   */
  register(payload: RegisterPayload): Observable<RegisterResponse> {

    return from(this.encryptMessage(payload.password)).pipe(

      switchMap((encryptedPayload: string) => {
        payload.password = encryptedPayload;
        return this.httpBaseService.post(ENDPOINT.REGISTER, payload, "login");
      }),
      map((e: RegisterResponse) => {
        // this._isAuthenticated.set(true);
        // this.store.dispatch(new Login(payload));
        // sessionStorage.setItem("token", e.authToken);
        return e;
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

  async encryptMessage(unencrptedMessage: string) {
    // Allow 1024-bit keys as the current environment key is weak
    openpgp.config.minRSABits = 1024;
    const publicKey = await openpgp.readKey({ armoredKey: environment.publicKey });

    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: unencrptedMessage }), // input as Message object
      encryptionKeys: publicKey,
      // signingKeys: privateKey // optional
    });

    return encrypted as string;
  }
}
