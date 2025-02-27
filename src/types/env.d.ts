export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CINEBASE_DATABASE_URL: string;
    }
  }
}
