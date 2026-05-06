import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AuthenticationService } from "@services/authentication.service";
import { tap } from "rxjs";

export interface AuthStateModel {
  authToken: string;
  username: string;
}

export class Login {
  static readonly type = "[Auth] Login";
  constructor(public payload: LoginPayload) {}
}

export interface LoginPayload {
  username: string;
  password: string;
}

export class Logout {
  static readonly type = "[Auth] Logout";
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    authToken: null,
    username: null
  }
})
@Injectable()
export class AuthState {
  @Selector()
  static token(state: AuthStateModel) {
    return state.authToken;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.authToken;
  }

  // constructor(private authService: AuthenticationService) {}

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    // return this.authService.login(action).pipe(
    //   tap()
    // );
    // Logic for login can be added here (e.g., calling a service)
    // For now, we just patch the state with dummy data or based on action payload
    ctx.patchState({
      authToken: "dummy-token",
      username: action.payload.username
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    // return this.authService.logout().pipe(
    tap(() => {
      ctx.setState({
        authToken: null,
        username: null
      });
    });
    // );

    // ctx.setState({
    //   token: null,
    //   username: null
    // });
  }
}
