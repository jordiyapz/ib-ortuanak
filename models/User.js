module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        role_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },
      },
      {
        tableName: "user",
        timestamps: true,
      }
    );
  
    return User;
  };
  