/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare interface ImportMetaEnv {
  readonly VITE_LEADERBOARD_ENDPOINT?: string
  readonly VITE_SITE_URL?: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
