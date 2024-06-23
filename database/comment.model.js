
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      itemId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Items',
          key: 'id',
        },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING(255),
      },
      likes: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      country: {
        type: DataTypes.STRING(255),
      },
      parentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: 'Comments',
          key: 'id',
        },
      },
    },
  );

  return Comment;
};