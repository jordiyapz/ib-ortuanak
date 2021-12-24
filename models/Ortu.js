module.exports = (sequelize, DataTypes) => {
  const Ortu = sequelize.define(
    "Ortu",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Bapak", "Ibu"],
        allowNull: false,
      },
      nik: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      no_hp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      no_hp_alternatif: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pekerjaan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      faskes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adaAnak: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      isHamil: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        field: "createdAt",
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: "updatedAt",
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "ortu",
      timestamps: true,
    }
  );

  return Ortu;
};
