import { useMemo, useState, type CSSProperties } from 'react'
import MenuAtmosphere from '../components/MenuAtmosphere'
import '../styles/menus.css'

type MenuKey =
  | 'main-menu'
  | 'world-selection'
  | 'level-select'
  | 'achievements'
  | 'skill-tree'
  | 'inventory'
  | 'settings'
  | 'multiplayer-lobby'
  | 'story-archive'

type MenuTheme = {
  title: string
  subtitle: string
  accent: string
  veil: string
  ink: string
  summary: string
  chips: string[]
  details: Array<{ label: string; value: string }>
  body: string
}

const menuOrder: MenuKey[] = [
  'main-menu',
  'world-selection',
  'level-select',
  'achievements',
  'skill-tree',
  'inventory',
  'settings',
  'multiplayer-lobby',
  'story-archive',
]

const menuThemes: Record<MenuKey, MenuTheme> = {
  'main-menu': {
    title: 'Main Menu',
    subtitle: 'boot channel / cinematic entrypoint',
    accent: '#7cf1ff',
    veil: 'rgba(62, 129, 255, 0.2)',
    ink: 'rgba(196, 231, 255, 0.22)',
    summary: 'The first screen feels like the gate before a secret operating system wakes up.',
    chips: ['launch world', 'resume story', 'system pulse', 'late-night build'],
    details: [
      { label: 'state', value: 'ready' },
      { label: 'signal', value: 'stable' },
      { label: 'boot', value: '22:41' },
    ],
    body: 'A brutalist launch slab with a single oversized action, auxiliary systems tucked off-axis, and the feeling that the whole universe is one click away from ignition.',
  },
  'world-selection': {
    title: 'World Selection',
    subtitle: 'camera orbit / destination atlas',
    accent: '#ff8fd2',
    veil: 'rgba(255, 98, 165, 0.18)',
    ink: 'rgba(255, 212, 237, 0.22)',
    summary: 'Each world is framed like a separate digital moon, with tiny weather systems and different rules of gravity.',
    chips: ['storm vault', 'subway reef', 'mirror desert', 'sky vault'],
    details: [
      { label: 'worlds', value: '04 unlocked' },
      { label: 'gravity', value: 'variable' },
      { label: 'camera', value: 'orbital' },
    ],
    body: 'Cards float at uneven depths, with one oversized destination slanting forward while others recede into the fog like unfinished dreams.',
  },
  'level-select': {
    title: 'Level Select',
    subtitle: 'path lattice / mission stack',
    accent: '#8affc8',
    veil: 'rgba(92, 255, 170, 0.15)',
    ink: 'rgba(216, 255, 232, 0.22)',
    summary: 'Levels are arranged like a hacked transit diagram, letting routes feel physical rather than menu-driven.',
    chips: ['node A12', 'node B03', 'node C09', 'checkpoint'],
    details: [
      { label: 'nodes', value: '12' },
      { label: 'clears', value: '07' },
      { label: 'bonus', value: '02 hidden' },
    ],
    body: 'The grid bends into a corridor map with one route always slightly broken, inviting the player to trust instinct over perfect order.',
  },
  achievements: {
    title: 'Achievements',
    subtitle: 'trophy archive / milestone fractures',
    accent: '#ffd36d',
    veil: 'rgba(255, 191, 77, 0.16)',
    ink: 'rgba(255, 235, 190, 0.24)',
    summary: 'Rewards look recovered from a busted museum vault, with shard-like panels and handwritten proof of obsession.',
    chips: ['prototype hero', 'sound engineer', 'night coder', 'ghost runner'],
    details: [
      { label: 'earned', value: '19' },
      { label: 'secret', value: '04' },
      { label: 'rare', value: '11%' },
    ],
    body: 'Not a clean list, but a collage of badges, scratches, and little triumphs that feels earned instead of systemically generated.',
  },
  'skill-tree': {
    title: 'Skill Tree',
    subtitle: 'ability bloom / branching circuit',
    accent: '#b59dff',
    veil: 'rgba(158, 120, 255, 0.18)',
    ink: 'rgba(226, 214, 255, 0.22)',
    summary: 'The skill tree spreads like circuitry through a cave wall, with branching routes that feel alive.',
    chips: ['dash weave', 'pulse shield', 'echo map', 'memory stitch'],
    details: [
      { label: 'points', value: '07' },
      { label: 'branches', value: '03' },
      { label: 'legend', value: 'unstable' },
    ],
    body: 'Nodes drift a little off-center, forcing the eye to move in arcs instead of neat columns.',
  },
  inventory: {
    title: 'Inventory',
    subtitle: 'artifact stack / tactile storage',
    accent: '#69e0ff',
    veil: 'rgba(77, 222, 255, 0.16)',
    ink: 'rgba(202, 244, 255, 0.24)',
    summary: 'Inventory becomes a physical desk of objects, notes, and strange kept things rather than a spreadsheet.',
    chips: ['broken compass', 'stolen key', 'drift lens', 'music chip'],
    details: [
      { label: 'slots', value: '24' },
      { label: 'favorites', value: '06' },
      { label: 'weight', value: 'light' },
    ],
    body: 'Some items are oversized, some compressed, and some half-hidden beneath other panels like real clutter from a real life project space.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'control room / friction tuning',
    accent: '#ff8b6a',
    veil: 'rgba(255, 137, 99, 0.14)',
    ink: 'rgba(255, 224, 214, 0.22)',
    summary: 'Settings should feel like adjusting a machine in motion, not filling out a form.',
    chips: ['motion', 'audio', 'camera', 'contrast'],
    details: [
      { label: 'latency', value: 'minimal' },
      { label: 'audio', value: 'reactive' },
      { label: 'shader', value: 'enabled' },
    ],
    body: 'A live console with toggles, meters, and tiny warnings that make the interface feel engineered by hand at 2 a.m.',
  },
  'multiplayer-lobby': {
    title: 'Multiplayer Lobby',
    subtitle: 'signal room / player constellation',
    accent: '#7df7b6',
    veil: 'rgba(83, 255, 170, 0.16)',
    ink: 'rgba(220, 255, 235, 0.23)',
    summary: 'The lobby is a noisy neon waiting room where people arrive as pulses, not rows.',
    chips: ['party open', 'voice link', 'ping: 27', 'host ready'],
    details: [
      { label: 'players', value: '04/08' },
      { label: 'ping', value: '27ms' },
      { label: 'mode', value: 'co-op' },
    ],
    body: 'The layout feels slightly unstable, with each player card floating at its own depth as if the room is still loading in real time.',
  },
  'story-archive': {
    title: 'Story Archive',
    subtitle: 'dossier vault / memory fragments',
    accent: '#f5c0ff',
    veil: 'rgba(236, 126, 255, 0.14)',
    ink: 'rgba(248, 223, 255, 0.22)',
    summary: 'The archive is a museum of lore pieces, developer notes, and quiet emotional residue.',
    chips: ['chapter 01', 'missing cutscene', 'creator note', 'old maps'],
    details: [
      { label: 'logs', value: '31' },
      { label: 'recovered', value: '12' },
      { label: 'mystery', value: 'high' },
    ],
    body: 'Paper edges, terminal blur, and half-buried annotations turn the story into an object you browse like a secret archive instead of a menu.',
  },
}

const menuMotion = [
  'camera drift',
  'shader sweep',
  'audio bloom',
  'panel morph',
  'signal bloom',
]

export default function MenuSystemRoute() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('main-menu')
  const [transitioning, setTransitioning] = useState(false)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })

  const activeTheme = menuThemes[activeMenu]
  const activeIndex = menuOrder.indexOf(activeMenu)

  const activePanel = useMemo(
    () => ({
      title: activeTheme.title,
      subtitle: activeTheme.subtitle,
      body: activeTheme.body,
    }),
    [activeTheme.body, activeTheme.subtitle, activeTheme.title],
  )

  return (
    <main
      className="menu-system-shell"
      style={
        {
          '--menu-accent': activeTheme.accent,
          '--menu-veil': activeTheme.veil,
          '--menu-ink': activeTheme.ink,
          '--menu-pointer-x': `${pointer.x}%`,
          '--menu-pointer-y': `${pointer.y}%`,
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
      <MenuAtmosphere
        activeIndex={activeIndex}
        palette={{ glow: activeTheme.accent, glowAlt: activeTheme.veil, ink: activeTheme.ink }}
      />
      <div className="menu-grid-overlay" aria-hidden="true" />

      <header className="menu-hero">
        <p className="menu-kicker">cinematic systems / digital universes</p>
        <h1>
          Entering <span>{activePanel.title}</span>
        </h1>
        <p className="menu-intro">
          {activeTheme.summary} The interface should feel like a hacked film set, a prototype UI, and a game engine dashboard all at once.
        </p>
      </header>

      <section className="menu-layout">
        <aside className="menu-rail" aria-label="Menu sections">
          {menuOrder.map((menu) => {
            const theme = menuThemes[menu]
            const isActive = menu === activeMenu

            return (
              <button
                key={menu}
                className={`menu-rail__item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setTransitioning(true)
                  setActiveMenu(menu)
                  window.setTimeout(() => setTransitioning(false), 380)
                }}
                type="button"
              >
                <span>{theme.title}</span>
                <small>{theme.subtitle}</small>
              </button>
            )
          })}
        </aside>

        <section className={`menu-stage ${transitioning ? 'is-transitioning' : ''}`}>
          <div className="menu-stage__camera">
            <div className="menu-stage__frame">
              <div className="menu-stage__topline">
                <span className="menu-pill">{activeTheme.subtitle}</span>
                <span className="menu-meter">audio reactive</span>
              </div>

              <div className="menu-stage__panel">
                <div className="menu-stage__main">
                  <p className="menu-label">system view</p>
                  <h2>{activePanel.title}</h2>
                  <p>{activePanel.body}</p>

                  <div className="menu-chips">
                    {activeTheme.chips.map((chip) => (
                      <span key={chip} className="menu-chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="menu-stage__side">
                  {activeTheme.details.map((detail, index) => (
                    <article className="menu-stat" key={detail.label} style={{ transform: `translateY(${index * 6}px)` }}>
                      <span>{detail.label}</span>
                      <strong>{detail.value}</strong>
                    </article>
                  ))}
                </div>
              </div>

              <div className="menu-stage__footer">
                {menuMotion.map((motion, index) => (
                  <span key={motion} style={{ animationDelay: `${index * 140}ms` }}>
                    {motion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
