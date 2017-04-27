import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'connection-indicator',
  template: `
    Connection Status
    <span *ngIf="connected" class="fa fa-check text-success"></span>
    <span *ngIf="!connected" class="fa fa-times text-danger"></span>
  `
})
export class ConnectionIndicator {
  @Input('connected') connected;

}
