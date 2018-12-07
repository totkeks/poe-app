import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as SvgPanZoom from 'svg-pan-zoom';

import { environment } from '../../../../environments/environment';
import { SkillTree } from '../../../models/skilltree';
import { TreeNode, Edge, NodeType } from '../models/node';

@Component({
  selector: 'skilltree',
  template: `
    <svg id="skilltree">
      <ng-container *ngIf="finishedLoading">
        <g id="edges" [edge]="edge" *ngFor="let edge of edges"></g>
        <g id="nodes" [node]="node" *ngFor="let node of nodes"></g>
      </ng-container>
    </svg>
  `
})
export class SkilltreeComponent implements AfterViewInit {

  get nodes(): TreeNode[] {
    return Array.from(this.skillTree.nodes.values());
  }

  get edges(): Edge[] {
    return this.skillTree.edges;
  }

  finishedLoading = false;
  private skillTree: SkillTree;

  constructor(private http: HttpClient) {
    this.skillTree = new SkillTree();
    this.http.get(environment.skilltree).subscribe((data: any) => {
      this.skillTree.load(data);
      this.finishedLoading = true;

      console.log(this.skillTree);
    });
  }

  ngAfterViewInit() {
    // FIXME: properly wait for the skilltree to be generated
    setInterval(this.enablePanAndZoom, 1000);
  }

  private enablePanAndZoom() {
    SvgPanZoom('#skilltree', {
      controlIconsEnabled: false,
      dblClickZoomEnabled: false,
      fit: true,
      center: true,
      zoomScaleSensitivity: 1,
      beforePan: function (_, newPan) {
        const gutter = 200;

        // TODO: make the limits nicer, like 10% in each direction
        const sizes = this.getSizes();
        const leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutter;
        const rightLimit = sizes.width - gutter - (sizes.viewBox.x * sizes.realZoom);
        const topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutter;
        const bottomLimit = sizes.height - gutter - (sizes.viewBox.y * sizes.realZoom);

        const customPan = {
          x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
          y: Math.max(topLimit, Math.min(bottomLimit, newPan.y))
        };

        return customPan;
      }
    });
  }
}
