const StatService = require('../services/stat.service')

const StatController = {
    getAll: async(req, res)=>{
        try {
            const {player, for_match} = req.query
            const stats = await StatService.getAll({player, for_match})
            res.status(200).json(stats)

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    getById: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const stat = await StatService.getById(id)
            res.status(200).json(stat)

        } catch(err) {
            if(err.message === 'No such stat!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    create: async(req, res)=>{
        try {
            const {player, for_match, kills, deaths, assists, farm, obj} = req.body
            const insertId = await StatService.create({player, for_match, kills, deaths, assists, farm, obj})
            res.status(201).json({id: insertId})

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    update: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const {player, for_match, kills, deaths, assists, farm, obj} = req.body
            await StatService.update(id, {player, for_match, kills, deaths, assists, farm, obj})
            res.status(200).send()

        } catch(err) {
            if(err.message === 'No such stat!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    delete: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            await StatService.delete(id)
            res.status(204).send()

        } catch(err) {
            if(err.message === 'No such stat!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = StatController