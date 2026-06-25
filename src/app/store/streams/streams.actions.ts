export class AddStreams {
  static readonly type = '[Streams] Add Streams';
  constructor(public payload: { id: string; streams: any }) { }
}
