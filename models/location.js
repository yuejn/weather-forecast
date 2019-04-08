'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.FLOAT
    },
    longitude: {
      type: DataTypes.FLOAT
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['city', 'country']
      },
      {
        method: 'BTREE',
        fields: ['timezone']
      }
    ]
  });
  Location.associate = models => {
    Location.hasMany(models.DayForecast);
  };
  return Location;
};
