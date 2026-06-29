import { Injectable } from '@angular/core';
import { State, Action, StateContext, createSelector } from '@ngxs/store';
import { AddStreams } from './streams.actions';

export interface StreamsStateModel {
  streams: { [id: string]: any };
}

@State<StreamsStateModel>({
  name: 'streams',
  defaults: {
    streams: {}
  }
})
@Injectable()
export class StreamsState {

  static getStreams(id: string) {
    return createSelector([StreamsState], (state: StreamsStateModel) => {
      return state?.streams ? state.streams[id] : undefined;
    });
  }

  @Action(AddStreams)
  addStreams(ctx: StateContext<StreamsStateModel>, action: AddStreams) {
    const state = ctx.getState();
    ctx.patchState({
      streams: {
        ...state.streams,
        [action.payload.id]: action.payload.streams
      }
    });
  }
}
