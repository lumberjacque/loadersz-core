import { Component } from '@angular/core';

import { LoaderszLoader } from './angular';

@Component({
  standalone: true,
  imports: [LoaderszLoader],
  template: `
    <loadersz-loader
      [state]="state"
      [size]="96"
      [speed]="1.1"
      [paused]="paused"
      [forceMotion]="true"
      aria-label="Loading"
    ></loadersz-loader>
  `,
})
class AngularAdapterTypecheck {
  readonly state = 'racing' as const;
  readonly paused = false;
}

void AngularAdapterTypecheck;
