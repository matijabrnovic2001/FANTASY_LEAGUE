const StatModel = require('../models/stat.model')

const StatService = {
    getAll: async({player, for_match} = {})=>{
        return await StatModel.getAll({player, for_match})
    },

    getById: async(id)=>{
        const stat = await StatModel.getById(id)
        if(!stat) throw new Error('No such stat!')
        return stat
    },

    create: async({player, for_match, kills, deaths, assists, farm, obj})=>{
        return await StatModel.create({player, for_match, kills, deaths, assists, farm, obj})
    },

    delete: async(id)=>{
        const deleted = await StatModel.delete(id)
        if(!deleted) throw new Error('No such stat!')
        return deleted
    },

    update: async(id, {player, for_match, kills, deaths, assists, farm, obj})=>{
        const updated = await StatModel.update(id, {player, for_match, kills, deaths, assists, farm, obj})
        if(!updated) throw new Error('No such stat!')
        return updated
    }
}

module.exports = StatService