import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number }

export default function LandingParticles() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const el = canvas as HTMLCanvasElement
    const ctx = el.getContext('2d')!
    let w = (el.width = el.clientWidth)
    let h = (el.height = el.clientHeight)

    let particles: Particle[] = []
    const create = (n = 40) => {
      particles = Array.from({ length: n }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.6 - 0.1,
        r: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.6 + 0.2,
      }))
    }

    create(60)

    let mouseX = -9999
    let mouseY = -9999

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    function onLeave() {
      mouseX = -9999
      mouseY = -9999
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)

    let raf = 0
    function loop() {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        if (mouseX > -9998) {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const d = Math.max(20, Math.hypot(dx, dy))
          p.vx += (dx / d) * 0.02
          p.vy += (dy / d) * 0.02
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        p.alpha *= 0.999

        ctx.beginPath()
        ctx.globalAlpha = p.alpha * 0.9
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
        g.addColorStop(0, 'rgba(255,255,255,0.9)')
        g.addColorStop(1, 'rgba(120,90,255,0)')
        ctx.fillStyle = g
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fill()

        if (p.y < -20 || p.x < -50 || p.x > w + 50) {
          p.x = Math.random() * w
          p.y = h + Math.random() * 40
          p.vx = (Math.random() - 0.5) * 0.3
          p.vy = -Math.random() * 0.6 - 0.1
          p.r = Math.random() * 1.8 + 0.6
          p.alpha = Math.random() * 0.6 + 0.2
        }
      }

      // subtle vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h))
      vg.addColorStop(0, 'rgba(255,255,255,0.02)')
      vg.addColorStop(1, 'rgba(0,0,0,0.12)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)

      raf = requestAnimationFrame(loop)
    }

    function onResize() {
      w = el.width = el.clientWidth
      h = el.height = el.clientHeight
      create(Math.max(30, Math.floor((w * h) / 80000)))
    }
    window.addEventListener('resize', onResize)

    loop()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="landing-particles"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    />
  )
}
