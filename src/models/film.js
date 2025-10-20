'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Language, {
        foreignKey: 'languageId',
        as: 'language'
      });
      this.belongsTo(models.Language, {
        foreignKey: 'originalLanguageId',
        as: 'originalLanguage'
      });
      this.belongsToMany(models.Actor, {
        through: models.FilmActor,
        foreignKey: 'filmId',
        otherKey: 'actorId',
        as: 'actors'
      });
      this.belongsToMany(models.Category, {
        through: models.FilmCategory,
        foreignKey: 'filmId',
        otherKey: 'categoryId',
        as: 'categories'
      });
    }
  }
  Film.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'film_id'
    },
    title: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    originalLanguageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rentalDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    rentalRate: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 4.99,
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    replacementCost: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 19.99,
    },
    rating: {
      type: DataTypes.ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
      allowNull: true,
    },
    specialFeatures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Film',
    tableName: 'films',
  });
  return Film;
};