
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Item',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING(255),
      },
      first_name: {
        type: DataTypes.STRING(255),
      },
      last_name: {
        type: DataTypes.STRING(255),
      },
      nationality: {
        type: DataTypes.STRING(255),
      },
      link: {
        type: DataTypes.STRING(255),
      },
      source: {
        type: DataTypes.STRING(255),
      },
    },
    {
    }
  );
};
