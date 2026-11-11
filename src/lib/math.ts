export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t

/** Keeps `value` inside [min, max) by wrapping around, for endless tracks. */
export const wrap = (min: number, max: number, value: number) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Small deterministic PRNG so "random" layouts are identical on every render. */
export const seeded = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
