import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConnectionService } from "./connection.service";
import {Actions, DeploymentState} from "../reducers/deployments";
import { Store } from "@ngrx/store";
import { State } from "../reducers";
import {Deployment} from "../deployment";


export interface DeploymentUpdateEvent {
  status : 'UP' | 'DOWN';
  name : string;
  url : string;
  issue : string;
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
      const deployment : Deployment = {
        url : event.url,
        name : event.name,
        status : event.status,
        creationTime : (new Date()).getTime(),
        issueDetails : { identifier : event.issue }
      };
      this.store.dispatch({ type : Actions.UPDATE_DEPLOYMENT, payload: deployment });
    }
}
