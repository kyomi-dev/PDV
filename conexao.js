require('dotenv').config();

let { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;
const DATABASE_URL = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}/${PG_DATABASE}?sslmode=require`


const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: DATABASE_URL,
        host: PG_HOST,
        port: PG_PORT,
        user: PG_USER,
        database: PG_DATABASE,
        password: PG_PASSWORD,
    }
});


module.exports = knex;