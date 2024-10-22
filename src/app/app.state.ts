// import { Action, State, Selector, StateContext, Store } from '@ngxs/store'
// import { SetUser, RemoveUser } from './app.actions'
// import { FirebaseService } from './services/firebase.service'
// import { UtilsService } from './services/utils.service'

// export class Add {
//   static readonly type = 'Add'
// }

// export enum LoginType {
//   Anonymous = 'anonymous',
//   Email = 'email',
//   Facebook = 'facebook',
//   Github = 'github',
//   Google = 'google',
// }

// export interface UserStateModel {
//   username: string,
//   emailAddress: string,
//   loginType: LoginType,
//   [propName: string]: any
// }

// const defaultUser: UserStateModel = {
//   username: '',
//   emailAddress: '',
//   loginType: LoginType.Anonymous
// }

// export class UserName {
//   static readonly type = 'UserName'
// }

// @State<UserStateModel>({
//   name: 'UserState',
//   defaults: defaultUser
// })

// export class UserState {
//   constructor(
//     private store: Store,
//     private firebaseService: FirebaseService
//   ) { }
//   @Selector()
//   static getUser(state: UserStateModel) {
//     console.log('USERINFO', state);
//     return state
//   }
//   @Action(SetUser)
//   setUser(context: StateContext<UserStateModel>, action: SetUser) {
//     localStorage.setItem('user', JSON.stringify(action.payload))
//     context.patchState(action.payload)
//   }

//   @Action(RemoveUser)
//   removeUser(context: StateContext<UserStateModel>, action: RemoveUser) {
//     localStorage.setItem('user', null)
//     context.patchState(null)
//   }

// }

// /**
//  * SOURCES:
//  * https://stackblitz.com/edit/ngxs-simple?file=app%2Fapp.state.ts
//  * https://angularfirebase.com/lessons/ngxs-quick-start-angular-state-management/#Actions
//  * https://github.com/codediodeio/ngrx-vs-ngxs
//  */
