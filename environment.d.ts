declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      MONGODB_URI: string;
      MONGODB_USERNAME: string;
      MONGODB_PASSWORD: string;
      MONGODB_TEST_URI: string;
      MONGODB_TEST_USERNAME: string;
      MONGODB_TEST_PASSWORD: string;
      NODE_ENV: string;
    }
  }
}

export {};
