
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
      title: {
        type: DataTypes.STRING(255),
      },
      link: {
        type: DataTypes.STRING(255),
      },
      instagram: {
        type: DataTypes.STRING(255),
      },
      source: {
        type: DataTypes.STRING(255),
      },
      image: {
        type: DataTypes.JSON,
      },
    },
    {
    }
  );
};
