
const SeasonModel = require('../models/season.model')

const SeasonService = {
    getAll: async()=>{
        return await SeasonModel.getAll()
    },

    getById: async(id)=>{
        const season = await SeasonModel.getById(id)
        if(!season) throw new Error('No such season!')
        return season
    },
    create: async({szn_name, szn_year})=>{
        if(!validateYear(szn_year)) throw new Error('Invalid year!')
        const insertId = await SeasonModel.create({szn_name, szn_year})
        return insertId

    },

    delete: async(id)=>{
        const deleted = await SeasonModel.delete(id)
        if(!deleted) throw new Error('No such season!')
        return deleted
    },
    update: async(id, {szn_name, szn_year})=>{
        if(!validateYear(szn_year)) throw new Error('Invalid year!')
        const updated = await SeasonModel.update(id, {szn_name, szn_year})
        if(!updated) throw new Error('No such season!')
        return updated
    }

}

function validateYear(szn_year) {
    const currYear = new Date().getFullYear()
    return (2010 <= szn_year && szn_year<= currYear) ? true : false
    
}


module.exports = SeasonService