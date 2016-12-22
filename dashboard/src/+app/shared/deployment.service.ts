import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConnectionService } from "./connection.service";
import {Actions, DeploymentState} from "../reducers/deployments";
import { Store } from "@ngrx/store";
import { State } from "../reducers";
import {Deployment} from "../../../../shared/deployment.model";


export interface DeploymentUpdateEvent {
  status : 'UP' | 'DOWN';
  name : string;
  url : string;
  issueDetails : { identifier : string, url : string };
}

@Injectable()
export class DeploymentService {

    constructor(private connectionService : ConnectionService,
        private store : Store<State>) {
      this.connectionService.getEvents()
        .filter(message => message.type == 'DeploymentUpdateEvent')
        .map(message => message.payload as DeploymentUpdateEvent)
        .subscribe(event => this.processEvent(event));
    }

    getDeployments() : Observable<Deployment[]> {
      return this.store.select('deployments')
        .map(state => state as DeploymentState)
        .map(state => state.deployments);
    }

    private processEvent(event : DeploymentUpdateEvent) {
      const deployment : Deployment = Object.assign({}, event, { creationTime : (new Date()).getTime() });
      this.store.dispatch({ type : Actions.UPDATE_DEPLOYMENT, payload: deployment });
    }
}
