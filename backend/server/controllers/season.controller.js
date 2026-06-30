const SeasonService = require('../services/season.service')

const SeasonController = {
    getAll: async (req, res)=>{
        try {
            const seasons = await SeasonService.getAll()
            res.status(200).json(seasons)
        } catch (err) {
            res.status(500).json({error: err.message})
        }

    },
    getById: async (req, res)=>{
        try {
            const id = Number(req.params.id)
            const season = await SeasonService.getById(id)
            res.status(200).json(season)

        } catch (err) {
            if(err.message === 'No such season!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },
    create: async (req, res)=>{
        try {
            const {szn_year, szn_name} = req.body
            const insertId = await SeasonService.create({szn_year, szn_name})
            res.status(201).json(insertId)

        } catch (err) {
            if(err.message === 'Invalid year!') return res.status(400).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },
    delete: async (req, res)=>{
        try {
            const id = Number(req.params.id)
            await SeasonService.delete(id)
            res.status(204).send()

        } catch (err) {
            if(err.message === 'No such season!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },
    update: async (req, res)=>{
        try {
            const id = Number(req.params.id)
            const {szn_year, szn_name} = req.body
            await SeasonService.update(id, {szn_name, szn_year})
            res.status(200).json({ message: 'Season updated successfully'})
        } catch (err) {
            if(err.message === 'No such season!') return res.status(400).json({error: err.message})
            if(err.message === 'Invalid year!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },
}

module.exports = SeasonController