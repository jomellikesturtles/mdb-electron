export class SetUser {
  static readonly type = '[user] set user'
  constructor(public payload: any) { }
}

export class RemoveUser {
  static readonly type = '[user] remove user'
  constructor(public payload: any) { }
}
