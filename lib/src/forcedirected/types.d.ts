/**
 * Based on ngraph.forcelayout
 * Copyright (c) 2013 - 2025, Andrei Kashcha
 */
import { Vector } from "../core-graph-types.js";
export type PhysNodeId = string | number;
export type PhysEdgeId = string;
export type PhysEdge<B, DataType> = {
    id: string;
    from: B;
    to: B;
    data: DataType;
};
export type PhysNode<T> = {
    id: string;
    data: T;
};
export type PhysicsGraph<B, SD> = {
    getEdges(): Iterable<PhysEdge<B, SD>>;
};
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
    getLinkPosition(linkId: PhysEdgeId): {
        from: Vector;
        to: Vector;
    } | undefined;
    /**
     * @returns area required to fit in the graph. Object contains
     * `x1`, `y1` - top left coordinates
     * `x2`, `y2` - bottom right coordinates
     */
    getGraphRect(): {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
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
    options(newOptions: {
        gravity: number;
        theta: number;
    }): {
        gravity: number;
        theta: number;
    };
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
};
export type PhysSpring<BD, SD> = PhysEdge<BD, SD> & {
    data: SD;
    from: PhysBody<BD>;
    to: PhysBody<BD>;
    length: number;
    coefficient: number;
    unreal: boolean;
};
