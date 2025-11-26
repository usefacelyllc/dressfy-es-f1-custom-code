/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECURLY_PUBLIC_KEY: string;
  // Adicione outras variáveis de ambiente VITE aqui conforme necessário
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

