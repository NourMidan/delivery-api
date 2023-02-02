export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  database: {
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    synchronize: true,
  },
  testDB: {
    database: process.env.MYSQL_TEST_DATABASE,
    host: process.env.MYSQL_TEST_HOST,
    port: parseInt(process.env.MYSQL_TEST_PORT),
    username: 'root',
    password: process.env.MYSQL_TEST_PASSWORD,
    synchronize: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    salt: process.env.HASH_SALT,
  },
});
