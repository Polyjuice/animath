
export type JSONableObject = { [key: string]: JSONable };
export type JSONable = JSONableObject | number | string | boolean | null;


/**
 * Augments `target` with properties in `options`. Does not override
 * target's properties if they are defined and matches expected type in 
 * options
 *
 * @returns {Object} merged object
 */
export function merge<T>(target?: JSONableObject | null, options?: JSONableObject | null): T {
    var key;
    if (!target) { target = {} as JSONableObject; }
    if (options) {
        for (key in options) {
            if (options.hasOwnProperty(key)) {
                var targetHasIt = target.hasOwnProperty(key),
                    optionsValueType = typeof options[key],
                    shouldReplace = !targetHasIt || (typeof target[key] !== optionsValueType);

                if (shouldReplace) {
                    target[key] = options[key];
                } else if (optionsValueType === 'object') {
                    // go deep, don't care about loops here, we are simple API!:
                    target[key] = merge(target[key] as JSONableObject, options[key] as JSONableObject);
                }
            }
        }
    }

    return target as T;
}