//const { regexp } = require("sequelize/types/lib/operators");
const { Ortu, Anak, Role } = require("../../models");
const base64img = require('base64-img')

module.exports = {
    getUser: async (req, res) => {
        try {
            const data = await Ortu.findAll()

            // Konversi field avatar menjadi base64 
            const users = (data || []).map(user => {
                if (user.avatar) {
                    const avatarBase64 = base64img.base64Sync(data[1].avatar)
                    user.avatar = avatarBase64
                }
                return user
            })

            return res.status(200).json({
                success: true,
                message: "Data fetched successfully",
                data: users
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






