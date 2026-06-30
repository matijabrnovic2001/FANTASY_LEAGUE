const TeamService = require('../services/team.service')

const TeamController = {
    getAll: async(req, res)=>{
        try {
            const {region} = req.query
            const teams = await TeamService.getAll({region})
            res.status(200).json(teams)
        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    getById: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const team = await TeamService.getById(id)
            res.status(200).json(team)

        } catch(err) {
            if(err.message === 'No such team!')
                return res.status(404).json({error: err.message})

            res.status(500).json({error: err.message})
        }
    },

    create: async(req, res)=>{
        try {
            const {team_name, team_code, region} = req.body
            const insertId = await TeamService.create({team_name, team_code, region})
            res.status(201).json({id: insertId})

        } catch(err) {
            res.status(500).json({error: err.message})
        }
    },

    update: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            const {team_name, team_code, region} = req.body
            await TeamService.update(id, {team_name, team_code, region})
            res.status(200).json({message: "Team updated successfully!"})

        } catch(err) {
            if(err.message === 'No such team!')
                return res.status(404).json({error: err.message})

            res.status(500).json({error: err.message})
        }
    },

    delete: async(req, res)=>{
        try {
            const id = Number(req.params.id)
            await TeamService.delete(id)
            res.status(204).send()

        } catch(err) {
            if(err.message === 'No such team!')
                return res.status(404).json({error: err.message})

            res.status(500).json({error: err.message})
        }
    },
    getStandings: async (req, res) => {
        try {
            const { season, region } = req.query
            const standings = await TeamService.getStandings({season, region})

            res.status(200).json(standings)
        } catch (err) {
            res.status(400).json({
                message: err.message
            })
        }
    },
    getRoster: async(req, res)=>{
        try {
            const {team} = req.query
    
            const roster = await TeamService.getRoster({team_id: team})
    
            res.status(200).json(roster)
        } catch(err) {
            res.status(400).json({message: err.message})
        }
    }
}

module.exports = TeamController