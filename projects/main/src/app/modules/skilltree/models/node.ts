import { Point } from './point';

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

export class TreeNode {
  /** Unique id of the node. */
  id: number;
  name: string;
  icon: string;
  type: NodeType;

  position: Point;
  inEdges: TreeNode[];
  outEdges: TreeNode[];

  stats: string[];
  hint?: string;
}

export class Edge {
  from: TreeNode;
  to: TreeNode;
}
