const MatchService = require('../services/match.service')

const MatchController = {
    getAll: async(req, res)=>{
        try {
            const {season, region, team, limit} = req.query
            const matches = await MatchService.getAll({season, region, team, limit})
            res.status(200).json(matches)

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    getById: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const match = await MatchService.getById(id)
            res.status(200).json(match)

        } catch(err) {
            if(err.message === 'No such match!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    create: async(req, res)=>{
        try {
            const {
                home_team, 
                away_team, 
                season, 
                region, 
                date_played,
                home_team_wins, 
                away_team_wins, 
                match_format
            } = req.body

            const insertId = await MatchService.create({
                home_team, 
                away_team, 
                season, 
                region,
                date_played,
                home_team_wins, 
                away_team_wins, 
                match_format
            })
            res.status(201).json({id: insertId})

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    update: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const {home_team, 
                away_team, 
                season, 
                region, 
                date_played,
                home_team_wins, 
                away_team_wins, 
                match_format} = req.body
            await MatchService.update(id, {
                home_team, 
                away_team, 
                season, 
                region, 
                date_played,
                home_team_wins, 
                away_team_wins, 
                match_format
            })
            res.status(200).send()

        } catch(err) {
            if(err.message === 'No such match!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    delete: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            await MatchService.delete(id)
            res.status(204).send()

        } catch(err) {
            if(err.message === 'No such match!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },
    getForm: async (req, res) => {
        try {
            const { team, season, region, limit } = req.query
            const form = await MatchService.getForm({ team, season, region, limit})
            res.status(200).json(form)
        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    },
    getMatchesWithTeamInfo: async (req, res) => {
        try {
            const { season, region } = req.query

            const matches = await MatchService.getMatchesWithTeamInfo({
                season,
                region
            })

            res.json(matches)
        } catch (err) {
            res.status(400).json({
                message: err.message
            })
        }
    }
}

module.exports = MatchController