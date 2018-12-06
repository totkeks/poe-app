import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import * as SvgPanZoom from 'svg-pan-zoom';

import { SkillTree } from '../models/skilltree';
import { TreeNode, Edge, NodeType } from '../modules/skilltree/models/node';

type Layer = d3.Selection<SVGGElement, {}, HTMLElement, any>;

@Component({
  selector: 'app-skilltree',
  templateUrl: './skilltree.component.html',
  styleUrls: ['./skilltree.component.scss']
})
export class SkilltreeComponent implements AfterViewInit {

  private skillTree: SkillTree;

  constructor(private http: HttpClient) {
    this.skillTree = new SkillTree();
    this.http.get('/data/3.5.0/skilltree.json').subscribe((data: any) => {
      this.skillTree.load(data);
      console.log(this.skillTree);

      this.drawSkillTree();

      SvgPanZoom('#skilltree', {
        controlIconsEnabled: false,
        dblClickZoomEnabled: false,
        fit: true,
        zoomScaleSensitivity: 1
      });
    });
  }

  ngAfterViewInit() {
  }

  private drawSkillTree() {
    // Order is important, so the nodes are above the edges
    const edgesLayer = d3.select('#skilltree').append('g');
    const nodesLayer = d3.select('#skilltree').append('g');

    for (const node of this.skillTree.nodes.values()) {
      this.drawNode(node, nodesLayer);
    }

    for (const edge of this.skillTree.edges) {
      this.drawEdge(edge, edgesLayer);
    }
  }

  private drawNode(node: TreeNode, layer: Layer) {
    layer.append('circle')
      .attr('cx', node.position.x)
      .attr('cy', node.position.y)
      .attr('r', '20px')
      .attr('fill', 'black');
  }

  private drawEdge(edge: Edge, layer: Layer) {
    // Do not draw edges to and from ascendancies
    if (edge.destination.type === NodeType.AscendencyStart) { return; }
    if (edge.origin.name.startsWith('Path of the')) { return; }

    layer.append('line')
      .attr('x1', edge.origin.position.x)
      .attr('y1', edge.origin.position.y)
      .attr('x2', edge.destination.position.x)
      .attr('y2', edge.destination.position.y)
      .style('stroke', 'green');
  }
}
