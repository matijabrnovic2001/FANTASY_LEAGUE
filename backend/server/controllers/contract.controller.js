const ContractService = require('../services/contract.service')

const ContractController = {
    getAll: async(req, res)=>{
        try {
            const {player, team, is_active} = req.query

            const contracts = await ContractService.getAll({
                player,
                team,
                is_active
            })

            res.status(200).json(contracts)

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    getById: async(req, res)=>{
        try {
            const id = Number(req.params.id)

            const contract = await ContractService.getById(id)

            res.status(200).json(contract)

        } catch(err) {
            if(err.message === 'No such contract!')
                return res.status(404).json({error: err.message})

            res.status(500).json({error: err.message})
        }
    },

    create: async(req, res)=>{
        try {
            const {
                player,
                team,
                role_id,
                sign_date,
                expiration_date,
                contract_value,
                is_active
            } = req.body

            const insertId = await ContractService.create({
                player,
                team,
                role_id,
                sign_date,
                expiration_date,
                contract_value,
                is_active
            })

            res.status(201).json({id: insertId})

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    update: async(req, res)=>{
        try {
            const id = Number(req.params.id)

            const {
                player,
                team,
                role_id,
                sign_date,
                expiration_date,
                contract_value,
                is_active
            } = req.body

            await ContractService.update(id, {
                player,
                team,
                role_id,
                sign_date,
                expiration_date,
                contract_value,
                is_active
            })

            res.status(200).send()

        } catch(err) {
            if(err.message === 'No such contract!')
                return res.status(404).json({error: err.message})

            res.status(500).json({error: err.message})
        }
    },

    delete: async(req, res)=>{
        try {
            const id = Number(req.params.id)

            await ContractService.delete(id)

            res.status(204).send()

        } catch(err) {
            if(err.message === 'No such contract!')
                return res.status(404).json({error: err.message})

            res.status(500).json({error: err.message})
        }
    },

    deactivateContract: async(req, res)=>{
        try {
            const id = Number(req.params.id)

            await ContractService.deactivateContract(id)

            res.status(200).send()

        } catch(err) {
            if(err.message === 'No such contract!')
                return res.status(404).json({error: err.message})

            res.status(500).json({error: err.message})
        }
    }
}

module.exports = ContractController