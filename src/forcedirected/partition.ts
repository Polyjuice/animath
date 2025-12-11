

import type { Graph, Node, Edge, Vector } from "../core-graph-types.js";

export function partition<
    N extends Node,
    E extends Edge<N>
>(graph: Graph<N, E>): Graph<N, E>[] {
    // 1. index all nodes by their string ID
    const nodeMap = new Map<string, N>();
    for (const node of graph.nodes) {
        nodeMap.set(graph.nodeId(node), node);
    }

    // 2. build an undirected adjacency list of node‐IDs
    const adj = new Map<string, string[]>();
    for (const id of nodeMap.keys()) {
        adj.set(id, []);
    }
    for (const edge of graph.edges) {
        const u = graph.nodeId(graph.from(edge));
        const v = graph.nodeId(graph.to(edge));
        // only link if both endpoints actually exist
        if (adj.has(u) && adj.has(v)) {
            adj.get(u)!.push(v);
            adj.get(v)!.push(u);
        }
    }

    // 3. find connected components with a simple BFS
    const visited = new Set<string>();
    const components: string[][] = [];
    for (const start of nodeMap.keys()) {
        if (visited.has(start)) continue;
        const comp: string[] = [];
        const queue = [start];
        visited.add(start);
        while (queue.length) {
            const curr = queue.shift()!;
            comp.push(curr);
            for (const nbr of adj.get(curr)!) {
                if (!visited.has(nbr)) {
                    visited.add(nbr);
                    queue.push(nbr);
                }
            }
        }
        components.push(comp);
    }

    // 4. if the whole graph is one component, just return the original
    if (components.length === 1) {
        return [graph];
    }

    // 5. otherwise, for each component, filter the nodes & edges
    return components.map((compIds) => {
        const compIdSet = new Set(compIds);
        const compNodes = compIds.map((id) => nodeMap.get(id)!);
        const compEdges: E[] = [];
        for (const edge of graph.edges) {
            const u = graph.nodeId(graph.from(edge));
            const v = graph.nodeId(graph.to(edge));
            if (compIdSet.has(u) && compIdSet.has(v)) {
                compEdges.push(edge);
            }
        }

        // build a Graph<N,E> that uses the same accessors but only this subset
        return {
            nodes: compNodes,
            edges: compEdges,
            from: (e: E) => graph.from(e),
            to: (e: E) => graph.to(e),
            edgeId: (e: E) => graph.edgeId(e),
            nodeId: (n: N) => graph.nodeId(n),
            sameNode: (a: N, b: N) => graph.sameNode(a, b),
            sameEdge: (a: E, b: E) => graph.sameEdge(a, b)
        };
    }) as any;
}
