export interface Config {
  db: {
    storage: string;
    logging?: boolean;
  };
  api: {
    port: number;
    accessTokenSecret?: string;
  };
}

export const config: Config = {
  db: {
    storage: process.env.SQLITE_FILE ?? (process.env.NODE_ENV === 'test' ? ':memory:' : 'data/database.sqlite'),
    logging: false,
  },
  api: {
    port: Number(process.env.PORT) || 8000,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'dev-secret',
  },
};

export default config;
