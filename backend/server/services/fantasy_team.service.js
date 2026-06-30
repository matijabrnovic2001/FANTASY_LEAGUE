const FantasyTeamModel = require('../models/fantasy_team.model')

const FantasyTeamService = {
    getAll: async({owner} = {})=>{
        return await FantasyTeamModel.getAll({owner})
    },

    getById: async(id)=>{
        const team = await FantasyTeamModel.getById(id)
        if(!team) throw new Error('No such fantasy team!')
        return team
    },

    create: async({team_name, owner})=>{
        return await FantasyTeamModel.create({team_name, owner})
    },

    delete: async(id)=>{
        const deleted = await FantasyTeamModel.delete(id)
        if(!deleted) throw new Error('No such fantasy team!')
        return deleted
    },

    update: async(id, {team_name, owner, budget})=>{
        const updated = await FantasyTeamModel.update(id, {team_name, owner, budget})
        if(!updated) throw new Error('No such fantasy team!')
        return updated
    }
}

module.exports = FantasyTeamService