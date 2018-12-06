import { TreeNode, NodeType } from '../modules/skilltree/models/node';
import { Point } from '../modules/skilltree/models/point';
import { Orbit, NodesPerOrbit, OrbitRadii } from '../modules/skilltree/shared/constants';

export class SkillTree {
  private data: any;

  nodes: Map<number, TreeNode>;
  rootNode: TreeNode;
  bottomLeft: Point;
  topRight: Point;

  constructor() { }

  load(jsonData: any) {
    this.nodes = new Map();
    this.rootNode = undefined;

    this.data = jsonData;

    this.buildNodes();
    this.connectNodesWithNodes();
    this.buildRootNode();

    this.bottomLeft = { x: this.data.min_x, y: this.data.min_y };
    this.topRight = { x: this.data.max_x, y: this.data.max_y };

    // Free up memory after processing
    this.data = undefined;
  }

  private detectNodeType(jsonNode: any): NodeType {
    let nodeType: NodeType;

    if (jsonNode.ks) {
      nodeType = NodeType.Keystone;
    } else if (jsonNode.not) {
      nodeType = NodeType.Notable;
    } else if (jsonNode.m) {
      nodeType = NodeType.Mastery;
    } else if (jsonNode.isJewelSocket) {
      nodeType = NodeType.JewelSocket;
    } else if (jsonNode.isAscendancyStart) {
      nodeType = NodeType.AscendencyStart;
    } else if (jsonNode.isMultipleChoice) {
      nodeType = NodeType.MultipleChoice;
    } else if (jsonNode.isMultipleChoiceOption) {
      nodeType = NodeType.MultipleChoiceOption;
    } else if (jsonNode.spc && jsonNode.spc.length > 0) {
      nodeType = NodeType.ClassStart;
    } else {
      nodeType = NodeType.Regular;
    }

    return nodeType;
  }

  private calculateNodePosition(groupId: number, indexOnOrbit: number, orbit: Orbit): Point {
    const group = this.data.groups[groupId.toString()];

    const angle = 2 * Math.PI * indexOnOrbit / NodesPerOrbit.get(orbit);
    const x = group.x - OrbitRadii.get(orbit) * Math.sin(-angle);
    const y = group.y - OrbitRadii.get(orbit) * Math.cos(-angle);

    return { x, y };
  }

  private decodeOrbit(orbitToDecode: number): Orbit {
    let orbit: Orbit;

    switch (orbitToDecode) {
      case 0:
        orbit = Orbit.Single;
        break;
      case 1:
        orbit = Orbit.Small;
        break;
      case 2:
        orbit = Orbit.Medium;
        break;
      case 3:
        orbit = Orbit.Large;
        break;
      case 4:
        orbit = Orbit.ExtraLarge;
        break;
      default:
        console.error(`invalid orbit ${orbitToDecode}`);
    }

    return orbit;
  }

  private buildNodes() {
    for (const jsonNode of Object.values<any>(this.data.nodes)) {
      const treeNode = new TreeNode();
      treeNode.id = jsonNode.id;
      treeNode.name = jsonNode.dn;
      treeNode.icon = jsonNode.icon;
      treeNode.type = this.detectNodeType(jsonNode);

      treeNode.position = this.calculateNodePosition(jsonNode.g, jsonNode.oidx, this.decodeOrbit(jsonNode.o));

      treeNode.inEdges = [];
      treeNode.outEdges = [];

      this.nodes.set(treeNode.id, treeNode);
    }

    console.log(`created ${this.nodes.size} nodes`);
  }

  private connectNodesWithNodes() {
    for (const jsonNode of Object.values<any>(this.data.nodes)) {
      const sourceNode = this.nodes.get(jsonNode.id);

      for (const id of jsonNode.out) {
        const targetNode = this.nodes.get(id);
        sourceNode.outEdges.push(targetNode);
        targetNode.inEdges.push(sourceNode);
      }
    }
  }

  private buildRootNode() {
    const rootNode = new TreeNode();
    rootNode.id = 0;
    rootNode.type = NodeType.Root;
    rootNode.outEdges = [];

    for (const id of this.data.root.out) {
      rootNode.outEdges.push(this.nodes.get(id));
    }

    this.rootNode = rootNode;
  }
}
