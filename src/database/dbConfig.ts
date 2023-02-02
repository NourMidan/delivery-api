interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  // ssl: boolean;
  synchronize: boolean;
  // logging: boolean;
}

export { DatabaseConfig };
