//const { regexp } = require("sequelize/types/lib/operators");
const { Ortu, Anak, Role } = require("../../models");
const base64img = require('base64-img')

module.exports = {
  getUser: async (req, res) => {
    try {
      const data = await Ortu.findAll()

      // Konversi field avatar menjadi base64 
      const users = (data || []).map(user => {
        try {
          if (user.avatar) {
            const avatarBase64 = base64img.base64Sync(data[1].avatar)
            user.avatar = avatarBase64
          }
        } catch (error) {
          console.error(error.message ? error.message.slice(Math.min(30, error.message.length)) : "Unknown error")
        }
        return user
      })

      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: users
      })
    } catch (error) {
      console.error(error.message ? error.message.slice(Math.min(30, error.message.length)) : "Unknown error")

      // console.log(e.message)
      return res.status(500).json({
        statusCode: 500,
        err: "INTERNAL SERVER ERROR",
        message: error.message || 'Internal Server Error'
      })
    }
  },

  deleteUser: async (req, res) => {
    const { id: userId } = req.params
    try {
      console.debug(userId)
      const user = await Ortu.findOne({ where: { id: userId } })
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' })

      const deleteResult = await Ortu.destroy({ where: { id: user.id } })
      if (!deleteResult) throw new Error('Delete not success')

      return res.status(201).json({ message: 'Berhasil menghapus!' });
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: error.message || error })
    }
  },

  getRole: async (req, res) => {
    try {
      const data = await Role.findAll()
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: data
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        statusCode: 500,
        err: "INTERNAL SERVER ERROR",
        message: "INTERNAL SERVER ERROR"
      })
    }
  },

  postRole: async (req, res) => {
    try {
      const data = await Role.create({
        nama: req.body.nama,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return res.status(201).json({
        success: true,
        message: "Berhasil menambahkan rol",
        data: data
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        statusCode: 500,
        err: "INTERNAL SERVER ERROR",
        message: "INTERNAL SERVER ERROR"
      })
    }
  },
}






