'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('film_actors', {
      actor_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'actors',
          key: 'actor_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      film_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'films',
          key: 'film_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for foreign keys
    await queryInterface.addIndex('film_actors', ['actor_id']);
    await queryInterface.addIndex('film_actors', ['film_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('film_actors');
  }
};
