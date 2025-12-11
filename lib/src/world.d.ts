import { Composite } from "./Composite.js";
import { vecfn, vecx } from "./vec.js";
export declare class World<T extends vecx> {
    vecfn: vecfn<T>;
    composites: Composite<T>[];
    /**
     * @param vecfn Setts up the system to use 1d, 2d or 3d space
     */
    constructor(vecfn: vecfn<T>);
    run(steps: number): number;
}
//# sourceMappingURL=world.d.ts.map