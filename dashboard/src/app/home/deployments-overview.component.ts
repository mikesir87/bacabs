import {Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Deployment} from "../../../../shared/deployment.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'deployments-overview',
  template: `
    <div *ngIf="deployments.length == 0">
      There are no deployments to display yet!
    </div>
    
    <div *ngIf="deployments.length > 0">
      <deployment-group-display *ngFor="let groupName of groups | objectKeys" [name]="groupName" [deployments]="groups[groupName]"></deployment-group-display>
    </div>
  `,
  styles: [
    'deployment-group-display { display: block; margin-bottom: 40px; }',
  ]
})
export class DeploymentsOverviewComponent implements OnChanges {
  @Input() deployments : Deployment[];

  private groups : { [key: string] : Deployment[] };


  ngOnChanges(changes: SimpleChanges): void {
    this.groups = {};

    this.groups = this.deployments
      .map(deployment => Object.assign({}, { appGroup : 'None' }, deployment))
      .reduce(
        (groups, deployment) => {
          if (groups[deployment.appGroup] === undefined)
            groups[deployment.appGroup] = [];
          groups[deployment.appGroup].push(deployment);
          return groups;
        },
        {}
      );
  }
}
