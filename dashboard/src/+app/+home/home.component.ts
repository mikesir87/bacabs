import { Component, ChangeDetectionStrategy } from '@angular/core';
import {DeploymentService} from "../shared/deployment.service";
import {Deployment} from "../../../../shared/deployment.model";
import {Observable} from "rxjs";

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'home',
  template: `
    <div class="home">
      <deployments-overview [deployments]="deployments | async"></deployments-overview>
    </div>
  `
})
export class HomeComponent {
  data: any = {};
  deployments : Observable<Deployment[]>;

  constructor(private deploymentService : DeploymentService) {
    this.deployments = deploymentService.getDeployments();
  }
}
