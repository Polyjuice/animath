"use strict";
// /**
//  * From ngraph.forcelayout
//  * Copyright (c) 2013 - 2025, Andrei Kashcha
//  */
// import { createPhysicsSimulator } from "./createPhysicsSimulator.js";
// import { Spring } from "./types.js";
// import { Graph, Layout, NodeId, PhysicsSettings, PhysicsSimulator, Vector, Body, BoundingBox, EdgeId, Edge, Node } from "./types.js";
// // Extend Graph with additional members used in our code.
// type ExtendedGraph = Graph & {
//     version: number;
//     on(event: string, cb: Function): void;
//     off(event: string, cb: Function): void;
//     forEachNode(cb: (node: any) => void): void;
//     forEachLink(cb: (link: any) => void): void;
//     getNodesCount(): number;
//     getLinks(nodeId: NodeId): Edge[];
//     getNode(nodeId: NodeId): Node;
//     hasLink(fromId: NodeId, toId: NodeId): any;
// };
// // Extend Body to include an "id" property.
// type ExtendedBody = Body & {
//     id?: NodeId;
// };
// // Extend the PhysicsSettings to include an optional simulator factory
// // and a custom node mass function. (These properties may not be part of
// // the default settings interface.)
// interface ExtendedPhysicsSettings extends Partial<PhysicsSettings> {
//     createSimulator?: (settings?: Partial<PhysicsSettings>) => PhysicsSimulator;
//     nodeMass?: (nodeId: NodeId) => number;
// }
// // Simple interface for graph change events.
// interface GraphChange {
//     changeType: 'add' | 'remove';
//     node?: {
//         id: NodeId;
//         position?: Vector;
//         isPinned?: boolean;
//         data?: { isPinned?: boolean };
//         links?: any[];
//     };
//     link?: { id: string; fromId: NodeId; toId: NodeId; length: number };
// }
// /**
//  * Creates force based layout for a given graph.
//  *
//  * @param graph which needs to be laid out
//  * @param physicsSettings if you need custom settings
//  * for physics simulator you can pass your own settings here. If it's not passed
//  * a default one will be created.
//  */
// export function createLayout<T extends ExtendedGraph>(
//     graph: T,
//     physicsSettings?: ExtendedPhysicsSettings
// ): Layout<T> {
//     if (!graph) {
//         throw new Error('Graph structure cannot be undefined');
//     }
//     console.log("Called createLayout with settings", physicsSettings);
//     // Use a custom simulator creation function if provided; otherwise fall back to the ES module import.
//     const createSimulator =
//         (physicsSettings && physicsSettings.createSimulator) || createPhysicsSimulator;
//     //@ts-ignore
//     const physicsSimulator: PhysicsSimulator = createSimulator(physicsSettings);
//     if (Array.isArray(physicsSettings)) {
//         throw new Error('Physics settings is expected to be an object');
//     }
//     // Choose node mass function based on the graph version.
//     let nodeMass: (nodeId: NodeId) => number =
//         graph.version > 19 ? defaultSetNodeMass : defaultArrayNodeMass;
//     if (physicsSettings && typeof physicsSettings.nodeMass === 'function') {
//         nodeMass = physicsSettings.nodeMass;
//     }
//     const nodeBodies: Map<NodeId, ExtendedBody> = new Map();
//     const springs: { [linkId: string]: Spring } = {};
//     let bodiesCount: number = 0;
//     // Some simulators attach an optional "springTransform" function to their settings.
//     const springTransform: (link: any, spring: Spring) => void =
//         ((physicsSimulator.settings as any).springTransform) || noop;
//     // Initialize the simulator with the graph’s initial state.
//     initPhysics();
//     // listenToEvents();
//     let wasStable: boolean = false;
//     const api: Layout<T> = {
//         /**
//          * Performs one step of the iterative layout algorithm.
//          * Returns true if the system is considered stable.
//          */
//         step: function (): boolean {
//             if (bodiesCount === 0) {
//                 updateStableStatus(true);
//                 return true;
//             }
//             const lastMove: number = physicsSimulator.step();
//             // Save the movement in case someone wants to read it.
//             api.lastMove = lastMove;
//             const ratio = lastMove / bodiesCount;
//             const isStableNow: boolean = ratio <= 0.01; // TODO: The threshold is somewhat arbitrary
//             updateStableStatus(isStableNow);
//             return isStableNow;
//         },
//         getNodePosition: function (nodeId: NodeId): Vector {
//             return getInitializedBody(nodeId).pos;
//         },
//         /**
//          * Sets position of a node.
//          */
//         setNodePosition: function (
//             nodeId: NodeId,
//             x: number,
//             y: number,
//             z?: number,
//             ...c: number[]
//         ): void {
//             const body = getInitializedBody(nodeId);
//             body.setPosition(x, y, z, ...c);
//         },
//         /**
//          * Returns link position by link id.
//          */
//         getLinkPosition: function (linkId: string): { from: Vector; to: Vector } | undefined {
//             const spring = springs[linkId];
//             if (spring) {
//                 return {
//                     from: spring.from.pos,
//                     to: spring.to.pos
//                 };
//             }
//             return undefined;
//         },
//         /**
//          * Returns the bounding box covering all bodies.
//          */
//         getGraphRect: function (): { x1: number; y1: number; x2: number; y2: number } {
//             return physicsSimulator.getBBox();
//         },
//         forEachBody: forEachBody,
//         /**
//          * Pins or unpins a node.
//          */
//         pinNode: function (node: Node, isPinned: boolean): void {
//             const body = getInitializedBody(node.id);
//             body.isPinned = !!isPinned;
//         },
//         isNodePinned: function (node: Node): boolean {
//             return getInitializedBody(node.id).isPinned;
//         },
//         /**
//          * Releases all resources.
//          */
//         dispose: function (): void {
//             graph.off('changed', onGraphChanged);
//             // Optionally, notify listeners of disposal.
//             // (api as any).fire('disposed');
//         },
//         /**
//          * Gets the physical body associated with a given node id.
//          */
//         getBody: getBody,
//         /**
//          * Gets the spring for a given edge.
//          */
//         getSpring: getSpring,
//         /**
//          * Returns the length of the cumulative force vector.
//          */
//         getForceVectorLength: getForceVectorLength,
//         simulator: physicsSimulator,
//         graph: graph,
//         lastMove: 0
//     };
//     // Uncomment the following line if you later want to add event behavior.
//     // eventify(api);
//     return api;
//     // --- Helper Functions ---
//     function updateStableStatus(isStableNow: boolean): void {
//         if (wasStable !== isStableNow) {
//             wasStable = isStableNow;
//             onStableChanged(isStableNow);
//         }
//     }
//     function forEachBody(
//         cb: (body: ExtendedBody, key: NodeId, map: Map<NodeId, ExtendedBody>) => void
//     ): void {
//         nodeBodies.forEach(cb);
//     }
//     function getForceVectorLength(): number {
//         let fx = 0,
//             fy = 0;
//         nodeBodies.forEach((body: ExtendedBody) => {
//             fx += Math.abs(body.force.x);
//             fy += Math.abs(body.force.y);
//         });
//         return Math.sqrt(fx * fx + fy * fy);
//     }
//     // Overload definitions for getSpring.
//     function getSpring(link: EdgeId | Edge): Spring;
//     function getSpring(fromId: NodeId, toId: NodeId): Spring | undefined;
//     function getSpring(
//         fromOrLink: EdgeId | Edge | NodeId,
//         toId?: NodeId
//     ): Spring | undefined {
//         let linkId: string;
//         if (toId === undefined) {
//             if (typeof fromOrLink !== "object") {
//                 // If it’s a link id:
//                 linkId = fromOrLink as string;
//             } else {
//                 // If it's a link object:
//                 linkId = (fromOrLink as Edge).id;
//             }
//         } else {
//             const linkObj = graph.hasLink(fromOrLink as NodeId, toId);
//             if (!linkObj) return undefined;
//             linkId = linkObj.id;
//         }
//         return springs[linkId];
//     }
//     function getBody(nodeId: NodeId): ExtendedBody | undefined {
//         return nodeBodies.get(nodeId);
//     }
//     function onStableChanged(isStable: boolean): void {
//         // For example, if using an event emitter, you could:
//         // (api as any).fire("stable", isStable);
//     }
//     function onGraphChanged(changes: Array<GraphChange>): void {
//         changes.forEach((change) => {
//             if (change.changeType === "add") {
//                 if (change.node) {
//                     initBody(change.node.id);
//                 }
//                 if (change.link) {
//                     initLink(change.link);
//                 }
//             } else if (change.changeType === "remove") {
//                 if (change.node) {
//                     releaseNode(change.node);
//                 }
//                 if (change.link) {
//                     releaseLink(change.link);
//                 }
//             }
//         });
//         bodiesCount = graph.getNodesCount();
//     }
//     function initPhysics(): void {
//         bodiesCount = 0;
//         graph.forEachNode(function (node: any) {
//             initBody(node.id);
//             bodiesCount += 1;
//         });
//         graph.forEachLink(initLink);
//     }
//     function initBody(nodeId: NodeId): void {
//         let body = nodeBodies.get(nodeId);
//         if (!body) {
//             const node = graph.getNode(nodeId);
//             if (!node) {
//                 throw new Error("initBody() was called with unknown node id");
//             }
//             //@ts-ignore
//             let pos: Vector | undefined = node.position;
//             if (!pos) {
//                 const neighbors: ExtendedBody[] = getNeighborBodies(node);
//                 pos = physicsSimulator.getBestNewBodyPosition(neighbors);
//             }
//             body = physicsSimulator.addBodyAt(pos) as ExtendedBody;
//             body.id = nodeId;
//             nodeBodies.set(nodeId, body);
//             updateBodyMass(nodeId);
//             if (isNodeOriginallyPinned(node)) {
//                 body.isPinned = true;
//             }
//         }
//     }
//     function releaseNode(node: { id: NodeId }): void {
//         const nodeId = node.id;
//         const body = nodeBodies.get(nodeId);
//         if (body) {
//             nodeBodies.delete(nodeId);
//             physicsSimulator.removeBody(body);
//         }
//     }
//     function initLink(link: { id: string; fromId: NodeId; toId: NodeId; length: number }): void {
//         updateBodyMass(link.fromId);
//         updateBodyMass(link.toId);
//         const fromBody = nodeBodies.get(link.fromId);
//         const toBody = nodeBodies.get(link.toId);
//         if (!fromBody || !toBody) {
//             return;
//         }
//         // Use the simulator's default spring coefficient for consistency.
//         const spring = physicsSimulator.addSpring(
//             fromBody,
//             toBody,
//             link.length,
//             physicsSimulator.settings.springCoefficient
//         );
//         springTransform(link, spring);
//         springs[link.id] = spring;
//     }
//     function releaseLink(link: { id: string; fromId: NodeId; toId: NodeId }): void {
//         const spring = springs[link.id];
//         if (spring) {
//             const from = graph.getNode(link.fromId);
//             const to = graph.getNode(link.toId);
//             if (from) {
//                 updateBodyMass(from.id);
//             }
//             if (to) {
//                 updateBodyMass(to.id);
//             }
//             delete springs[link.id];
//             physicsSimulator.removeSpring(spring);
//         }
//     }
//     function getNeighborBodies(node: any): ExtendedBody[] {
//         const neighbors: ExtendedBody[] = [];
//         if (!node.links) {
//             return neighbors;
//         }
//         node.links.forEach((link: any) => {
//             const otherBody =
//                 link.fromId !== node.id ? nodeBodies.get(link.fromId) : nodeBodies.get(link.toId);
//             if (otherBody && otherBody.pos) {
//                 neighbors.push(otherBody);
//             }
//         });
//         return neighbors;
//     }
//     function updateBodyMass(nodeId: NodeId): void {
//         const body = nodeBodies.get(nodeId);
//         if (body) {
//             body.mass = nodeMass(nodeId);
//             if (Number.isNaN(body.mass)) {
//                 throw new Error("Node mass should be a number");
//             }
//         }
//     }
//     /**
//      * Checks whether a node is originally pinned via its properties.
//      */
//     function isNodeOriginallyPinned(node: any): boolean {
//         return !!(node && (node.isPinned || (node.data && node.data.isPinned)));
//     }
//     function getInitializedBody(nodeId: NodeId): ExtendedBody {
//         let body = nodeBodies.get(nodeId);
//         if (!body) {
//             initBody(nodeId);
//             body = nodeBodies.get(nodeId)!;
//         }
//         return body;
//     }
//     function defaultArrayNodeMass(nodeId: NodeId): number {
//         const links = graph.getLinks(nodeId);
//         if (!links) return 1;
//         return 1 + (Array.isArray(links) ? links.length : 0) / 3.0;
//     }
//     function defaultSetNodeMass(nodeId: NodeId): number {
//         const links = graph.getLinks(nodeId);
//         if (!links) return 1;
//         return 1 + ((links as Set<any>).size) / 3.0;
//     }
// }
// function noop(): void { }
//# sourceMappingURL=createLayout.js.map