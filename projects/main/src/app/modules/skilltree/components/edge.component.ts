import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Edge } from '../models/node';

@Component({
  selector: '[edge]',
  template: `
    <svg:g>
      <svg:line
        class="edge"
        stroke="green"
        [attr.x1]="edge.origin.position.x"
        [attr.y1]="edge.origin.position.y"
        [attr.x2]="edge.destination.position.x"
        [attr.y2]="edge.destination.position.y">
      </svg:line>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EdgeComponent {
  @Input() edge: Edge;
}
