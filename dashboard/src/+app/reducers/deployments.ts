import { Action } from '@ngrx/store';
import { Deployment } from '../deployment';

export interface State {
  deployments: Deployment[];
}

const initialState: State = {
  deployments: []
};

const SET_DEPLOYMENTS = 'deployments.set';

export const Actions = {
  SET_DEPLOYMENTS
};

export function reducer(state = initialState, action: Action): State {
  switch(action.type) {
    case SET_DEPLOYMENTS:
      return Object.assign({}, { deployments: action.payload });
    default:
      return state;
  }
}
