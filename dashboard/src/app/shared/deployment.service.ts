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
import {SourceCodeUpdateEvent} from "../../../../shared/events";
import {Http} from "@angular/http";


export interface DeploymentUpdateEvent {
  status : 'UP' | 'DOWN';
  name : string;
  url : string;
  issueDetails : { identifier : string, url : string };
}

@Injectable()
export class DeploymentService {

    constructor(private connectionService : ConnectionService,
        private store : Store<State>,
        private http : Http) {

      this._updateDeployments();

      this.connectionService.getEvents()
        .filter(message => message.type == 'DeploymentUpdatedEvent')
        .map(message => message.payload as Deployment)
        .subscribe(event => this.processEvent(event));

      this.connectionService.getEvents()
        .filter(message => message.type == 'DeploymentRemovedEvent')
        .map(message => message.payload as Deployment)
        .subscribe(event => this.store.dispatch({ type : Actions.REMOVE_DEPLOYMENT, payload : event}));
    }

    getDeployments() : Observable<Deployment[]> {
      return this.store.select('deployments')
        .map(state => state as DeploymentState)
        .map(state => state.deployments);
    }

    private processEvent(deployment : Deployment) {
      this.store.dispatch({ type : Actions.UPDATE_DEPLOYMENT, payload: deployment });
    }

    private processDeployment(event : DeploymentUpdateEvent) {
      console.log("Received deployemnt update event", event);
    }

    private processVcsUpdate(event : SourceCodeUpdateEvent) {
      console.log("Received vcs update event", event);
    }

    private _updateDeployments() {
      this.http.get('/api/deployments')
          .map(response => response.json())
          .subscribe(deployments => this.store.dispatch({ type: Actions.SET_DEPLOYMENTS, payload: deployments }));
    }

}
