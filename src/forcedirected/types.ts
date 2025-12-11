/**
 * Based on ngraph.forcelayout
 * Copyright (c) 2013 - 2025, Andrei Kashcha
 */

import { Vector } from "../core-graph-types.js";


// export type Vector = {
//     x: number;
//     y: number;
//     z?: number;
//     [coord: `c${number}`]: number
// }

export type PhysNodeId = string | number;
export type PhysEdgeId = string;

export type PhysEdge<B, DataType> = {
    id: string,
    from: B;
    to: B;
    data: DataType;
}

// /**
//  * A single link (edge) of the graph
//  */
// export interface Edge<Data = any> {
//     /**
//      * Unique identifier of this link
//      */
//     id: EdgeId,

//     /**
//      * Node identifier where this links starts
//      */
//     fromId: NodeId,

//     /**
//      * Node identifier where this link points to
//      */
//     toId: NodeId,
//     /**
//      * Arbitrary data associated with this link
//      */
//     data?: Data
// }

// /**
//  * A single node of a graph.
//  */
// export interface Node<Data = any> {
//     /**
//      * Unique identifier of this node
//      */
//     id: NodeId,

//     /**
//      * Set of incoming/outgoing links (edges) to/from this node.
//      * 
//      * For the sake of memory consumption preservation, this property
//      * is null when this node has no links.
//      * 
//      * Link instance is referentially equal throughout the API.
//      */
//     links: Set<Edge<any>> | null,

//     /**
//      * Associated data connected to this node.
//      */
//     data: Data
// }

export type PhysNode<T> = {
    id: string;
    data: T;
}

// /**
//  * A graph data structure
//  */
// export interface Graph<NodeData = any, LinkData = any> {
//     /**
//      * Adds a new node to the graph. If node with such id already exists
//      * its data is overwritten with the new data
//      */
//     addNode: (node: NodeId, data?: NodeData) => Node<NodeData>

//     /**
//      * Adds a new link to the graph. If link already exists and the graph
//      * is not a multigraph, then link's data is overwritten with a new data.
//      * 
//      * When graph is a multigraph, then a new link is always added between the
//      * nodes.
//      */
//     addLink: (from: NodeId, to: NodeId, data?: LinkData) => Edge<LinkData>

//     /**
//      * Removes a link from the graph. You'll need to pass an actual link instance
//      * to remove it. If you pass two arguments, the function assumes they represent
//      * from/to node ids, and removes the corresponding link.
//      * 
//      * Returns true if link is found and removed. False otherwise.
//      */
//     removeLink: (link: Edge<LinkData>) => boolean

//     /**
//      * Removes node by node id. Returns true if node was removed,
//      * false otherwise (e.g. no such node exists in the graph)
//      */
//     removeNode: (nodeId: NodeId) => boolean

//     /**
//      * Returns a node by its identifier. Undefined value is returned if node
//      * with such identifer does not exist.
//      */
//     getNode: (nodeId: NodeId) => Node<NodeData> | undefined

//     /**
//      * Checks whether given node exists in the graph. Return the node
//      * or undefined if no such node exist.
//      */
//     hasNode: (nodeId: NodeId) => Node<NodeData> | undefined

//     /**
//      * Returns a link between two nodes
//      */
//     getLink: (fromNodeId: NodeId, toNodeId: NodeId) => Edge<LinkData> | undefined

//     /**
//      * Checks if link is present in the graph 
//      */
//     hasLink: (fromNodeId: NodeId, toNodeId: NodeId) => Edge<LinkData> | undefined

//     /**
//      * Returns number of nodes in the graph
//      */
//     getNodesCount: () => number

//     /**
//      * Returns number of nodes in the graph
//      */
//     getNodeCount: () => number

//     /**
//      * Returns number of links (edges) in the graph
//      */
//     getLinksCount: () => number

//     /**
//      * Returns number of links (edges) in the graph
//      */
//     getLinkCount: () => number

//     /**
//      * Returns all links associated with this node
//      */
//     getLinks: (nodeId: NodeId) => Set<Edge<LinkData>> | null

//     /** 
//      * Iterates over every single node in the graph, passing the node to a callback.
//      * 
//      * If callback function returns "true"-like value, enumeration stops.
//      **/
//     forEachNode: (callbackPerNode: (node: Node<NodeData>) => void | undefined | null | boolean) => void

//     /**
//      * Iterates over every single link in the graph, passing the link to a callback.
//      * If callback function returns "true"-like value, enumeration stops.
//      */
//     forEachLink: (callbackPerLink: (link: Edge<LinkData>) => void | undefined | boolean) => void

//     /**
//      * Iterates over other node connected to the `nodeId`. If `oriented` is set to true,
//      * the callback will receive nodes on the `link.toId` end. Otherwise callback will
//      * receive nodes on either `.fromId` or `.toId`, depending on the `nodeId` argument.
//      */
//     forEachLinkedNode: (nodeId: NodeId, callbackPerNode: (otherNode: Node<NodeData>, link: Edge<LinkData>) => void, oriented: boolean) => void

//     /**
//      * Suspend all notifications about graph changes until
//      * endUpdate is called.
//      */
//     beginUpdate: () => void

//     /**
//      * Resumes all notifications about graph changes and fires
//      * graph 'changed' event in case there are any pending changes.
//      */
//     endUpdate: () => void

//     /**
//      * Removes all nodes and links from the graph.
//      */
//     clear: () => void
// }

// /**
// * Creates a new instance of a graph.
// */
// export default function createGraph<NodeData = any, LinkData = any>(options?: { multigraph: boolean }): Graph<NodeData, LinkData> & EventedType


export type PhysicsGraph<B, SD> = {
    getEdges(): Iterable<PhysEdge<B, SD>>;
}

/**
 * Manages a simulation of physical forces acting on bodies and springs.
 */
export interface PhysicsSimulator<BD, SD> {
    /**
     * Array of bodies, registered with current simulator
     *
     * Note: To add new body, use addBody() method. This property is only
     * exposed for testing/performance purposes.
     */
    bodies: PhysBody<BD>[];

    quadTree: QuadTree<BD>;

    /**
     * Array of springs, registered with current simulator
     *
     * Note: To add new spring, use addSpring() method. This property is only
     * exposed for testing/performance purposes.
     */
    springs: PhysSpring<BD, SD>[];

    /**
     * Returns settings with which current simulator was initialized
     */
    settings: PhysicsSettings;

    /**
     * Adds a new force to simulation
     * @param forceName force identifier
     * @param forceFunction the function to apply
     */
    addForce(forceName: string, forceFunction: ForceFunction): void;

    /**
     * Removes a force from the simulation
     * @param forceName force identifier
     */
    removeForce(forceName: string): void;

    /**
     * Returns a map of all registered forces
     */
    getForces(): Map<string, ForceFunction>;

    /**
     * Performs one step of force simulation.
     *
     * @returns true if system is considered stable; False otherwise.
     */
    step(): number;

    /**
     * Adds body to the system
     * @param body physical body
     * @returns added body
     */
    addBody(body: PhysBody<BD>): PhysBody<BD>;

    /**
     * Adds body to the system at given position
     * @param pos position of a body
     * @returns added body
     */
    addBodyAt(pos: Vector): PhysBody<BD>;

    /**
     * Removes body from the system
     * @param body to remove
     * @returns true if body found and removed. falsy otherwise;
     */
    removeBody(body: PhysBody<BD>): boolean;

    /**
     * Adds a spring to this simulation
     * @param body1 first body
     * @param body2 second body
     * @param springLength Ideal length for links
     * @param springCoefficient Hook's law coefficient. 1 - solid spring
     * @returns a handle for a spring. If you want to later remove
     * spring pass it to removeSpring() method.
     */
    addSpring(body1: PhysBody<BD>, body2: PhysBody<BD>, springLength: number, springCoefficient: number): PhysSpring<BD, SD>;

    /**
     * Returns amount of movement performed on last step() call
     */
    getTotalMovement(): number;

    /**
     * Removes spring from the system
     * @param spring to remove. Spring is an object returned by addSpring
     * @returns true if spring found and removed. falsy otherwise;
     */
    removeSpring(spring: PhysSpring<BD, SD>): boolean;

    getBestNewBodyPosition(neighbors: PhysBody<BD>[]): Vector;

    // /**
    //  * Returns bounding box which covers all bodies
    //  */
    // getBBox(): { x1: number; y1: number; x2: number; y2: number };

    /**
     * Returns bounding box which covers all bodies
     */
    getBoundingBox(): BoundingBox;


    /**
     * Changes the gravity for the system
     * @param value Coulomb's law coefficient
     */
    gravity(value: number): number;

    /**
     * Changes the theta coeffitient for the system
     * @param value Theta coefficient from Barnes Hut simulation
     */
    theta(value: number): number;

    // TODO: create types declaration file for ngraph.random
    /**
     * Returns pseudo-random number generator instance
     */
    random: any;
}


/**
 * Force based layout for a given graph.
 */
export interface Layout<BD, SD, T extends PhysicsGraph<BD, SD>> {
    /**
     * Performs one step of iterative layout algorithm
     * @returns true if the system should be considered stable; False otherwise.
     * The system is stable if no further call to `step()` can improve the layout.
     */
    step(): boolean;

    /**
     * For a given `nodeId` returns position
     * @param nodeId node identifier
     */
    getNodePosition(nodeId: PhysNodeId): Vector;

    /**
     * Sets position of a node to a given coordinates
     * @param nodeId node identifier
     * @param x position of a node
     * @param y position of a node
     * @param z position of node (only if applicable to body)
     */
    setNodePosition(nodeId: PhysNodeId, x: number, y: number, z?: number, ...c: number[]): void;

    /**
     * Gets Link position by link id
     * @param linkId link identifier
     * @returns from: {x, y} coordinates of link start
     * @returns to: {x, y} coordinates of link end
     */
    getLinkPosition(linkId: PhysEdgeId): { from: Vector; to: Vector } | undefined;

    /**
     * @returns area required to fit in the graph. Object contains
     * `x1`, `y1` - top left coordinates
     * `x2`, `y2` - bottom right coordinates
     */
    getGraphRect(): { x1: number; y1: number; x2: number; y2: number };

    /**
     * Iterates over each body in the layout simulator and performs a callback(body, nodeId)
     * @param callbackfn the callback function
     */
    forEachBody(callbackfn: (value: PhysBody<BD>, key: PhysNodeId, map: Map<PhysNodeId, PhysBody<BD>>) => void): void;

    /**
     * Requests layout algorithm to pin/unpin node to its current position
     * Pinned nodes should not be affected by layout algorithm and always
     * remain at their position
     * @param node the node to pin/unpin
     * @param isPinned true to pin, false to unpin
     */
    pinNode(node: PhysNode<BD>, isPinned: boolean): void;

    /**
     * Checks whether given graph's node is currently pinned
     * @param node the node to check
     */
    isNodePinned(node: PhysNode<BD>): boolean;

    /**
     * Request to release all resources
     */
    dispose(): void;

    /**
     * Gets physical body for a given node id. If node is not found undefined
     * value is returned.
     * @param nodeId node identifier
     */
    getBody(nodeId: PhysNodeId): PhysBody<BD> | undefined;

    /**
     * Gets spring for a given edge.
     *
     * @param linkId link identifer.
     */
    getSpring(linkId: PhysEdgeId | PhysSpring<BD, SD>): PhysSpring<BD, SD>;

    /**
     * Gets spring for a given edge.
     *
     * @param fromId node identifer - tail of the link
     * @param toId head of the link - head of the link
     */
    getSpring(fromId: PhysNodeId, toId: PhysNodeId): PhysSpring<BD, SD> | undefined;

    /**
     * Returns length of cumulative force vector. The closer this to zero - the more stable the system is
     */
    getForceVectorLength(): number;

    /**
     * @readonly Gets current physics simulator
     */
    readonly simulator: PhysicsSimulator<BD, SD>;

    /**
     * Gets the graph that was used for layout
     */
    graph: T;

    /**
     * Gets amount of movement performed during last step operation
     */
    lastMove: number;
}


/**
 * Settings for a PhysicsSimulator
 */
export interface PhysicsSettings {
    /**
     * Ideal length for links (springs in physical model).
     */
    springLength: number;

    /**
     * Hook's law coefficient. 1 - solid spring.
     */
    springCoefficient: number;

    /**
     * Coulomb's law coefficient. It's used to repel nodes thus should be negative
     * if you make it positive nodes start attract each other :).
     */
    gravity: number;

    /**
     * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
     * The closer it's to 1 the more nodes algorithm will have to go through.
     * Setting it to one makes Barnes Hut simulation no different from
     * brute-force forces calculation (each node is considered).
     */
    theta: number;

    /**
     * Drag force coefficient. Used to slow down system, thus should be less than 1.
     * The closer it is to 0 the less tight system will be.
     */
    dragCoefficient: number;

    /**
     * Default time step (dt) for forces integration
     */
    timeStep: number;

    /**
     * Adaptive time step uses average spring length to compute actual time step:
     * See: https://twitter.com/anvaka/status/1293067160755957760
     */
    adaptiveTimeStepWeight: number;

    /**
     * This parameter defines number of dimensions of the space where simulation
     * is performed.
     */
    dimensions: number;

    /**
     * In debug mode more checks are performed, this will help you catch errors
     * quickly, however for production build it is recommended to turn off this flag
     * to speed up computation.
     */
    debug: boolean;
}



// export interface Vector {
//     x: number;
//     y: number;
//     z?: number;
//     [coord: `c${number}`]: number
// }

export interface BoundingBox {
    min_x: number;
    max_x: number;
    min_y: number;
    max_y: number;
    min_z?: number;
    max_z?: number;
    [min: `min_c${number}`]: number;
    [max: `max_c${number}`]: number;
}


export interface QuadTree<BD> {
    insertBodies(bodies: PhysBody<BD>[]): void;
    getRoot(): QuadNode<BD>;
    updateBodyForce(sourceBody: PhysBody<BD>): void;
    options(newOptions: { gravity: number; theta: number }): { gravity: number; theta: number };
}


export type ForceFunction = (iterationNumber: number) => void;


export interface QuadNode<BD> {
    body: PhysBody<BD> | null;
    mass: number;
    mass_x: number;
    mass_y: number;
    mass_z?: number;
    [mass: `mass_c${number}`]: number | null;
    [mass: `min_c${number}`]: number | null;
    [mass: `max_c${number}`]: number | null;
    [quad: `quad${number}`]: number | null;
}

export type PhysBody<T> = PhysNode<T> & {
    isPinned: boolean;
    pos: Vector;
    force: Vector;
    velocity: Vector;
    mass: number;
    springCount: number;
    springLength: number;


    reset(): void;
    setPosition(x: number, y: number, z?: number, ...c: number[]): void;
}

export type PhysSpring<BD, SD> = PhysEdge<BD, SD> & {
    data: SD;
    from: PhysBody<BD>,
    to: PhysBody<BD>,
    length: number,
    coefficient: number,
    unreal: boolean;
}
