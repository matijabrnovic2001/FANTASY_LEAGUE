const FantasyLeagueMembershipService = require('../services/fantasy_league_membership.service')

const FantasyLeagueMembershipController = {
    getAll: async (req, res) => {
        try {
            const { fantasy_team, fantasy_league } = req.query
            const memberships = await FantasyLeagueMembershipService.getAll({
                fantasy_team: fantasy_team ? Number(fantasy_team) : undefined,
                fantasy_league: fantasy_league ? Number(fantasy_league) : undefined
            })

            res.status(200).json(memberships)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const { fantasy_team, fantasy_league } = req.body

            await FantasyLeagueMembershipService.create({
                fantasy_team: Number(fantasy_team),
                fantasy_league: Number(fantasy_league)
            })

            res.status(201).send()

        } catch (err) {
            if (err.message === 'Team is already in the league!') {
                return res.status(400).json({ error: err.message })
            }

            if (err.message === 'League already full!') {
                return res.status(400).json({ error: err.message })
            }

            if (err.message === 'No such fantasy league!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    },

    delete: async (req, res) => {
        try {
            const fantasy_team = Number(req.params.fantasy_team)
            const fantasy_league = Number(req.params.fantasy_league)

            await FantasyLeagueMembershipService.delete({fantasy_team, fantasy_league})

            res.status(204).send()

        } catch (err) {
            if (err.message === 'No such membership!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    },

    countByLeague: async (req, res) => {
        try {
            const fantasy_league = Number(req.params.fantasy_league)

            const memberCount = await FantasyLeagueMembershipService.countByLeague({fantasy_league})

            res.status(200).json({ member_count: memberCount })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    isMember: async (req, res) => {
        try {
            const fantasy_team = Number(req.query.fantasy_team)
            const fantasy_league = Number(req.query.fantasy_league)

            const isMember = await FantasyLeagueMembershipService.isMember({
                fantasy_team,
                fantasy_league
            })

            res.status(200).json({ is_member: isMember })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    getMembersByLeague: async (req, res) => {
        try {
            const fantasy_league = Number(req.params.fantasy_league)
    
            const members = await FantasyLeagueMembershipService.getMembersByLeague({
                fantasy_league
            })
    
            res.status(200).json(members)
    
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    },
    getLeaguesByFantasyTeam: async (req, res) => {
        try {
            const fantasy_team = Number(req.params.fantasy_team)
    
            const leagues = await FantasyLeagueMembershipService.getLeaguesByFantasyTeam({
                fantasy_team
            })
    
            res.status(200).json(leagues)
    
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = FantasyLeagueMembershipController