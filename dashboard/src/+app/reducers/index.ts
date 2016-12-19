import {combineReducers} from "@ngrx/store";

import * as fromConnection from './connection';
import * as fromDeployments from './deployments';

export interface State {
  connection : fromConnection.ConnectionState,
  deployments : fromDeployments.State
}

const reducers = {
  connection: fromConnection.reducer,
  deployments: fromDeployments.reducer
};

const combinedReducers = combineReducers(reducers);
export function reducer(state: any, action: any) {
  return combinedReducers(state, action);
}
