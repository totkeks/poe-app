import { TreeNode, NodeType, Edge } from '../modules/skilltree/models/node';
import { Point } from '../modules/skilltree/models/point';
import { Orbit, NodesPerOrbit, OrbitRadii } from '../modules/skilltree/shared/constants';

export class SkillTree {
  private data: any;

  nodes: Map<number, TreeNode>;
  edges: Edge[];
  rootNode: TreeNode;
  bottomLeft: Point;
  topRight: Point;

  constructor() { }

  load(jsonData: any) {
    this.nodes = new Map();
    this.edges = [];
    this.rootNode = undefined;

    this.data = jsonData;

    this.buildNodes();
    this.buildEdges();
    this.buildRootNode();

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

  private buildEdges() {
    for (const jsonNode of Object.values<any>(this.data.nodes)) {
      const origin = this.nodes.get(jsonNode.id);

      for (const id of jsonNode.out) {
        const destination = this.nodes.get(id);

        origin.outEdges.push(destination);
        destination.inEdges.push(origin);
        this.edges.push({ origin, destination });
      }
    }

    console.log(`created ${this.edges.length} edges`);
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
