export type Item = {
    id: string;
    data?: any;
};
export type ItemId = string;
export type NodeId = ItemId;
export type EdgeId = ItemId;
export type HavingNodes<N extends Node> = {
    nodes: Iterable<N>;
};
export type HavingEdges<N extends Node, E extends Edge<N>> = {
    edges: Iterable<E>;
};
export type Graph<N, E> = {
    nodes: Iterable<N>;
    edges: Iterable<E>;
    readonly dimensions?: number;
    from(edge: E): N;
    to(edge: E): N;
    position?(node: N): Vector;
    directional?(edge: E): boolean;
    edgeId(edge: E): string;
    nodeId(node: N): string;
    sameNode(a: N, b: N): boolean;
    sameEdge(a: E, b: E): boolean;
};
export type EditableGraph<N extends Node, E extends Edge<N>> = Graph<N, E> & {
    mutRemoveNode(node: N): void;
    mutRemoveEdge(edge: E): void;
    mutAddEdge(edge: E): void;
    mutAddNode(node: N): void;
};
export type Edge<N extends Node> = Item & {
    from: NodeId;
    to: NodeId;
};
export type Node = Item & {};
export type Vector = {
    x: number;
    y: number;
    z?: number;
    [coord: `c${number}`]: number;
};
export type Point = Node & {
    pos: Vector;
};
export type Line<N extends Node> = Edge<N> & {
    length?: number;
};
//# sourceMappingURL=core-graph-types.d.ts.map