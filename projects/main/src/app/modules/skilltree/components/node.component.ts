import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeNode } from '../models/node';

@Component({
  selector: '[node]',
  template: `
      <svg:circle
        class="node"
        fill="black"
        [attr.cx]="node.position.x"
        [attr.cy]="node.position.y"
        r="10">
      </svg:circle>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NodeComponent {
  @Input() node: TreeNode;
}
