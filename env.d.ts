/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string; // sua var de ambiente usada em src/services/api.ts
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
