const FantasyContractService = require('../services/fantasy_contract.service')

const FantasyContractController = {
    getAll: async(req, res)=>{
        try {
            const {fantasy_team, fantasy_player, contract_role} = req.query
            const contracts = await FantasyContractService.getAll({fantasy_team, fantasy_player, contract_role})
            res.status(200).json(contracts)

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    getById: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const contract = await FantasyContractService.getById(id)
            res.status(200).json(contract)

        } catch(err) {
            if(err.message === 'No such fantasy contract!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    create: async(req, res)=>{
        try {
            const {fantasy_team, fantasy_player, contract_role, price} = req.body
            const insertId = await FantasyContractService.create({fantasy_team, fantasy_player, contract_role, price})
            res.status(201).json({id: insertId})

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    update: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const {fantasy_team, fantasy_player, contract_role, price} = req.body
            await FantasyContractService.update(id, {fantasy_team, fantasy_player, contract_role, price})
            res.status(200).send()

        } catch(err) {
            if(err.message === 'No such fantasy contract!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    delete: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            await FantasyContractService.delete(id)
            res.status(204).send()

        } catch(err) {
            if(err.message === 'No such fantasy contract!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = FantasyContractController