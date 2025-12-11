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
export declare function random(inputSeed?: number): Generator;
/**
 * Generator class implementing a pseudo-random number generator.
 */
export declare class Generator {
    private seed;
    constructor(seed: number);
    /**
     * Generates a random integer in the range [0, maxValue).
     *
     * @param maxValue Number REQUIRED. Omitting this number will result in NaN values.
     * @returns A random integer from 0 (inclusive) to maxValue (exclusive).
     */
    next(maxValue: number): number;
    /**
     * Generates a random double in the range [0, 1).
     * This is equivalent to Math.random(), but with a seed.
     *
     * @returns A pseudo-random number between 0 (inclusive) and 1 (exclusive).
     */
    nextDouble(): number;
    /**
     * Returns a random real number from a uniform distribution in [0, 1).
     */
    uniform(): number;
    /**
     * Returns a random real number from a Gaussian distribution with mean 0 and standard deviation 1.
     * Uses the polar form of the Box-Muller transform.
     */
    gaussian(): number;
    /**
     * Alias for nextDouble(), provided for compatibility with Math.random().
     */
    random(): number;
    /**
     * Returns a random number following a Lévy distribution.
     * Reference: https://twitter.com/anvaka/status/1296182534150135808
     */
    levy(): number;
}
/**
 * Creates an iterator over an array, returning items in random order.
 * The original array is modified in place.
 *
 * @param array Array of items.
 * @param customRandom Optional custom PRNG instance. If not provided, a new one is created.
 * @returns An object with `forEach` and `shuffle` methods.
 */
export declare function randomIterator<T>(array: T[], customRandom?: Generator): {
    /**
     * Visits every single element of the array once, in a random order.
     *
     * @param callback Function to be executed for each element.
     */
    forEach(callback: (item: T) => void): void;
    /**
     * Shuffles the array randomly in place.
     *
     * @returns The shuffled array.
     */
    shuffle(): T[];
};
