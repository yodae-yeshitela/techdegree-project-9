module.exports = function(sequelize, DataTypes) {
  const Course =  sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    estimatedTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    materialsNeeded: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, 
  {
    timestamps: true
  }
  );
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: "user",
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    })
  }
  return Course;
};
