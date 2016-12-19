import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './shared/connection.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'app',
  styles: [
    'nav { margin-bottom: 30px; }'
  ],
  template: `
  <nav class="navbar navbar-dark bg-inverse">
    <div class="container">
      <a class="navbar-brand" href="javascript:void(0)">Bacabs</a>

      <connection-indicator [connected]="connected | async" class="navbar-text float-xs-right text-muted"></connection-indicator>
    </div>
  </nav>
  <main class="container">
    <router-outlet></router-outlet>
  </main>
  `
})
export class AppComponent {

  connected : Observable<Boolean>;

  constructor(private connectionService : ConnectionService) {
    this.connected = connectionService.isConnected();
  }

}
