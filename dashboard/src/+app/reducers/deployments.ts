import { Action } from '@ngrx/store';
import { Deployment } from '../../../../shared/deployment.model';

export interface DeploymentState {
  deployments: Deployment[];
}

const initialState: DeploymentState = {
  deployments: []
};

const SET_DEPLOYMENTS = 'deployments.set';
const UPDATE_DEPLOYMENT = 'deployments.update';

export const Actions = {
  SET_DEPLOYMENTS,
  UPDATE_DEPLOYMENT
};

export function reducer(state = initialState, action: Action): DeploymentState {
  switch(action.type) {
    case SET_DEPLOYMENTS:
      return Object.assign({}, { deployments: action.payload });
    case UPDATE_DEPLOYMENT:
      const deployment : Deployment = action.payload as Deployment;
      const existingIndex = state.deployments.findIndex(d => d.url == deployment.url);
      if (existingIndex == -1)
        return Object.assign({}, state, { deployments: [...state.deployments, deployment] });

      const newDeployment = Object.assign({}, state.deployments[existingIndex], deployment);
      const newDeployments = [
        ...state.deployments.slice(0, existingIndex),
        newDeployment,
        ...state.deployments.slice(existingIndex + 1)
      ];
      return Object.assign({}, state, { deployments: newDeployments });
    default:
      return state;
  }
}
