const FantasyLeagueService = require('../services/fantasy_league.service')

const FantasyLeagueController = {
    getAll: async (req, res) => {
        try {
            const leagues = await FantasyLeagueService.getAll()
            res.status(200).json(leagues)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    getPublic: async (req, res) => {
        try {
            const leagues = await FantasyLeagueService.getPublic()
            res.status(200).json(leagues)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    getById: async (req, res) => {
        try {
            const id = Number(req.params.id)
            const league = await FantasyLeagueService.getById(id)
            res.status(200).json(league)

        } catch (err) {
            if (err.message === 'No such fantasy league!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    },

    getByCode: async (req, res) => {
        try {
            const league_code = req.params.code
            const league = await FantasyLeagueService.getByCode(league_code)
            res.status(200).json(league)

        } catch (err) {
            if (err.message === 'No such fantasy league!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const {
                league_name,
                league_code,
                description,
                owner_user,
                max_cap,
                is_public,
                is_official
            } = req.body

            const insertId = await FantasyLeagueService.create({
                league_name,
                league_code,
                description,
                owner_user,
                max_cap,
                is_public,
                is_official
            })

            res.status(201).json({ id: insertId })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    update: async (req, res) => {
        try {
            const id = Number(req.params.id)

            const {
                league_name,
                league_code,
                description,
                max_cap,
                is_public,
                is_active,
                is_official
            } = req.body

            await FantasyLeagueService.update(id, {
                league_name,
                league_code,
                description,
                max_cap,
                is_public,
                is_active,
                is_official
            })

            res.status(200).send()

        } catch (err) {
            if (err.message === 'No such fantasy league!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    },

    delete: async (req, res) => {
        try {
            const id = Number(req.params.id)
            await FantasyLeagueService.delete(id)
            res.status(204).send()

        } catch (err) {
            if (err.message === 'No such fantasy league!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    }
}

module.exports = FantasyLeagueController