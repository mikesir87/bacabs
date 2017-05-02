import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './shared/connection.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'app-root',
  styles: [
    'nav { margin-bottom: 30px; }'
  ],
  template: `
  <nav class="navbar navbar-dark navbar-inverse bg-inverse">
    <div class="container">
      <a class="navbar-brand" href="javascript:void(0)">
        <img src="/logo-light.png" style="display:inline-block;margin-top:-2px;height:22px;" />&nbsp;
        Bacabs
      </a>

      <connection-indicator [connected]="connected | async" class="navbar-text float-right text-muted"></connection-indicator>
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
