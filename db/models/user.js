/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    emailAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
  }, {
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany( models.Course ,{
      as: "courses",
      foreignKey: {
        name: 'userId',
        allowNull: false
      }})
  }
  return User;
};
