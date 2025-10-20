"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FilmActor extends Model {
    static associate(models) {
      // 定义关联关系
      // FilmActor 关联到 Film
      FilmActor.belongsTo(models.Film, {
        foreignKey: "filmId",
        as: "film",
      });

      // FilmActor 关联到 Actor
      FilmActor.belongsTo(models.Actor, {
        foreignKey: "actorId",
        as: "actor",
      });
    }
  }

  FilmActor.init(
    {
      actorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: "actor_id",
        references: {
          model: "actors", //引用目标表名
          key: "actor_id", //引用目标字段名
        },
      },
      filmId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: "film_id",
        references: {
          model: "films",
          key: "film_id",
        },
      },
    },
    {
      sequelize,
      modelName: "FilmActor",
      tableName: "film_actors",
    }
  );

  return FilmActor;
};
