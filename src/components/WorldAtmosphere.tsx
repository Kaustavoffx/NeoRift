import { useEffect, useRef } from 'react'

type WorldAtmosphereProps = {
  palette: {
    glow: string
    glowAlt: string
    ink: string
  }
  seed: number
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

export default function WorldAtmosphere({ palette, seed }: WorldAtmosphereProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const el = canvas
    const state = {
      width: 0,
      height: 0,
      pointerX: 0.5,
      pointerY: 0.5,
      time: seed * 0.31,
    }

    let particles: Particle[] = []
    let raf = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      state.width = el.clientWidth
      state.height = el.clientHeight
      el.width = Math.max(1, Math.floor(state.width * ratio))
      el.height = Math.max(1, Math.floor(state.height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const count = Math.max(24, Math.floor((state.width * state.height) / 56000))
      particles = Array.from({ length: count }, (_, index) => ({
        x: ((index * 97 + seed * 19) % Math.max(state.width, 1)) + Math.random() * 80,
        y: ((index * 71 + seed * 13) % Math.max(state.height, 1)) + Math.random() * 80,
        vx: (Math.random() - 0.5) * (0.35 + (seed % 3) * 0.03),
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.16,
      }))
    }

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      state.pointerX = (event.clientX - rect.left) / Math.max(rect.width, 1)
      state.pointerY = (event.clientY - rect.top) / Math.max(rect.height, 1)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)

    const drawWash = () => {
      const centerX = state.width * state.pointerX
      const centerY = state.height * state.pointerY
      const wash = context.createRadialGradient(centerX, centerY, 0, state.width / 2, state.height / 2, Math.max(state.width, state.height))
      wash.addColorStop(0, `${palette.glow}88`)
      wash.addColorStop(0.35, `${palette.glowAlt}18`)
      wash.addColorStop(1, 'rgba(0,0,0,0.08)')
      context.fillStyle = wash
      context.fillRect(0, 0, state.width, state.height)
    }

    const drawGrid = () => {
      const baseSpacing = 56 + (seed % 4) * 10
      context.save()
      context.globalAlpha = 0.12
      context.strokeStyle = palette.ink
      context.lineWidth = 1
      for (let x = -baseSpacing; x < state.width + baseSpacing; x += baseSpacing) {
        const wobble = Math.sin(state.time + x * 0.01) * 7
        context.beginPath()
        context.moveTo(x + wobble, 0)
        context.lineTo(x - wobble * 0.25, state.height)
        context.stroke()
      }
      for (let y = -baseSpacing; y < state.height + baseSpacing; y += baseSpacing) {
        const wobble = Math.cos(state.time + y * 0.012) * 7
        context.beginPath()
        context.moveTo(0, y + wobble)
        context.lineTo(state.width, y - wobble * 0.22)
        context.stroke()
      }
      context.restore()
    }

    const loop = () => {
      state.time += 0.01 + seed * 0.0008
      context.clearRect(0, 0, state.width, state.height)
      drawWash()
      drawGrid()

      context.save()
      context.globalCompositeOperation = 'lighter'

      for (const particle of particles) {
        const dx = state.width * state.pointerX - particle.x
        const dy = state.height * state.pointerY - particle.y
        const distance = Math.max(36, Math.hypot(dx, dy))
        const orbit = 0.0016 + seed * 0.00002

        particle.vx += dx * orbit / distance
        particle.vy += dy * orbit / distance
        particle.x += particle.vx + Math.sin(state.time + particle.y * 0.01) * 0.16
        particle.y += particle.vy + Math.cos(state.time + particle.x * 0.01) * 0.12
        particle.vx *= 0.985
        particle.vy *= 0.985

        if (particle.x < -40) particle.x = state.width + 40
        if (particle.x > state.width + 40) particle.x = -40
        if (particle.y < -40) particle.y = state.height + 40
        if (particle.y > state.height + 40) particle.y = -40

        const radius = particle.size * (1 + Math.sin(state.time + particle.size) * 0.2)
        const glow = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius * 6)
        glow.addColorStop(0, 'rgba(255,255,255,0.94)')
        glow.addColorStop(0.28, palette.glow)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        context.fillStyle = glow
        context.globalAlpha = particle.alpha
        context.beginPath()
        context.arc(particle.x, particle.y, radius * 3.2, 0, Math.PI * 2)
        context.fill()
      }

      context.restore()

      const vignette = context.createRadialGradient(state.width / 2, state.height / 2, Math.min(state.width, state.height) * 0.14, state.width / 2, state.height / 2, Math.max(state.width, state.height))
      vignette.addColorStop(0, 'rgba(255,255,255,0.02)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.18)')
      context.fillStyle = vignette
      context.fillRect(0, 0, state.width, state.height)

      raf = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [palette.glow, palette.glowAlt, palette.ink, seed])

  return <canvas ref={ref} className="world-atmosphere" aria-hidden="true" />
}
