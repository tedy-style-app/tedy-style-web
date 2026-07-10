/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin for local dev (e.g. https://sevil.app). Empty in prod. */
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
