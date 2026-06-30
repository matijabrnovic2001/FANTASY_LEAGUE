const ContractModel = require('../models/contract.model')

const ContractService = {
    getAll: async ({player, team, is_active} = {})=>{
        return await ContractModel.getAll({player, team, is_active})
    },
    getById: async (id)=>{
        const contract = await ContractModel.getById(id)
        if(!contract) throw new Error('No such contract!')
        return contract
    },
    create: async ({player, team, role_id, sign_date, expiration_date, contract_value, is_active})=>{
        return await ContractModel.create({
            player, 
            team, 
            role_id, 
            sign_date, 
            expiration_date, 
            contract_value, 
            is_active
        })
    },
    delete: async (id)=>{
        const deleted = await ContractModel.delete(id)
        if(!deleted) throw new Error('No such contract!')
        return deleted
    },
    update: async (id, {player, team, role_id, sign_date, expiration_date, contract_value, is_active})=>{
        const updated = await ContractModel.update(id, {
            player, 
            team, 
            role_id, 
            sign_date, 
            expiration_date, 
            contract_value, 
            is_active
        })

        if(!updated) throw new Error('No such contract!')
        return updated
    },
    deactivateContract: async (id)=>{
        const deactivated = await ContractModel.deactivateContract(id)
        if(!deactivated) throw new Error('No such contract!')
        return deactivated
    },
}

module.exports = ContractService