import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'home',
  template: `
    <div class="home">
      Home component
      <strong>Async data call return value:</strong>
      <pre>{{ data | json }}</pre>
      <blockquote>{{ data.data }}</blockquote>
    </div>
  `
})
export class HomeComponent {
  data: any = {};

}
