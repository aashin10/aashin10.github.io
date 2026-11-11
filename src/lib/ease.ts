// Shared timing so every reveal on the site moves with the same hand.
export const EXPO = [0.16, 1, 0.3, 1] as const
export const QUART = [0.76, 0, 0.24, 1] as const
export const SPRING_SOFT = { type: 'spring', stiffness: 170, damping: 22, mass: 0.9 } as const
export const SPRING_SNAPPY = { type: 'spring', stiffness: 420, damping: 30, mass: 0.7 } as const
