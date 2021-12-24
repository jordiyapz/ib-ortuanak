require("dotenv").config();
const { Ortu, Anak } = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const { JWT_SECRET_KEY } = process.env;
const Valiadator = require("fastest-validator");
const v = new Valiadator();

Ortu.hasMany(Anak, { foreignKey: "ortu_id", as: "anak" });

// fungsi base64
function base64(gambar, gambarFolder, gambarName) {
  // cek gambar
  if (!isBase64(gambar, { mimeRequired: true })) {
    // jika gambar salah
    return false;
  } else {
    // upload gambar
    const filepath = base64Img.imgSync(
      gambar,
      gambarFolder,
      gambarName + "-" + Date.now()
    );
    // jika berhasil upload
    return filepath;
  }
}

module.exports = {
  // controller register
  register: async (req, res) => {
    try {
      // jika berhasil

      // mengambil data user di database
      const data = await Ortu.findOne({
        where: {
          [Op.or]: [
            {
              username: req.body.username,
            },
            {
              no_hp: req.body.no_hp,
            },
          ],
        },
      });

      // cek apakah ada email yang sama
      if (data) {
        // jika ada user yang sama

        // response conflict
        res.status(409).json({
          statusCode: 409,
          err: "CONFLICT",
          message: "Username atau nomer handphone sudah terdaftar",
        });
      } else {
        // jika tidak ada email yang sama

        // cek apakah password sudah sama
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password != confirmPassword) {
          // jika tidak sama
          res.status(404).json({
            statusCode: 400,
            err: "BAD REQUEST",
            message: "Password tidak sama dan minimal harus 8 karakter",
          });
        } else {
          // jika sama

          // lakukan validasi
          const schema = {
            nama: "string|empty:false",
            email: "string|email:true",
            status: "string|empty:false",
            nik: "string|min:16",
            tempat_lahir: "string|empty:false",
            tanggal_lahir: "string|empty:false",
            username: "string|empty:false",
            no_hp: "string|empty:false",
            alamat: "string|empty:false",
            pekerjaan: "string|empty:false",
            password: "string|min:8",
            adaAnak: "boolean",
            isHamil: "boolean",
            anak: {
              type: "array",
              items: {
                type: "object",
                props: {
                  nama: "string|empty:false",
                  nik: "string|min:16",
                  tempat_lahir: "string|empty:false",
                  tanggal_lahir: "string|empty:false",
                  urutan: "number",
                },
              },
            },
          };

          const validate = v.validate(req.body, schema);

          if (validate.length) {
            res.status(400).json({
              statusCode: 400,
              error: "BAD REQUEST",
              message: validate,
            });
          }

          // insert data ke database
          const avatarOrtu = base64(
            req.body.avatar,
            "./upload/img-ortu",
            "ortu"
          );

          if (!avatarOrtu) {
            res.status(404).json({
              statusCode: 400,
              err: "BAD REQUEST",
              message: "Gambar tidak valid",
            });
          } else {
            const data = await Ortu.create({
              nama: req.body.nama,
              email: req.body.email,
              status: req.body.status,
              nik: req.body.nik,
              tempat_lahir: req.body.tempat_lahir,
              tanggal_lahir: req.body.tanggal_lahir,
              username: req.body.username,
              no_hp: req.body.no_hp,
              no_hp_alternatif: req.body.no_hp_alternatif || null,  // menambahkan no_hp_alternatif jika ada
              alamat: req.body.alamat,
              pekerjaan: req.body.pekerjaan,
              password: await bcrypt.hash(password, 10),
              faskes: req.body.faskes,
              adaAnak: req.body.adaAnak,
              isHamil: req.body.isHamil,
              avatar: avatarOrtu,
            });

            // mapping
            const dataAnak = req.body.anak.map((ank) => {
              // Cek kolom avatar pada anak
              if (!ank.avatar) return res.status(400).json({
                statusCode: 400, err: 'BAD REQUEST', message: 'Avatar anak diperlukan'
              })
              const avatarAnak = base64(
                ank.avatar,
                "./upload/img-anak",
                "anak"
              );
              if (!avatarAnak) {
                res.status(404).json({
                  statusCode: 400,
                  err: "BAD REQUEST",
                  message: "Gambar tidak valid",
                });
              } else {
                return {
                  nama: ank.nama,
                  nik: ank.nik,
                  tempat_lahir: ank.tempat_lahir,
                  tanggal_lahir: ank.tanggal_lahir,
                  urutan: ank.urutan,
                  ortu_id: data.id,
                  avatar: avatarAnak,
                };
              }
            });

            // insert anak
            await Anak.bulkCreate(dataAnak);

            // response berhasil
            res.status(201).json({
              message: "Berhasil register",
            });
          }
        }
      }
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },

  // controller login
  login: async (req, res) => {
    try {
      // jika berhasil
      // mencari user berdasrakan email
      const data = await Ortu.findOne({
        where: {
          [Op.or]: [
            {
              username: req.body.username,
            },
            {
              no_hp: req.body.username,
            },
          ],
        },
      });

      // cek apakah ada user
      if (!data) {
        // jika tidak ada user
        res.status(401).json({
          statusCode: 401,
          err: "UNAUTHORIZED",
          message: "Username atau nomer handphone tidak terdaftar",
        });
      } else {
        // cek apakah password benar
        const isValidPassword = await bcrypt.compare(
          req.body.password,
          data.password
        );

        // cek hasil cek password
        if (!isValidPassword) {
          // jika password salah
          res.status(401).json({
            statusCode: 401,
            err: "UNAUTHORIZED",
            message: "Password Salah",
          });
        } else {
          // jika password benar

          // generate token
          const token = jwt.sign({ id: data.id }, JWT_SECRET_KEY, { expiresIn: "1h" });

          // response berhasil
          res
            .status(200)
            .set({ "x-auth-token": token })
            .json({ message: "Berhasil login" });
        }
      }
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },

  // // controller get ortu
  get_ortu: async (req, res) => {
    try {
      // jika berhasil

      // cari data ke database
      const data = await Ortu.findOne({
        where: {
          id: req.id,
        },
        include: ["anak"],
      });

      // cek apakah ada
      if (!data) {
        // jika tidak ada
        res.status(404).json({
          statusCode: 404,
          error: "NOT FOUND",
          message: "Ortu tidak ditemukan",
        });
      } else {
        // jika ada
        res.status(200).json(data);
      }
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },

  // controller register
  edit_ortu: async (req, res) => {
    try {
      // jika berhasil

      // mengambil data user di database
      const data = await Ortu.findOne({
        where: {
          id: req.id,
        },
      });

      if (!req.body.avatar) {
        // insert data ke database
        await data.update({
          email: req.body.email,
          nama: req.body.nama,
          nik: req.body.nik,
          tempat_lahir: req.body.tempat_lahir,
          tanggal_lahir: req.body.tanggal_lahir,
          alamat: req.body.alamat,
          pekerjaan: req.body.pekerjaan,
          faskes: req.body.faskes,
          isHamil: req.body.isHamil,
          no_hp: req.body.no_hp,
          no_hp_alternatif: req.body.no_hp_alternatif,
          username: req.body.username,
          // password: await bcrypt.hash(req.body.password, 10),
          avatar: data.avatar,
        });
      } else {
        // insert data ke database
        await data.update({
          email: req.body.email,
          nama: req.body.nama,
          nik: req.body.nik,
          tempat_lahir: req.body.tempat_lahir,
          tanggal_lahir: req.body.tanggal_lahir,
          alamat: req.body.alamat,
          pekerjaan: req.body.pekerjaan,
          faskes: req.body.faskes,
          isHamil: req.body.isHamil,
          no_hp: req.body.no_hp,
          no_hp_alternatif: req.body.no_hp_alternatif,
          username: req.body.username,
          // password: await bcrypt.hash(req.body.password, 10),
          avatar: base64(req.body.avatar, "./upload/img-ortu", "ortu"),
        });
      }

      // response berhasil
      res.status(201).json({
        message: "Berhasil update profile",
      });
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },

  // controller tambah anak
  add_anak: async (req, res) => {
    try {
      // jika berhasil

      // lakukan validasi
      const schema = {
        nama: "string|empty:false",
        nik: "string|min:16",
        tempat_lahir: "string|empty:false",
        tanggal_lahir: "string|empty:false",
        urutan: "number",
      };

      const validate = v.validate(req.body, schema);

      if (validate.length) {
        res.status(400).json({
          statusCode: 400,
          error: "BAD REQUEST",
          message: validate,
        });
      }

      // insert data ke database
      const avatarAnak = base64(req.body.avatar, "./upload/img-anak", "anak");
      if (!avatarAnak) {
        res.status(404).json({
          statusCode: 400,
          err: "BAD REQUEST",
          message: "Gambar tidak valid",
        });
      } else {
        await Anak.create({
          nama: req.body.nama,
          nik: req.body.nik,
          tempat_lahir: req.body.tempat_lahir,
          tanggal_lahir: req.body.tanggal_lahir,
          urutan: req.body.urutan,
          ortu_id: req.id,
          avatar: avatarAnak,
        });

        // response berhasil
        res.status(201).json({
          message: "Berhasil menambahkan anak",
        });
      }
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },

  // controller get anak
  get_anak: async (req, res) => {
    try {
      // jika berhasil

      // cari data ke database
      const data = await Anak.findAll({
        where: {
          ortu_id: req.id,
        },
      });

      // cek apakah ada
      if (!data) {
        // jika tidak ada
        res.status(404).json({
          statusCode: 404,
          error: "NOT FOUND",
          message: "Anak tidak ditemukan",
        });
      } else {
        // jika ada
        res.status(200).json(data);
      }
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },

  // controller edit anak
  edit_anak: async (req, res) => {
    try {
      // jika berhasil

      const data = await Anak.findOne({
        where: {
          id: req.params.id,
        },
      });

      // cek apakah ada
      if (!data) {
        // jika tidak ada
        res.status(404).json({
          statusCode: 404,
          error: "NOT FOUND",
          message: "Anak tidak ditemukan",
        });
      } else {
        if (!req.body.avatar) {
          // insert data ke database
          await data.update({
            nama: req.body.nama,
            nik: req.body.nik,
            tempat_lahir: req.body.tempat_lahir,
            tanggal_lahir: req.body.tanggal_lahir,
            urutan: req.body.urutan,
            ortu_id: req.id,
            avatar: data.avatar,
          });
        } else {
          // insert data ke database
          await data.update({
            nama: req.body.nama,
            nik: req.body.nik,
            tempat_lahir: req.body.tempat_lahir,
            tanggal_lahir: req.body.tanggal_lahir,
            urutan: req.body.urutan,
            ortu_id: req.id,
            avatar: base64(req.body.avatar, "./upload/img-anak", "anak"),
          });
        }
      }

      // response berhasil
      res.status(201).json({
        message: "Berhasil update profile anak",
      });
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },

  // controller detail anak
  detail_anak: async (req, res) => {
    try {
      // jika berhasil

      // cari data ke database
      const data = await Anak.findOne({
        where: {
          id: req.params.id,
        },
      });

      // cek apakah ada
      if (!data) {
        // jika tidak ada
        res.status(404).json({
          statusCode: 404,
          error: "NOT FOUND",
          message: "Anak tidak ditemukan",
        });
      } else {
        // jika ada
        res.status(200).json(data);
      }
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },

  // controller destroy anak
  delete_anak: async (req, res) => {
    try {
      // jika berhasil

      // cari data ke database
      const data = await Anak.destroy({
        where: {
          id: req.params.id,
        },
      });

      // cek apakah ada
      if (!data) {
        // jika tidak ada
        res.status(404).json({
          statusCode: 404,
          error: "NOT FOUND",
          message: "Anak tidak ditemukan",
        });
      } else {
        // jika ada
        // response berhasil
        res.status(200).json({
          message: "Berhasil delete anak",
        });
      }
    } catch (err) {
      // jika gagal
      res.status(500).json({
        statusCode: 500,
        error: err.message,
        message: "Internal Server Error",
      });
    }
  },
};
