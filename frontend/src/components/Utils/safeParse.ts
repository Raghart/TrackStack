import { type ZodType } from 'zod';

export function parseArrayOrEmpty<T>(schema: ZodType<T>, value: unknown) {
    const result = schema.safeParse(value);
    if (!result.success) {
        console.error(`Validation failed for array schema: ${result.error}`);
        return [];
    };
    return result.data;
};