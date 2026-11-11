import { useAnimationFrame, useReducedMotion, type MotionValue } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'

const VERTEX = /* glsl */ `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

// A dark stage with haze in the air. One warm follow-spot hangs from a rig
// above the frame and tracks u_spot; two ember washes sway on their own.
// Everything is computed per pixel from distance-to-beam maths plus fbm noise,
// so there are no textures to load.
const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_spot;
uniform float u_time;
uniform float u_power;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float amplitude = 0.5;
  float sum = 0.0;
  for (int i = 0; i < 4; i++) {
    sum += amplitude * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    amplitude *= 0.5;
  }
  return sum;
}

// Brightness of a cone of light leaving 'source' toward 'target', sampled at p.
// r0 / r1 are the cone radius at the lamp and at the target.
float beam(vec2 p, vec2 source, vec2 target, float r0, float r1) {
  vec2 axis = target - source;
  float len = length(axis);
  vec2 dir = axis / len;
  vec2 rel = p - source;
  float along = dot(rel, dir);
  float across = abs(dot(rel, vec2(-dir.y, dir.x)));
  float t = clamp(along / len, 0.0, 1.5);
  float radius = mix(r0, r1, t);
  float core = smoothstep(radius, radius * 0.1, across);
  float reach = smoothstep(0.0, 0.1 * len, along) * (1.0 - smoothstep(0.92 * len, 1.3 * len, along));
  float falloff = 1.0 / (1.0 + 1.9 * t * t);
  return core * reach * falloff;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = gl_FragCoord.xy / u_resolution.y;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 spot = u_spot / u_resolution.y;

  // Slow drifting haze; a second layer warped by the first keeps it from tiling.
  float hazeA = fbm(p * 1.7 + vec2(u_time * 0.035, -u_time * 0.02));
  float hazeB = fbm(p * 3.3 - vec2(u_time * 0.05, u_time * 0.015) + hazeA * 1.4);
  float haze = mix(hazeA, hazeB, 0.55);

  // The follow-spot: lamp sits above the frame and leans a little toward the target.
  vec2 lamp = vec2(aspect * 0.5 + (spot.x - aspect * 0.5) * 0.22, 1.32);
  float follow = beam(p, lamp, spot, 0.018, 0.2);

  // The pool where it lands, flattened as if hitting a floor.
  vec2 q = (p - spot) / vec2(0.36, 0.23);
  float pool = exp(-dot(q, q) * 1.7);

  // Two side washes on slow, unrelated sweeps.
  vec2 leftLamp = vec2(aspect * 0.08, 1.28);
  vec2 leftAim = vec2(aspect * (0.3 + 0.16 * sin(u_time * 0.19)), 0.08);
  vec2 rightLamp = vec2(aspect * 0.92, 1.28);
  vec2 rightAim = vec2(aspect * (0.7 + 0.16 * sin(u_time * 0.15 + 2.1)), 0.02);
  float wash = beam(p, leftLamp, leftAim, 0.014, 0.19) + beam(p, rightLamp, rightAim, 0.014, 0.19);

  vec3 tungsten = vec3(1.0, 0.84, 0.62);
  vec3 ember = vec3(1.0, 0.3, 0.13);
  vec3 color = vec3(0.039, 0.035, 0.031);

  color += tungsten * follow * (0.3 + 1.05 * haze) * u_power;
  color += tungsten * pool * (0.16 + 0.1 * haze) * u_power;
  color += ember * wash * (0.1 + 0.42 * haze) * (0.35 + 0.65 * u_power);

  // Dust caught in the main beam: sparse cells, each mote wandering and twinkling.
  vec2 cell = p * 70.0;
  vec2 id = floor(cell);
  vec2 local = fract(cell) - 0.5;
  float seed = hash(id);
  vec2 wander = vec2(sin(u_time * 0.5 + seed * 40.0), cos(u_time * 0.4 + seed * 31.0)) * 0.3;
  float mote = smoothstep(0.16, 0.0, length(local - wander)) * step(0.9, seed);
  color += tungsten * mote * follow * (0.6 + 0.6 * sin(u_time * 1.7 + seed * 50.0)) * 1.5 * u_power;

  // Vignette, then a little dither so the dark gradients do not band.
  float vignette = smoothstep(1.2, 0.25, length((uv - 0.5) * vec2(1.05, 1.2)));
  color *= mix(0.5, 1.0, vignette);
  color += (hash(gl_FragCoord.xy + fract(u_time) * 91.7) - 0.5) * 0.02;

  gl_FragColor = vec4(color, 1.0);
}
`

interface Program {
  gl: WebGLRenderingContext
  resolution: WebGLUniformLocation | null
  spot: WebGLUniformLocation | null
  time: WebGLUniformLocation | null
  power: WebGLUniformLocation | null
}

function createProgram(canvas: HTMLCanvasElement): Program | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false })
  if (!gl) return null

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Spotlight shader failed to compile:', gl.getShaderInfoLog(shader))
      return null
    }
    return shader
  }

  const vertex = compile(gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  // One oversized triangle covers the viewport with no diagonal seam.
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  return {
    gl,
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    spot: gl.getUniformLocation(program, 'u_spot'),
    time: gl.getUniformLocation(program, 'u_time'),
    power: gl.getUniformLocation(program, 'u_power'),
  }
}

// Haze is soft, so the scene is drawn at a fraction of the screen resolution
// and scaled up by CSS. That cuts the fragment work by more than half.
const RESOLUTION_SCALE = 0.62
const MAX_PIXEL_RATIO = 1.5

export function SpotlightCanvas({
  spotX,
  spotY,
  power,
  active,
  className,
}: {
  /** Target of the follow-spot, in CSS pixels from the canvas's top-left. */
  spotX: MotionValue<number>
  spotY: MotionValue<number>
  /** 0 = lamp off, 1 = full. */
  power: MotionValue<number>
  /** Pause drawing when the stage is off screen. */
  active: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const programRef = useRef<Program | null>(null)
  const sizeRef = useRef({ width: 1, height: 1, scale: 1 })
  const reduce = useReducedMotion()

  // The motion values are stable objects, so this callback keeps one identity
  // for the life of the canvas.
  const draw = useCallback(
    (seconds: number) => {
      const program = programRef.current
      if (!program) return
      const { gl } = program
      const { height, scale } = sizeRef.current
      gl.uniform2f(program.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.uniform2f(program.spot, spotX.get() * scale, (height - spotY.get()) * scale)
      gl.uniform1f(program.time, seconds)
      gl.uniform1f(program.power, power.get())
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    [spotX, spotY, power],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const start = () => {
      programRef.current = createProgram(canvas)
      canvas.dataset.ready = programRef.current ? 'true' : 'false'
    }
    start()

    const resize = () => {
      const { clientWidth, clientHeight } = canvas
      const scale = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO) * RESOLUTION_SCALE
      sizeRef.current = { width: clientWidth, height: clientHeight, scale }
      canvas.width = Math.max(1, Math.round(clientWidth * scale))
      canvas.height = Math.max(1, Math.round(clientHeight * scale))
      programRef.current?.gl.viewport(0, 0, canvas.width, canvas.height)
      draw(0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const onLost = (event: Event) => {
      event.preventDefault()
      programRef.current = null
    }
    const onRestored = () => {
      start()
      resize()
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    return () => {
      observer.disconnect()
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      programRef.current = null
    }
  }, [draw])

  // Still frame for reduced motion: redraw only when the light level changes.
  useEffect(() => {
    if (!reduce) return undefined
    draw(0)
    return power.on('change', () => draw(0))
  }, [reduce, power, draw])

  useAnimationFrame((time) => {
    if (!active || reduce) return
    draw(time / 1000)
  })

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
