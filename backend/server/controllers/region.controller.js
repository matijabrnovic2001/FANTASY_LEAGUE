const RegionService = require('../services/region.service')

const RegionController = {
    getAll: async (req, res)=>{
        try {
            const regions = await RegionService.getAll()
            res.status(200).json(regions)
        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    getById: async (req, res)=>{
        try {
            const id = Number(req.params.id)
            const region = await RegionService.getById(id)
            res.status(200).json(region)
        } catch(err) {
            if(err.message === "No such region!") return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    create: async (req, res)=>{
        try {
            const {region_name, region_code} = req.body
            const insertId = await RegionService.create({region_name, region_code})
            res.status(201).json(insertId)
        } catch(err) {
            res.status(500).json({error: err.message})
        }   
    },

    delete: async (req, res)=>{
        try {
            const id = Number(req.params.id)
            await RegionService.delete(id)
            res.status(204).send()
            
        } catch(err) {
            if(err.message === "No such region!") return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

}

module.exports = RegionController