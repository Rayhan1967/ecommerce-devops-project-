// config/database.js
const { Sequelize } = require('sequelize');

// Use in-memory SQLite for testing
const sequelize = process.env.NODE_ENV === 'test' 
  ? new Sequelize('sqlite::memory:', { logging: false })
  : new Sequelize(
      process.env.POSTGRES_DB,
      process.env.POSTGRES_USER,
      process.env.POSTGRES_PASSWORD,
      {
        host: process.env.POSTGRES_HOST,
        dialect: 'postgres',
        logging: false
      }
    );

module.exports = sequelize;
