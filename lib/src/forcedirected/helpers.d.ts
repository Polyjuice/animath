export type JSONableObject = {
    [key: string]: JSONable;
};
export type JSONable = JSONableObject | number | string | boolean | null;
/**
 * Augments `target` with properties in `options`. Does not override
 * target's properties if they are defined and matches expected type in
 * options
 *
 * @returns {Object} merged object
 */
export declare function merge<T>(target?: JSONableObject | null, options?: JSONableObject | null): T;
//# sourceMappingURL=helpers.d.ts.map