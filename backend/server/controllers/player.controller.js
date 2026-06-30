const PlayerService = require('../services/player.service')

const PlayerController = {
    getAll: async (req, res) => {
        try {
            const { player_role, residency, search } = req.query

            const players = await PlayerService.getAll({
                player_role,
                residency,
                search
            })

            res.status(200).json(players)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id)

            const player = await PlayerService.getById(id)

            res.status(200).json(player)
        } catch (err) {
            if (err.message === 'No such player!') return res.status(404).json({ error: err.message })
            res.status(500).json({ error: err.message })
        }
    },
    create: async (req, res) => {
        try {
            const {
                player_ign,
                full_name,
                birth_date,
                residency,
                player_role,
                fantasy_price
            } = req.body

            const insertId = await PlayerService.create({
                player_ign,
                full_name,
                birth_date,
                residency,
                player_role,
                fantasy_price
            })

            res.status(201).json({ id: insertId })
        } catch (err) {
            if (
                err.message === 'Invalid birth date!' ||
                err.message === 'Fantasy price out of bounds!'
            ) {
                return res.status(400).json({ error: err.message })
            }
            res.status(500).json({ error: err.message })
        }
    },

    update: async (req, res) => {
        try {
            const id = Number(req.params.id)

            const {
                player_ign,
                full_name,
                birth_date,
                residency,
                player_role,
                fantasy_price
            } = req.body

            await PlayerService.update(id, {
                player_ign,
                full_name,
                birth_date,
                residency,
                player_role,
                fantasy_price
            })

            res.status(200).json({ message: 'Players updated successfully' })
        } catch (err) {
            if (err.message === 'No such player!')
                return res.status(404).json({ error: err.message })

            if (
                err.message === 'Invalid birth date!' ||
                err.message === 'Fantasy price out of bounds!'
            ) {
                return res.status(400).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    },

    delete: async (req, res) => {
        try {
            const id = Number(req.params.id)
            await PlayerService.delete(id)
            res.status(204).send()
        } catch (err) {
            if (err.message === 'No such player!')
                return res.status(404).json({ error: err.message })
            res.status(500).json({ error: err.message })
        }
    },
    getPlayerStats: async (req, res) => {
        try {
            let { season } = req.query
            
            const stats = await PlayerService.getPlayerStats({ season })

            res.status(200).json(stats)
        } catch (err) {
            if (err.message === 'Season is required!') {
                return res.status(400).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    }
}

module.exports = PlayerController