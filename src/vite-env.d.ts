/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin for local dev (e.g. https://tedy.nashir.uz). Empty in prod. */
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
