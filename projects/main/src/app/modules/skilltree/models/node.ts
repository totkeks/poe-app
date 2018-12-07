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
  icon: Icon;
  type: NodeType;

  position: Point;
  inEdges: TreeNode[];
  outEdges: TreeNode[];

  stats: string[];
  hint?: string;
}

export interface Edge {
  origin: TreeNode;
  destination: TreeNode;
}

export interface Icon {
  spriteFile: string;
  width: number;
  height: number;
  x: number;
  y: number;
}
