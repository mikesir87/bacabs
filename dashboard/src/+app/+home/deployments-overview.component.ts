import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {Deployment} from "../deployment";

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
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DeploymentsOverviewComponent {
  @Input() deployments : Deployment[];

}
