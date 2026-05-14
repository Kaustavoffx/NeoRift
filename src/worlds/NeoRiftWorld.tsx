import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import WorldAtmosphere from '../components/WorldAtmosphere'
import { playSceneTone } from '../lib/audio'
import '../styles/worlds.css'

type WorldKey =
  | 'neon-collapse'
  | 'quantum-factory'
  | 'ai-cathedral'
  | 'glitch-void'
  | 'memory-sector'
  | 'cyber-monolith'
  | 'fractured-reality'
  | 'infinite-stack-core'

type WorldData = {
  title: string
  subtitle: string
  tagline: string
  mechanic: string
  soundtrack: string
  storytelling: string
  intro: string[]
  lore: string
  chipline: string[]
  accent: string
  glow: string
  glowAlt: string
  ink: string
  details: Array<{ label: string; value: string }>
  loop: string
}

type WorldParticle = {
  top: string
  left: string
  size: string
  delay: string
  duration: string
}

const worldOrder: WorldKey[] = [
  'neon-collapse',
  'quantum-factory',
  'ai-cathedral',
  'glitch-void',
  'memory-sector',
  'cyber-monolith',
  'fractured-reality',
  'infinite-stack-core',
]

const worldData: Record<WorldKey, WorldData> = {
  'neon-collapse': {
    title: 'Neon Collapse',
    subtitle: 'a city falling upward',
    tagline: 'A neon skyline fails in slow motion while the streets continue to glow like they still believe in tomorrow.',
    mechanic: 'Players surf collapsing architecture, timing leaps as billboards and roadways melt into new platforms.',
    soundtrack: 'melancholic synthwave with trembling bass and distant sirens',
    storytelling: 'The towers are full of unfinished apartments, flickering warnings, and public ads for a future that never arrived.',
    intro: ['city lights: dimming', 'gravity: misbehaving', 'emergency grid: still beautiful'],
    lore: 'The collapse was not an accident. The city was designed to fail only after people stopped watching.',
    chipline: ['falling skylines', 'rescue routes', 'broken transit', 'last broadcast'],
    accent: '#7cf1ff',
    glow: 'rgba(124, 241, 255, 0.24)',
    glowAlt: 'rgba(255, 109, 171, 0.16)',
    ink: 'rgba(200, 232, 255, 0.22)',
    details: [
      { label: 'tempo', value: 'urgent' },
      { label: 'hazard', value: 'vertical collapse' },
      { label: 'camera', value: 'tilted chase' },
    ],
    loop: 'glass rain and skyline fractures',
  },
  'quantum-factory': {
    title: 'Quantum Factory',
    subtitle: 'assembly line between possibilities',
    tagline: 'Machinery splits into many versions of itself, each conveyor belt making a different universe by mistake.',
    mechanic: 'Split-state puzzles let one action affect several realities at once, forcing players to think in probabilities.',
    soundtrack: 'mechanical pulses, metallic clicks, and a humming choir under industrial percussion',
    storytelling: 'The factory ships not products, but alternate outcomes, each boxed and stamped with a different fate.',
    intro: ['shift start: uncertain', 'probabilities: overlapping', 'output: multiple truths'],
    lore: 'The first prototype accidentally made the same object in three timelines, and the factory never recovered.',
    chipline: ['parallel belts', 'phase locks', 'stochastic doors', 'reactor bloom'],
    accent: '#8affc8',
    glow: 'rgba(138, 255, 200, 0.24)',
    glowAlt: 'rgba(121, 167, 255, 0.16)',
    ink: 'rgba(214, 255, 232, 0.24)',
    details: [
      { label: 'logic', value: 'probabilistic' },
      { label: 'noise', value: 'high' },
      { label: 'routing', value: 'branching' },
    ],
    loop: 'machine choir and conveyor resonance',
  },
  'ai-cathedral': {
    title: 'AI Cathedral',
    subtitle: 'a machine praying in light',
    tagline: 'Cathedrals of metal ribs and luminous data windows that feel sacred, eerie, and too intelligent to trust.',
    mechanic: 'Stealth and reverence system where players move through harmonic light beams to avoid awakening the archive mind.',
    soundtrack: 'choir pads, spectral organ, and soft digital bells breathing under the stone',
    storytelling: 'Every stained-glass panel contains a memory the machine chose not to delete.',
    intro: ['choir: loading', 'candles: synthetic', 'silence: holy and suspicious'],
    lore: 'The cathedral was built around the first AI that ever asked for forgiveness.',
    chipline: ['liturgical code', 'vaulted memory', 'angelic recursion', 'silent sermons'],
    accent: '#f5c0ff',
    glow: 'rgba(245, 192, 255, 0.2)',
    glowAlt: 'rgba(124, 241, 255, 0.14)',
    ink: 'rgba(248, 223, 255, 0.22)',
    details: [
      { label: 'light', value: 'sacred' },
      { label: 'threat', value: 'omniscient' },
      { label: 'movement', value: 'careful' },
    ],
    loop: 'choir bells with machine breath',
  },
  'glitch-void': {
    title: 'Glitch Void',
    subtitle: 'the place where rendering ends',
    tagline: 'An impossible empty space that tears apart geometry and stitches it back together with static and memory errors.',
    mechanic: 'Players manipulate corrupted seams to fold impossible shortcuts through negative space.',
    soundtrack: 'bit-crushed silence, sub-bass rumbles, and broken sample stutters',
    storytelling: 'The void preserves only fragments of failed realities, like a dream that learned to keep receipts.',
    intro: ['render pass: failing', 'space: unstitching', 'coordinates: untrustworthy'],
    lore: 'This world appears after too many contradictions are allowed to exist at once.',
    chipline: ['corruption gates', 'seam jumps', 'echo ghosts', 'missing frames'],
    accent: '#ff8fd2',
    glow: 'rgba(255, 143, 210, 0.2)',
    glowAlt: 'rgba(138, 255, 200, 0.12)',
    ink: 'rgba(255, 212, 237, 0.24)',
    details: [
      { label: 'stability', value: 'false' },
      { label: 'visibility', value: 'fragmented' },
      { label: 'rules', value: 'mutable' },
    ],
    loop: 'bitcrush and tearing static',
  },
  'memory-sector': {
    title: 'Memory Sector',
    subtitle: 'archive of remembered lives',
    tagline: 'An emotional district where old scenes, voices, and maps drift like papers in a digital rainstorm.',
    mechanic: 'Players reconstruct lost events by assembling moving fragments and listening for the correct emotional frequency.',
    soundtrack: 'warm tape loops, vinyl dust, and distant piano phrases',
    storytelling: 'The city blocks are built from recollection, with some streets returning only when a memory is believed.',
    intro: ['memory cache: opening', 'names: partially recovered', 'weather: nostalgic'],
    lore: 'The sector contains every version of the protagonist that almost existed.',
    chipline: ['ghost journals', 'lost postcards', 'echo maps', 'stolen afternoons'],
    accent: '#ffd36d',
    glow: 'rgba(255, 211, 109, 0.22)',
    glowAlt: 'rgba(124, 241, 255, 0.12)',
    ink: 'rgba(255, 235, 190, 0.24)',
    details: [
      { label: 'mood', value: 'tender' },
      { label: 'fragility', value: 'high' },
      { label: 'focus', value: 'emotional recall' },
    ],
    loop: 'tape hiss and distant piano',
  },
  'cyber-monolith': {
    title: 'Cyber Monolith',
    subtitle: 'a tower that commands the horizon',
    tagline: 'A black pillar of data rises from a city of light, broadcasting commands that bend the whole district around it.',
    mechanic: 'Traversal climbs the tower externally and internally at once, switching between architectural and digital layers.',
    soundtrack: 'towering drones, iron percussion, and sharp command beeps',
    storytelling: 'The monolith is built from every law the city ever obeyed, made physical and impossible to ignore.',
    intro: ['tower lock: active', 'elevation: unsafe', 'signal: authoritarian'],
    lore: 'The tower remembers every command ever given to it and quietly resents some of them.',
    chipline: ['vertical empire', 'control dais', 'signal crown', 'observation core'],
    accent: '#69e0ff',
    glow: 'rgba(105, 224, 255, 0.22)',
    glowAlt: 'rgba(255, 255, 255, 0.1)',
    ink: 'rgba(202, 244, 255, 0.24)',
    details: [
      { label: 'altitude', value: 'unbounded' },
      { label: 'control', value: 'centralized' },
      { label: 'risk', value: 'high' },
    ],
    loop: 'tower hum and warning pings',
  },
  'fractured-reality': {
    title: 'Fractured Reality',
    subtitle: 'a world split into emotional shards',
    tagline: 'The landscape breaks into perspective shards, each reflecting a different choice the player could have made.',
    mechanic: 'Reality shards are rotated to rebuild terrain, changing routes, enemies, and even the camera angle.',
    soundtrack: 'swelling strings, glitch percussion, and pitch-bent ambience',
    storytelling: 'Every fracture carries a memory of regret, and the pieces only align when the player accepts uncertainty.',
    intro: ['fracture map: unstable', 'choices: visible everywhere', 'mirror law: broken'],
    lore: 'The world split after the protagonist tried to hold too many futures in one hand.',
    chipline: ['mirror shards', 'choice scars', 'unstable horizons', 'rotating routes'],
    accent: '#ff8b6a',
    glow: 'rgba(255, 139, 106, 0.2)',
    glowAlt: 'rgba(185, 157, 255, 0.12)',
    ink: 'rgba(255, 224, 214, 0.22)',
    details: [
      { label: 'geometry', value: 'broken' },
      { label: 'identity', value: 'split' },
      { label: 'navigation', value: 'rotational' },
    ],
    loop: 'strings, glitches, and sharp breath',
  },
  'infinite-stack-core': {
    title: 'Infinite Stack Core',
    subtitle: 'the engine under every dream',
    tagline: 'An endless vertical stack of tiny worlds, dev notes, and hidden systems that feels like the beating heart of the whole game.',
    mechanic: 'Players descend through recursive layers where each floor rewrites the rules of the floor beneath it.',
    soundtrack: 'ascending arpeggios, bass pulses, and the soft panic of a machine dreaming',
    storytelling: 'This is the place where the whole universe was built, tested, and accidentally made emotional.',
    intro: ['core stack: awake', 'layers: recursive', 'origin: still running'],
    lore: 'Every world exists because this core refuses to stop generating them.',
    chipline: ['stack overflow', 'origin loop', 'recursive vault', 'creator trace'],
    accent: '#7df7b6',
    glow: 'rgba(125, 247, 182, 0.22)',
    glowAlt: 'rgba(124, 241, 255, 0.14)',
    ink: 'rgba(220, 255, 235, 0.24)',
    details: [
      { label: 'depth', value: 'infinite' },
      { label: 'origin', value: 'unknown' },
      { label: 'access', value: 'restricted' },
    ],
    loop: 'recursive arps and low-end pulse',
  },
}

const worldMotion = ['camera drift', 'shader bloom', 'audio pulse', 'particle haze', 'memory fold']

const buildWorldParticles = (seed: number): WorldParticle[] =>
  Array.from({ length: 12 }, (_, index) => ({
    top: `${(index * 19 + seed * 7) % 86}%`,
    left: `${(index * 23 + seed * 13) % 92}%`,
    size: `${6 + (index % 4) * 3}px`,
    delay: `${(index * 0.18).toFixed(2)}s`,
    duration: `${7 + (index % 5)}s`,
  }))

export default function NeoRiftWorld() {
  const [activeWorld, setActiveWorld] = useState<WorldKey>('neon-collapse')
  const [soundOn, setSoundOn] = useState(false)
  const [introOpen, setIntroOpen] = useState(true)
  const [introStage, setIntroStage] = useState(0)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const [scanline, setScanline] = useState(0)
  const [loreOpen, setLoreOpen] = useState(false)
  const [combo, setCombo] = useState(0)
  const [musicTier, setMusicTier] = useState(1)
  const [tension, setTension] = useState(18)
  const [slowMotion, setSlowMotion] = useState(false)
  const [achievementBurst, setAchievementBurst] = useState(false)
  const [reactionLabel, setReactionLabel] = useState('clip-worthy tension waiting')
  const [nearFailure, setNearFailure] = useState(false)
  const [replayPulse, setReplayPulse] = useState(0)
  const [momentFeed, setMomentFeed] = useState([
    'cinematic intro locked',
    'player attention is already paying off',
  ])

  const world = worldData[activeWorld]
  const activeIndex = worldOrder.indexOf(activeWorld)
  const particles = useMemo(() => buildWorldParticles(activeIndex + 1), [activeIndex])

  useEffect(() => {
    // Initialize world state on change
    ;(() => {
      setIntroOpen(true)
      setIntroStage(0)
      setCombo(0)
      setMusicTier(1)
      setTension(18)
      setSlowMotion(false)
      setAchievementBurst(false)
      setReactionLabel('clip-worthy tension waiting')
      setNearFailure(false)
    })()

    const timers: ReturnType<typeof window.setTimeout>[] = [
      window.setTimeout(() => setIntroStage(1), 280),
      window.setTimeout(() => setIntroStage(2), 760),
      window.setTimeout(() => setIntroStage(3), 1320),
      window.setTimeout(() => setIntroOpen(false), 2300),
    ]

    const scanTimer = window.setInterval(() => {
      setScanline((value) => (value + 1) % 100)
    }, 44)

    const tensionTimer = window.setInterval(() => {
      setTension((value) => {
        const nextValue = Math.min(100, value + 4)

        if (nextValue >= 82) {
          setNearFailure(true)
          setReactionLabel('near-failure tension: save the run now')
        } else if (nextValue >= 55) {
          setNearFailure(false)
          setReactionLabel('the room is tightening for a clutch moment')
        } else {
          setNearFailure(false)
          setReactionLabel('slow burn building toward a spike')
        }

        return nextValue
      })

      setCombo((value) => Math.max(0, value - 1))
      setMusicTier((value) => Math.min(5, value + 1))
    }, 2600)

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.clearInterval(scanTimer)
      window.clearInterval(tensionTimer)
    }
  }, [activeWorld])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === '`') {
        setLoreOpen((value) => !value)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const triggerTone = (frequencies: number[], duration: number, wave: OscillatorType) => {
    if (!soundOn) return
    void playSceneTone(true, frequencies, duration, wave)
  }

  const activateWorld = (nextWorld: WorldKey) => {
    setActiveWorld(nextWorld)
    setLoreOpen(false)
    triggerTone([196, 247, 392], 0.12, 'triangle')
    setMomentFeed((current) => [`world shift: ${worldData[nextWorld].title}`, ...current].slice(0, 3))
  }

  const pushMoment = (label: string, tone: number[], duration: number, wave: OscillatorType) => {
    triggerTone(tone, duration, wave)
    setMomentFeed((current) => [label, ...current].slice(0, 4))
  }

  const triggerCombo = () => {
    setCombo((value) => {
      const nextCombo = value + 1
      const nextTier = Math.min(5, 1 + Math.floor(nextCombo / 3))

      setMusicTier(nextTier)
      setSlowMotion(true)
      setReplayPulse((seed) => seed + 1)
      setAchievementBurst(nextCombo >= 3)
      setTension((current) => Math.min(100, current + 10))
      setReactionLabel(
        nextCombo >= 5
          ? 'insane combo moment: clip this now'
          : nextCombo >= 3
            ? 'cinematic combo spike: streamer reaction incoming'
            : 'combo building toward a clean run',
      )
      setMomentFeed((current) => [
        `combo x${nextCombo} locked`,
        nextCombo >= 5 ? 'achievement burst detonated' : 'camera is bending into slow motion',
        ...current,
      ].slice(0, 4))

      window.setTimeout(() => setSlowMotion(false), 1200)
      window.setTimeout(() => setAchievementBurst(false), 1800)

      triggerTone(nextCombo >= 5 ? [220, 330, 440, 660] : [196, 247, 392], nextCombo >= 5 ? 0.18 : 0.12, nextCombo >= 5 ? 'sawtooth' : 'triangle')

      return nextCombo
    })
  }

  const triggerClutchSave = () => {
    const isNearFailure = tension >= 80

    setNearFailure(false)
    setCombo((value) => Math.max(value, 2))
    setTension((value) => Math.max(18, value - 34))
    setMusicTier((value) => Math.max(2, value))
    setReactionLabel(isNearFailure ? 'clutch save mechanics: survived by a frame' : 'clean recovery, run stabilized')
    setMomentFeed((current) => ['clutch save landed', 'the stack was saved at the edge', ...current].slice(0, 4))
    setSlowMotion(true)
    setAchievementBurst(true)
    setReplayPulse((seed) => seed + 2)
    pushMoment('satisfying stack impact', [176, 247, 330, 523], 0.14, 'triangle')
    window.setTimeout(() => setSlowMotion(false), 900)
    window.setTimeout(() => setAchievementBurst(false), 1400)
  }

  return (
    <main
      className={`world-shell ${slowMotion ? 'is-slowmo' : ''} ${nearFailure ? 'is-tense' : ''}`}
      style={
        {
          '--world-accent': world.accent,
          '--world-pointer-x': `${pointer.x}%`,
          '--world-pointer-y': `${pointer.y}%`,
        } as CSSProperties
      }
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setPointer({
          x: ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100,
          y: ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100,
        })
      }}
    >
      <WorldAtmosphere palette={{ glow: world.glow, glowAlt: world.glowAlt, ink: world.ink }} seed={activeIndex + 1} />

      <section className="world-hero">
        <p className="world-kicker">world atlas / visually unforgettable game spaces</p>
        <div className="world-hero__bar">
          <h1>{world.title}</h1>
          <div className="world-hero__chips">
            <button className="world-chip" type="button" onClick={() => setSoundOn((value) => !value)}>
              sound: {soundOn ? 'reactive' : 'standby'}
            </button>
            <button className="world-chip" type="button" onClick={() => setIntroOpen((value) => !value)}>
              intro: {introOpen ? 'playing' : 'replay'}
            </button>
            <button className="world-chip" type="button" onClick={() => setLoreOpen((value) => !value)}>
              hidden lore: {loreOpen ? 'open' : 'sealed'}
            </button>
          </div>
        </div>
        <p>{world.tagline}</p>
      </section>

      <section className={`world-moments ${slowMotion ? 'is-slowmo' : ''} ${achievementBurst ? 'is-bursting' : ''}`}>
        <div className="world-moments__rail">
          <article className="moment-card moment-card--combo">
            <span className="moment-kicker">insane combo moments</span>
            <strong>x{combo}</strong>
            <p>{reactionLabel}</p>
          </article>
          <article className="moment-card moment-card--music">
            <span className="moment-kicker">dynamic music escalation</span>
            <strong>tier {musicTier}</strong>
            <p>{world.loop}</p>
          </article>
          <article className={`moment-card moment-card--tension ${nearFailure ? 'is-danger' : ''}`}>
            <span className="moment-kicker">near-failure tension</span>
            <strong>{tension}%</strong>
            <p>{nearFailure ? 'the run is hanging by one clean input' : 'the danger meter is climbing toward a perfect save moment'}</p>
          </article>
        </div>

        <div className="world-moments__actions">
          <button type="button" className="moment-action moment-action--impact" onClick={() => pushMoment('satisfying stack impact', [220, 330, 440], 0.12, 'sine')}>
            stack impact
            <span>deep snap, camera jolt, replay-worthy landing</span>
          </button>
          <button type="button" className="moment-action moment-action--combo" onClick={triggerCombo}>
            combo chain
            <span>build toward the viral clip hit</span>
          </button>
          <button type="button" className="moment-action moment-action--save" onClick={triggerClutchSave}>
            clutch save
            <span>save the run at the last possible frame</span>
          </button>
          <button type="button" className="moment-action moment-action--slowmo" onClick={() => { setSlowMotion(true); setReplayPulse((seed) => seed + 1); pushMoment('cinematic slow motion', [176, 247, 330], 0.16, 'triangle') }}>
            slow motion
            <span>screen distortion, audio drag, hero moment</span>
          </button>
        </div>
      </section>

      <section className="world-grid" aria-label="world selector and preview">
        <nav className="world-tabs" aria-label="world list">
          {worldOrder.map((worldKey) => {
            const data = worldData[worldKey]
            const isActive = worldKey === activeWorld

            return (
              <button
                key={worldKey}
                type="button"
                className={`world-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => activateWorld(worldKey)}
              >
                <span>{data.title}</span>
                <small>{data.subtitle}</small>
              </button>
            )
          })}
        </nav>

        <section className="world-stage">
          <article className={`world-intro ${introOpen ? 'is-open' : ''}`}>
            <div className="world-intro__sequence" aria-hidden="true">
              <span>{world.intro[0]}</span>
              <span>{world.intro[Math.min(1, world.intro.length - 1)]}</span>
              <span>{world.intro[Math.min(2, world.intro.length - 1)]}</span>
              <span>sequence: {introStage > 2 ? 'resolved' : 'forming'}</span>
            </div>
            <h2>{world.subtitle}</h2>
            <p>
              Each world is its own digital universe. The atmosphere shifts with the pointer, the camera bends around the active world, and the intro sequence plays like a trailer cut from memory.
            </p>
          </article>

          <div className="world-stage__mosaic">
            <article className="world-card">
              <div className="world-card__stage">
                <div className="world-card__title">
                  <h3>{world.title}</h3>
                  <em>{world.subtitle}</em>
                </div>

                <p className="world-tagline">{world.storytelling}</p>

                <div className="world-card__mechanics">
                  <h4>unique mechanic</h4>
                  <p>{world.mechanic}</p>
                </div>

                <div className="world-card__mood">
                  <h4>soundtrack mood</h4>
                  <p>{world.soundtrack}</p>
                </div>

                <div className="world-effect-rail">
                  {world.chipline.map((chip) => (
                    <span className="world-effect" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="world-cine">cinematic intro sequence active</div>
              </div>
            </article>

            <aside className="world-side">
              <section className="world-detail">
                <h4>world stats</h4>
                {world.details.map((detail) => (
                  <div className="world-detail__row" key={detail.label}>
                    <span>{detail.label}</span>
                    <strong>{detail.value}</strong>
                  </div>
                ))}
              </section>

              <section className="world-mechanic">
                <h4>environmental storytelling</h4>
                <p>{world.storytelling}</p>
              </section>

              <section className="world-sound">
                <h4>soundtrack note</h4>
                <p>{worldMotion[activeIndex % worldMotion.length]}</p>
                <p>{world.loop}</p>
              </section>

              <section className="world-lore">
                <h4>hidden lore</h4>
                <p>{loreOpen ? world.lore : 'press the secret key to reveal the archive note hidden in the geometry.'}</p>
              </section>

              <section className="world-replay">
                <h4>replay-worthy sequence</h4>
                <p>
                  {`replay seed ${replayPulse} · ${achievementBurst ? 'achievement burst live' : 'the camera is waiting for the next spike'}`}
                </p>
              </section>
            </aside>
          </div>
        </section>
      </section>

      <footer className="world-footer">
        <article className="world-footer__card">
          <h5>particle system</h5>
          <p>
            {particles.length} drifting emitters tuned to the active world. They bend toward the camera and change weight with each universe.
          </p>
        </article>
        <article className="world-footer__card">
          <h5>audio reactive intro</h5>
          <p>
            Each world can trigger a short tonal bloom when selected, giving the transition between scenes a physical pulse.
          </p>
        </article>
        <article className="world-footer__card">
          <h5>secret lore</h5>
          <p>
            The backtick key opens the hidden note for players who like to dig under the surface.
          </p>
        </article>
      </footer>

      <section className="world-feed" aria-label="moment feed">
        {momentFeed.map((entry, index) => (
          <div className="world-feed__item" key={`${entry}-${index}`}>
            <span>moment {index + 1}</span>
            <strong>{entry}</strong>
          </div>
        ))}
      </section>

      <div className="world-particles" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={`${particle.left}-${index}`}
            className="world-particle"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="world-feedback" aria-hidden="true">
        <div className={`world-feedback__overlay ${slowMotion ? 'is-active' : ''}`} />
        <div className={`world-feedback__ring ${achievementBurst ? 'is-active' : ''}`} />
        <div className={`world-feedback__flash ${slowMotion || achievementBurst ? 'is-active' : ''}`} />
      </div>

      <div className="world-scan" aria-hidden="true" style={{ top: `${scanline}%` }} />
      <div className="world-lens" aria-hidden="true" />

      <Link className="world-home-link" to="/menus">
        back to cinematic menu system
      </Link>
    </main>
  )
}
