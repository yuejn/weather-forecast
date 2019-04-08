require('dotenv').config();
module.exports = {
  "development": {
      "username": "postgres",
      "password": null,
      "database": "weather_development",
      "host": "db",
      "dialect": "postgres"
  },
  "test": {
      "username": "postgres",
      "password": null,
      "database": "weather_test",
      "host": "db",
      "dialect": "postgres"
  },
  "production": {
      "username": process.env.POSTGRES_USERNAME,
      "password": process.env.POSTGRES_PASSWORD,
      "database": process.env.POSTGRES_DATABASE,
      "host": process.env.POSTGRES_HOST,
      "dialect": "postgres"
  },
};
