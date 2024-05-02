declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      MONGODB_URI: string;
      MONGODB_USERNAME: string;
      MONGODB_PASSWORD: string;
    }
  }
}

export {};
