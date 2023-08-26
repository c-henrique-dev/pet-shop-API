const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Pet = db.define('Pet', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
  },
  user: {
    type: DataTypes.JSONB,
  },
  adopter: {
    type: DataTypes.JSONB,
  },
})

module.exports = Pet;
