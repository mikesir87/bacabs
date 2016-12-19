import { Action } from '@ngrx/store';

export interface ConnectionState {
  connected : boolean;
}

const initialState: ConnectionState = {
  connected: false
};

const SET_STATUS = 'connection:setStatus';

export const Actions = {
  SET_STATUS
};

export function reducer(state = initialState, action: Action): ConnectionState {
  switch(action.type) {
    case SET_STATUS:
      return Object.assign({}, { connected: action.payload });
    default:
      return state;
  }
}
