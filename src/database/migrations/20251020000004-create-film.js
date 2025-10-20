'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('films', {
      film_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      release_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      language_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'languages',
          key: 'language_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION',
      },
      original_language_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'languages',
          key: 'language_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      rental_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      rental_rate: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 4.99,
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      replacement_cost: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 19.99,
      },
      rating: {
        type: Sequelize.ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
        allowNull: true,
      },
      special_features: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
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

    // Add indexes
    await queryInterface.addIndex('films', ['language_id']);
    await queryInterface.addIndex('films', ['original_language_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('films');
  }
};
