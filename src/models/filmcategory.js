'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FilmCategory extends Model {
    static associate(models) {
      // 定义关联关系
      // FilmActor 关联到 Film
      FilmCategory.belongsTo(models.Film, {
        foreignKey: 'filmId',
        as: 'film'
      });

      // FilmActor 关联到 Actor
      FilmCategory.belongsTo(models.Category, {
        foreignKey: 'actorId',
        as: 'actor'
      });
    }
  }

  FilmCategory.init({
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'categories', //引用目标表名
        key: 'category_id' //引用目标字段名
      }
    },
    filmId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'film_id',
      references: {
        model: 'films',
        key: 'film_id'
      }
    },
  }, {
    sequelize,
    modelName: 'FilmCategory',
    tableName: 'film_categories',
  });

  return FilmCategory;
};