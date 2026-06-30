const TeamModel = require('../models/team.model')

const TeamService = {
    getAll: async ({region} = {}) => {
        return await TeamModel.getAll({region})
    },

    getById: async (id) => {
        const team = await TeamModel.getById(id)
        if (!team) throw new Error('No such team!')
        return team
    },

    create: async ({ team_name, team_code, region }) => {
        return await TeamModel.create({ team_name, team_code, region})
    },

    delete: async (id) => {
        const deleted = await TeamModel.delete(id)
        if (!deleted) throw new Error('No such team!')
        return deleted
    },

    update: async (id, { team_name, team_code, region }) => {
        const updated = await TeamModel.update(id, {team_name, team_code, region})
        if (!updated) throw new Error('No such team!') 
        return updated
    },
    getStandings: async({season, region})=>{
        if (!season) throw new Error('Season is required')
        if (!region)  throw new Error('Region is required')
        return await TeamModel.getStandings({ season, region })
    },
    getRoster: async({team_id})=>{
        if (!team_id) {
            throw new Error("Team id is required")
        }
    
        return await TeamModel.getRoster(team_id)
    }
}

module.exports = TeamService