/**
 * From ngraph.forcelayout
 * Copyright (c) 2013 - 2025, Andrei Kashcha
 */
import { PhysicsSettings, PhysSpring, PhysBody } from "./types.js";
import { Graph, Vector } from "../core-graph-types.js";
/**
 * Manages a simulation of physical forces acting on bodies and springs.
 */
export declare class CPhysicsSimulator<BD, SD> implements Graph<PhysBody<BD>, PhysSpring<BD, SD>> {
    settings: PhysicsSettings;
    random: import("./random.js").Generator;
    bodies: PhysBody<BD>[];
    springs: PhysSpring<BD, SD>[];
    nextBodyId: number;
    quadTree: any;
    private bounds;
    private springForce;
    private dragForce;
    private integrate;
    private createBody;
    private totalMovement;
    private forces;
    private forceMap;
    private iterationNumber;
    protected dirty: boolean;
    from(spring: PhysSpring<BD, SD>): PhysBody<BD>;
    to(spring: PhysSpring<BD, SD>): PhysBody<BD>;
    edgeId(spring: PhysSpring<BD, SD>): string;
    nodeId(body: PhysBody<BD>): string;
    sameNode(a: PhysBody<BD>, b: PhysBody<BD>): boolean;
    sameEdge(a: PhysSpring<BD, SD>, b: PhysSpring<BD, SD>): boolean;
    get nodes(): Iterable<PhysBody<BD>>;
    get edges(): Iterable<PhysSpring<BD, SD>>;
    constructor(settings: Partial<PhysicsSettings>);
    addForce(forceName: string, forceFunction: any): void;
    removeForce(forceName: string): void;
    getForces(): Map<any, any>;
    /**
     * Performs one step of force simulation.
     *
     * @returns {boolean} true if system is considered stable; False otherwise.
     */
    step(): any;
    /**
     * Adds body to the system
     *
     * @param {ngraph.physics.primitives.Body} body physical body
     *
     * @returns {ngraph.physics.primitives.Body} added body
     */
    addBody(body: PhysBody<BD>): PhysBody<BD>;
    appendBody(body: PhysBody<BD>): void;
    /**
     * Adds body to the system at given position
     *
     * @param {Object} pos position of a body
     *
     * @returns {ngraph.physics.primitives.Body} added body
     */
    addBodyAt(pos: Vector): PhysBody<BD>;
    /**
     * Removes body from the system
     *
     * @param {ngraph.physics.primitives.Body} body to remove
     *
     * @returns {Boolean} true if body found and removed. falsy otherwise;
     */
    removeBody(body: PhysBody<BD>): boolean;
    appendSpring(spring: PhysSpring<BD, SD>): void;
    /**
     * Adds a spring to this simulation.
     *
     * @returns {Object} - a handle for a spring. If you want to later remove
     * spring pass it to removeSpring() method.
     */
    addSpring(body1: PhysBody<BD>, body2?: PhysBody<BD>, springLength?: number, springCoefficient?: number): PhysSpring<BD, SD>;
    /**
     * Returns amount of movement performed on last step() call
     */
    getTotalMovement(): number;
    /**
     * Removes spring from the system
     *
     * @param {Object} spring to remove. Spring is an object returned by addSpring
     *
     * @returns {Boolean} true if spring found and removed. falsy otherwise;
     */
    removeSpring(spring: PhysSpring<BD, SD>): boolean;
    getBestNewBodyPosition(neighbors?: PhysBody<BD>[]): any;
    getBoundingBox(): any;
    gravity(value?: number): number;
    theta(value?: number): number;
}
/**
 * Represents a physical spring. Spring connects two bodies, has rest length
 * stiffness coefficient and optional weight
 */
export declare class Spring<BDA, SDA> {
    from: PhysBody<BDA>;
    to: PhysBody<BDA>;
    length: number;
    coefficient: number;
    id: string;
    data: SDA;
    unreal: boolean;
    constructor(from: PhysBody<BDA>, to: PhysBody<BDA>, length: number, coefficient: number, data?: SDA);
}
