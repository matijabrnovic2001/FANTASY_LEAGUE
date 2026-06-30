const MatchModel = require('../models/match.model')

const MatchService = {
    getAll: async({season, region, team, limit} = {})=>{
        return await MatchModel.getAll({season, region, team, limit})
    },

    getById: async(id)=>{
        const match = await MatchModel.getById(id)
        if(!match) throw new Error('No such match!')
        return match
    },

    create: async({home_team, away_team, season, region, date_played, home_team_wins, away_team_wins, match_format})=>{
        return await MatchModel.create({
            home_team,
            away_team, 
            season, 
            region, 
            date_played, 
            home_team_wins, 
            away_team_wins, 
            match_format
        })
    },

    delete: async(id)=>{
        const deleted = await MatchModel.delete(id)
        if(!deleted) throw new Error('No such match!')
        return deleted
    },

    update: async(id, {home_team, away_team, season, region, date_played, home_team_wins, away_team_wins, match_format})=>{
        const updated = await MatchModel.update(id, {
            home_team, 
            away_team, 
            season, 
            region, 
            date_played,
            home_team_wins, 
            away_team_wins, 
            match_format
        })
        if(!updated) throw new Error('No such match!')
        return updated
    },
    getForm: async ({ team, season, region, limit }) => {
        if (!team) throw new Error('Team is required')
        if (!season) throw new Error('Season is required')
        if (!region) throw new Error('Region is required')
        if (!limit) throw new Error('Limit is required')

    
        return await MatchModel.getForm({
            team,
            season,
            region,
            limit: Number(limit)
        })
    },
    getMatchesWithTeamInfo: async ({ season, region }) => {
        if (!season) {
            throw new Error("Season is required")
        }

        if (!region) {
            throw new Error("Region is required")
        }

        return await MatchModel.getMatchesWithTeamInfo({
            season: Number(season),
            region: Number(region)
        })
    }
}

module.exports = MatchService