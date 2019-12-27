import { Action, State } from '@ngxs/store'

export class Add {
  static readonly type = 'Add'
}

@State<number>({
  name: 'count',
  defaults: 0
})
export class CountState {
  @Action(Add)
  add(getState, setState) {
    const state = getState()
    setState(state + 1)
  }
}

export class UserName {
  static readonly type = 'UserName'
}
@State<string>({
  name: 'username',
  defaults: ''
})
export class UserState {
  @Action(UserName)
  add(getState, setState) {
    const state = getState()
    setState(state + 1)
  }
}

export interface AppStateModel {
  type: 'web' | 'desktop'
}



/**
 * SOURCES:
 * https://stackblitz.com/edit/ngxs-simple?file=app%2Fapp.state.ts
 * https://angularfirebase.com/lessons/ngxs-quick-start-angular-state-management/#Actions
 * https://github.com/codediodeio/ngrx-vs-ngxs
 */
