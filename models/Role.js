module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
      "Role",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        nama: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "created_at",
          },
        updatedAt: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "updated_at",
          },
          
      },
      {
        tableName: "role",
        timestamps: true,
      }
    );
  
    return Role;
  };