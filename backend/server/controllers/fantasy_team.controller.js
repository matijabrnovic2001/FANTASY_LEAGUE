const FantasyTeamService = require('../services/fantasy_team.service')

const FantasyTeamController = {
    getAll: async(req, res)=>{
        try {
            const {owner} = req.query
            const teams = await FantasyTeamService.getAll({owner})
            res.status(200).json(teams)

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    getById: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const team = await FantasyTeamService.getById(id)
            res.status(200).json(team)

        } catch(err) {
            if(err.message === 'No such fantasy team!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    create: async(req, res)=>{
        try {
            const {team_name, owner} = req.body
            const insertId = await FantasyTeamService.create({team_name, owner})
            res.status(201).json({id: insertId})

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    update: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const {team_name, owner, budget} = req.body
            await FantasyTeamService.update(id, {team_name, owner, budget})
            res.status(200).send()

        } catch(err) {
            if(err.message === 'No such fantasy team!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    },

    delete: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            await FantasyTeamService.delete(id)
            res.status(204).send()

        } catch(err) {
            if(err.message === 'No such fantasy team!') return res.status(404).json({error: err.message})
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = FantasyTeamController