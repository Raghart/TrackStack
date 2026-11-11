import { type ZodType } from 'zod';

export function parseDataOrEmpty<T>(schema: ZodType<T>, value: unknown) {
    if (value === undefined) return undefined;
    const result = schema.safeParse(value);
    if (!result.success) {
        console.error(`Validation failed for schema: ${result.error}`);
        return undefined;
    };
    return result.data;
};