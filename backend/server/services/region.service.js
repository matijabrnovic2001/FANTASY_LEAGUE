const RegionModel = require('../models/region.model')

const RegionService = {
    getAll: async ()=>{
        return await RegionModel.getAll()
    },

    getById: async (id)=>{
        const region = await RegionModel.getById(id)
        if(!region) throw new Error("No such region!")
        return region
    },

    create: async({region_name, region_code})=>{
        return await RegionModel.create({region_name, region_code})
    },

    delete: async(id)=>{
        const deleted = await RegionModel.delete(id)
        if(!deleted) throw new Error("No such region!")
        return deleted
    },

    /*update: async(id, {region_name, region_code})=>{
        //nije potreban za potrebe projekta
    }*/


}

module.exports = RegionService