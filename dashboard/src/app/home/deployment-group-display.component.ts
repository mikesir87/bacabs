import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {Deployment} from "../../../../shared/deployment.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'deployment-group-display',
  template: `
    <h3>{{ name }}</h3>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Health</th>
          <th>Issue</th>
          <th>Summary</th>
          <th>Last Deploy</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let deployment of deployments">
          <td>
            <span *ngIf="deployment.status == 'UP'; else deploymentDown">
              <span *ngIf="deployment.healthStatus == 'unhealthy'; else deploymentLink">{{ deployment.name }}</span>
              <template #deploymentLink>
                <a [href]="deployment.url" target="_blank">{{ deployment.name }}</a>
              </template>
            </span>
            
            <template #deploymentDown>
              {{ deployment.name }}
              <i class="fa fa-exclamation-triangle text-danger" *ngIf="deployment.status == 'DOWN'"></i>
            </template>
          </td>
          
          <td>
            <span *ngIf="deployment.healthStatus == 'healthy'">
              <i class="fa fa-thumbs-up text-success"></i>
            </span>
            <span *ngIf="deployment.healthStatus == 'unhealthy'">
              <i class="fa fa-thumbs-down text-danger"></i>
            </span>
          </td>
          
          <td>
            <span *ngIf="deployment.issue; else noIssueUrl">
              <a [href]="deployment.issue.url" target="_blank">{{ deployment.issue.identifier }}</a>
            </span>
            <template #noIssueUrl>--</template>
          </td>
          <td>
            <span *ngIf="deployment.issue">
              {{ deployment.issue.summary || '--' }}
            </span>
          </td>
          <td>
            <span *ngIf="deployment.creationTime > 0">
              {{ (deployment.creationTime | amFromUnix) | amDateFormat:'llll' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class DeploymentGroupDisplayComponent {
  @Input() name: string;
  @Input() deployments : Deployment[];

}
