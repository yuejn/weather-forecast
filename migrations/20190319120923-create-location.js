module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING
      },
      timezone: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => queryInterface.addConstraint('Locations', ['city', 'country'], { type: 'unique' }))
      .then(() => queryInterface.addIndex('Locations', ['timezone']))
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Locations')
  }
}
