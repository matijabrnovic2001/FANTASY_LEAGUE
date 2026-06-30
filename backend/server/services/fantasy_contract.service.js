const FantasyContractModel = require('../models/fantasy_contract.model')

const FantasyContractService = {
    getAll: async({fantasy_team, fantasy_player, contract_role} = {})=>{
        return await FantasyContractModel.getAll({fantasy_team, fantasy_player, contract_role})
    },

    getById: async(id)=>{
        const contract = await FantasyContractModel.getById(id)
        if(!contract) throw new Error('No such fantasy contract!')
        return contract
    },

    create: async({fantasy_team, fantasy_player, contract_role, price})=>{
        return await FantasyContractModel.create({fantasy_team, fantasy_player, contract_role, price})
    },

    update: async(id, {fantasy_team, fantasy_player, contract_role, price})=>{
        const updated = await FantasyContractModel.update(id, {fantasy_team, fantasy_player, contract_role, price})
        if(!updated) throw new Error('No such fantasy contract!')
        return updated
    },

    delete: async(id)=>{
        const deleted = await FantasyContractModel.delete(id)
        if(!deleted) throw new Error('No such fantasy contract!')
        return deleted
    }
}

module.exports = FantasyContractService