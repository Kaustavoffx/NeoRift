import { useEffect, useRef } from 'react'

type MenuAtmosphereProps = {
  activeIndex: number
  palette: {
    glow: string
    glowAlt: string
    ink: string
  }
}

type VeilParticle = {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

export default function MenuAtmosphere({ activeIndex, palette }: MenuAtmosphereProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const el = canvas as HTMLCanvasElement
    const context = el.getContext('2d')
    if (!context) return

    const state = {
      width: 0,
      height: 0,
      pointerX: 0.5,
      pointerY: 0.5,
      drift: activeIndex * 0.12,
      pulse: 0,
    }

    let particles: VeilParticle[] = []
    let raf = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      state.width = el.clientWidth
      state.height = el.clientHeight
      el.width = Math.max(1, Math.floor(state.width * ratio))
      el.height = Math.max(1, Math.floor(state.height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const count = Math.max(24, Math.floor((state.width * state.height) / 52000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.55 + 0.18,
      }))
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      state.pointerX = (event.clientX - rect.left) / Math.max(rect.width, 1)
      state.pointerY = (event.clientY - rect.top) / Math.max(rect.height, 1)
    }

    const onPointerLeave = () => {
      state.pointerX = 0.5
      state.pointerY = 0.5
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    const drawGrid = () => {
      const spacing = 48
      context.save()
      context.globalAlpha = 0.18
      context.strokeStyle = palette.ink
      context.lineWidth = 1

      for (let x = -spacing; x < state.width + spacing; x += spacing) {
        const offset = Math.sin(state.drift + x * 0.01) * 6
        context.beginPath()
        context.moveTo(x + offset, 0)
        context.lineTo(x + offset * 0.4, state.height)
        context.stroke()
      }

      for (let y = -spacing; y < state.height + spacing; y += spacing) {
        const offset = Math.cos(state.drift + y * 0.015) * 6
        context.beginPath()
        context.moveTo(0, y + offset)
        context.lineTo(state.width, y + offset * 0.3)
        context.stroke()
      }

      context.restore()
    }

    const loop = () => {
      state.drift += 0.0035 + activeIndex * 0.0008
      state.pulse += 0.018
      context.clearRect(0, 0, state.width, state.height)

      const baseX = state.width * state.pointerX
      const baseY = state.height * state.pointerY
      const hueShift = 24 * Math.sin(state.pulse * 0.55 + activeIndex)

      const resolveColor = (base: string, hexSuffix?: string) => {
        if (!hexSuffix) return base
        if (base.startsWith('#')) return base + hexSuffix
        const m = base.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (m) {
          const r = Number(m[1])
          const g = Number(m[2])
          const b = Number(m[3])
          const alpha = Math.max(0, Math.min(1, parseInt(hexSuffix, 16) / 255))
          return `rgba(${r}, ${g}, ${b}, ${alpha})`
        }
        return base
      }

      const bg = context.createRadialGradient(baseX, baseY, 0, state.width / 2, state.height / 2, Math.max(state.width, state.height))
      bg.addColorStop(0, resolveColor(palette.glow, '80'))
      bg.addColorStop(0.42, resolveColor(palette.glowAlt, '22'))
      bg.addColorStop(1, 'rgba(0,0,0,0.08)')
      context.fillStyle = bg
      context.fillRect(0, 0, state.width, state.height)

      drawGrid()

      context.save()
      context.globalCompositeOperation = 'lighter'
      for (const particle of particles) {
        const dx = baseX - particle.x
        const dy = baseY - particle.y
        const distance = Math.max(36, Math.hypot(dx, dy))
        const pull = (1 / distance) * (0.28 + activeIndex * 0.03)

        particle.vx += dx * pull * 0.0012
        particle.vy += dy * pull * 0.0012
        particle.x += particle.vx + Math.sin(state.drift + particle.y * 0.01) * 0.12
        particle.y += particle.vy + Math.cos(state.drift + particle.x * 0.01) * 0.08
        particle.vx *= 0.985
        particle.vy *= 0.985

        if (particle.x < -40) particle.x = state.width + 40
        if (particle.x > state.width + 40) particle.x = -40
        if (particle.y < -40) particle.y = state.height + 40
        if (particle.y > state.height + 40) particle.y = -40

        context.beginPath()
        context.globalAlpha = particle.alpha * (0.8 + particle.z * 0.3)
        const radius = particle.radius * (1 + Math.sin(state.pulse + particle.z * 8 + hueShift * 0.01) * 0.25)
        const glow = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius * 6)
        glow.addColorStop(0, 'rgba(255,255,255,0.95)')
        glow.addColorStop(0.3, palette.glow)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        context.fillStyle = glow
        context.arc(particle.x, particle.y, radius * 3.4, 0, Math.PI * 2)
        context.fill()
      }
      context.restore()

      context.save()
      context.globalAlpha = 0.16
      context.fillStyle = palette.ink
      context.fillRect(0, 0, state.width, state.height)
      context.restore()

      raf = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [activeIndex, palette.glow, palette.glowAlt, palette.ink])

  return <canvas ref={ref} className="menu-atmosphere" aria-hidden="true" />
}
