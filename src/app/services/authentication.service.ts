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
import GeneralUtil from "@utils/general.util";

export class RegisterPayload {
  userName: string;
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

export interface OtpPayload {
  username: string;
  otp?: string;
  signature?: string;
  channel?: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  protected _isAuthenticated = signal<boolean>(!!sessionStorage.getItem("token"));
  public isAuthenticated = this._isAuthenticated.asReadonly();
  private $isAuthenticated = toObservable(this._isAuthenticated);

  private readonly SESSION_TIMEOUT_MS = 15 * 60 * 1000;

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
        this.updateExpiry();
        return e;
      })
    );
  }

  /**
   * Updates the session expiry timestamp in localStorage.
   * Supports sliding expiration by being called on user activity.
   */
  updateExpiry(): void {
    const expiryTime = Date.now() + this.SESSION_TIMEOUT_MS;
    localStorage.setItem("token_expiry", expiryTime.toString());
  }

  /**
   * Checks if the current session has expired based on the stored timestamp.
   */
  isTokenExpired(): boolean {
    const expiry = localStorage.getItem("token_expiry");
    return !expiry || Date.now() > Number(expiry);
  }

  /**
   * Requests a new token from the backend and resets the expiry timer.
   */
  refreshToken(): Observable<LoginResponse> {
    return this.httpBaseService.post(ENDPOINT.REFRESH, {}, "refresh").pipe(
      map((e: LoginResponse) => {
        sessionStorage.setItem("token", e.authToken);
        this.updateExpiry();
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
   * Sends an OTP to the user's registered channel.
   * @param payload OTP request payload
   */
  sendOtp(payload: OtpPayload): Observable<OtpPayload> {
    return this.httpBaseService.post<OtpPayload>(ENDPOINT.OTP_SEND, payload, "sendOtp");
  }

  /**
   * Verifies the OTP provided by the user.
   * @param payload OTP verification payload
   */
  verifyOtp(payload: OtpPayload): Observable<OtpPayload> {
    return this.httpBaseService.post<OtpPayload>(ENDPOINT.OTP_VERIFY, payload, "verifyOtp");
  }


  /**
   * Login user by first encrypting the credentials and then authenticating.
   * @param payload login payload
   */
  register(payload: RegisterPayload): Observable<RegisterResponse> {

    return from(this.encryptMessage(payload.password)).pipe(

      switchMap((encryptedPayload: string) => {
        payload.password = encryptedPayload;
        return this.httpBaseService.post(ENDPOINT.REGISTER, payload, "register");
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
    localStorage.removeItem("token_expiry");
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

  /**
   * Error handler.
   * @param operation the operation
   * @param result the result
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      GeneralUtil.DEBUG.error(error); // log to console instead
      this.logger.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };

  }
}
