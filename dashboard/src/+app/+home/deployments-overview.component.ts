import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {Deployment} from "../../../../shared/deployment.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'deployments-overview',
  template: `
    <div *ngIf="deployments.length == 0">
      There are no deployments to display yet!
    </div>
    
    <div *ngIf="deployments.length > 0">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Issue</th>
            <th>Summary</th>
            <th>Last Code Update</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let deployment of deployments">
            <td>
              <a [href]="deployment.url" target="_blank">{{ deployment.name }}</a>
              <i class="fa fa-exclamation-triangle text-danger" *ngIf="deployment.status == 'DOWN'"></i>
            </td>
            <td>
              <a [href]="deployment.issue.url" target="_blank">{{ deployment.issue.identifier }}</a>
            </td>
            <td>{{ deployment.issue.summary || '--' }}</td>
            <td>
              <span *ngIf="deployment.lastCommit.date">
                {{ (deployment.lastCommit.date / 1000 | amFromUnix) | amDateFormat:'llll' }} by {{ deployment.lastCommit.author }}
              </span>
              <span *ngIf="!deployment.lastCommit.date">
                <em>Unknown</em>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DeploymentsOverviewComponent {
  @Input() deployments : Deployment[];

}
