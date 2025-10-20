'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Film, {
        foreignKey: 'languageId',
        as: 'films'
      });
      this.hasMany(models.Film, {
        foreignKey: 'originalLanguageId',
        as: 'originalFilms'
      });
    }
  }
  Language.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'language_id'
    },
    name: {
      type: DataTypes.CHAR(20),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Language',
    tableName: 'languages',
  });
  return Language;
};