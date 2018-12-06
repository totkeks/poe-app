export interface Point {
  x: number;
  y: number;
}

export class NodeGroup {
  id: number;
  center: Point;
  nodes: TreeNode[];
  occupiedOrbits: any; // TODO
}

export enum NodeType {
  Root,
  Regular,
  Mastery,
  Notable,
  Keystone,
  JewelSocket,

  ClassStart,
  AscendencyStart,
  MultipleChoice,
  MultipleChoiceOption
}

export enum OrbitRadius {
  Single = 0,
  Small = 82,
  Medium = 162,
  Large = 335,
  Largest = 493
}

export const NodesPerOrbit = new Map<OrbitRadius, number>()
  .set(OrbitRadius.Single, 1)
  .set(OrbitRadius.Small, 6)
  .set(OrbitRadius.Medium, 12)
  .set(OrbitRadius.Large, 12)
  .set(OrbitRadius.Largest, 40);

export class TreeNode {
  /** Unique id of the node. */
  id: number;
  group: NodeGroup;
  name: string;

  // TODO bring together as class
  orbit: number;
  orbitIndex: number;

  stats: string[];
  hint?: string;
}
