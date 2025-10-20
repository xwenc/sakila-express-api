'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Film, {
        through: models.FilmActor,
        foreignKey: 'actorId',
        otherKey: 'filmId',
        as: 'films'
      });
    }
  }
  Actor.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'actor_id'
    },
    firstName: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Actor',
    tableName: 'actors',
  });
  return Actor;
};