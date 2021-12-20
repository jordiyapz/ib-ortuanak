const { regexp } = require("sequelize/types/lib/operators");
const { Ortu, Anak ,Role } = require("../../models");

module.exports = {
    getUser: async (req, res) =>{
        try{
            const data = await Ortu.findAll()
            return res.status(200).json({
                success: true,
                message: "Data fetched successfully",
                data: data
            })
        }catch(e){
            console.log(e)
            return res.status(500).json({
                statusCode: 500,
                err: "INTERNAL SERVER ERROR",
                message: "INTERNAL SERVER ERROR"})
        }
    },

    getRole: async (req, res) =>{
        try{
            const data = await Role.findAll()
            return res.status(200).json({
                success: true,
                message: "Data fetched successfully",
                data: data
            })
        }catch(e){
            console.log(e)
            return res.status(500).json({
                statusCode: 500,
                err: "INTERNAL SERVER ERROR",
                message: "INTERNAL SERVER ERROR"})
        }
    },

    postRole: async (req, res) =>{
        try{
            const data = await Role.create({nama : req.body.nama , createdAt : new Date(), updatedAt : new Date()})
            return res.status(200).json({
                success: true,
                message: "Data fetched successfully",
                data: data
            })
        }catch(e){
            console.log(e)
            return res.status(500).json({
                statusCode: 500,
                err: "INTERNAL SERVER ERROR",
                message: "INTERNAL SERVER ERROR"})
        }
    },
}






