/** Joins class names, skipping anything falsy. */
export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')
