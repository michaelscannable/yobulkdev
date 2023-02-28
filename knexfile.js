// Update with your config settings.
// development: {
//   client: 'sqlite3',
//   connection: {
//     filename: './dev.sqlite3'
//   }
// },
/**
 * @type { Object.<string, import('knex').Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    // debug: true,
    connection: process.env.PG_CONNECTION_STRING || 'postgresql://scannableDB:scannableDB123@localhost:5432/import',
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: process.env.DB_CLIENT,
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
