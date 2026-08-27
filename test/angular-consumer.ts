import { Component } from '@angular/core';
import { LoaderszLoader } from 'loadersz/angular';

@Component({
  standalone: true,
  imports: [LoaderszLoader],
  template: `
    <loadersz-loader
      [state]="state"
      [size]="size"
      [speed]="1.1"
      [paused]="paused"
      [forceMotion]="true"
      aria-label="Loading"
    ></loadersz-loader>
  `,
})
export class AngularConsumerFixture {
  readonly state = 'racing' as const;
  readonly size = 96;
  readonly paused = false;
}
