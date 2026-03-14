import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';
import knexInit from 'knex';
import Sequelize from 'sequelize';

export const knex = knexInit({
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    },
});

mkdirp.sync('var/db');
export const sqlite = new sqlite3.Database('var/db/todos.db');

export const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, 
    process.env.MYSQL_USER, 
    process.env.MYSQL_PASSWORD, 
    {
        dialect: 'mysql',
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
    }
);
