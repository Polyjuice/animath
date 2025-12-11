/**
 * From ngraph.random
 * Copyright (c) 2013 - 2025, Andrei Kashcha
 */



/**
 * Creates a seeded pseudo-random number generator (PRNG) with two methods:
 *   next() and nextDouble()
 *
 * @param inputSeed Optional seed value. If not provided, current time is used.
 * @returns A new instance of Generator.
 */
export function random(inputSeed?: number): Generator {
    const seed: number = typeof inputSeed === 'number' ? inputSeed : Date.now();
    return new Generator(seed);
}

/**
 * Generator class implementing a pseudo-random number generator.
 */
export class Generator {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    /**
     * Generates a random integer in the range [0, maxValue).
     *
     * @param maxValue Number REQUIRED. Omitting this number will result in NaN values.
     * @returns A random integer from 0 (inclusive) to maxValue (exclusive).
     */
    next(maxValue: number): number {
        return Math.floor(this.nextDouble() * maxValue);
    }

    /**
     * Generates a random double in the range [0, 1).
     * This is equivalent to Math.random(), but with a seed.
     *
     * @returns A pseudo-random number between 0 (inclusive) and 1 (exclusive).
     */
    nextDouble(): number {
        let seed = this.seed;
        // Robert Jenkins' 32-bit integer hash function.
        seed = ((seed + 0x7ed55d16) + (seed << 12)) & 0xffffffff;
        seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
        seed = ((seed + 0x165667b1) + (seed << 5)) & 0xffffffff;
        seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
        seed = ((seed + 0xfd7046c5) + (seed << 3)) & 0xffffffff;
        seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
        this.seed = seed;
        return (seed & 0xfffffff) / 0x10000000;
    }

    /**
     * Returns a random real number from a uniform distribution in [0, 1).
     */
    uniform(): number {
        return this.nextDouble();
    }

    /**
     * Returns a random real number from a Gaussian distribution with mean 0 and standard deviation 1.
     * Uses the polar form of the Box-Muller transform.
     */
    gaussian(): number {
        let r: number, x: number, y: number;
        do {
            x = this.nextDouble() * 2 - 1;
            y = this.nextDouble() * 2 - 1;
            r = x * x + y * y;
        } while (r >= 1 || r === 0);
        return x * Math.sqrt(-2 * Math.log(r) / r);
    }

    /**
     * Alias for nextDouble(), provided for compatibility with Math.random().
     */
    random(): number {
        return this.nextDouble();
    }

    /**
     * Returns a random number following a Lévy distribution.
     * Reference: https://twitter.com/anvaka/status/1296182534150135808
     */
    levy(): number {
        const beta = 3 / 2;
        const sigma = Math.pow(
            gamma(1 + beta) * Math.sin(Math.PI * beta / 2) /
            (gamma((1 + beta) / 2) * beta * Math.pow(2, (beta - 1) / 2)),
            1 / beta
        );
        return this.gaussian() * sigma / Math.pow(Math.abs(this.gaussian()), 1 / beta);
    }
}

/**
 * Gamma function approximation.
 *
 * @param z Input value.
 * @returns Approximated gamma of z.
 */
function gamma(z: number): number {
    return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
}

/**
 * Creates an iterator over an array, returning items in random order.
 * The original array is modified in place.
 *
 * @param array Array of items.
 * @param customRandom Optional custom PRNG instance. If not provided, a new one is created.
 * @returns An object with `forEach` and `shuffle` methods.
 */
export function randomIterator<T>(array: T[], customRandom?: Generator) {
    const localRandom = customRandom || random();
    if (typeof localRandom.next !== 'function') {
        throw new Error('customRandom does not match expected API: next() function is missing');
    }

    return {
        /**
         * Visits every single element of the array once, in a random order.
         *
         * @param callback Function to be executed for each element.
         */
        forEach(callback: (item: T) => void): void {
            let i: number, j: number, t: T;
            for (i = array.length - 1; i > 0; --i) {
                j = localRandom.next(i + 1);
                t = array[j];
                array[j] = array[i];
                array[i] = t;
                callback(t);
            }
            if (array.length) {
                callback(array[0]);
            }
        },

        /**
         * Shuffles the array randomly in place.
         *
         * @returns The shuffled array.
         */
        shuffle(): T[] {
            let i: number, j: number, t: T;
            for (i = array.length - 1; i > 0; --i) {
                j = localRandom.next(i + 1);
                t = array[j];
                array[j] = array[i];
                array[i] = t;
            }
            return array;
        }
    };
}
