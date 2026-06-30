const ScoringRuleService = require('../services/scoring_rule.service')

const ScoringRuleController = {
    getAll: async (req, res) => {
        try {
            const { role_id } = req.query

            const rules = await ScoringRuleService.getAll({ role_id })

            res.status(200).json(rules)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    getById: async (req, res) => {
        try {
            const id = Number(req.params.id)

            const rule = await ScoringRuleService.getById(id)

            res.status(200).json(rule)
        } catch (err) {
            if (err.message === 'No such scoring rule!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const {
                role_id,
                kills_val,
                deaths_val,
                assists_val,
                farm_val,
                obj_val
            } = req.body

            const insertId = await ScoringRuleService.create({
                role_id,
                kills_val,
                deaths_val,
                assists_val,
                farm_val,
                obj_val
            })

            res.status(201).json({ id: insertId })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    },

    update: async (req, res) => {
        try {
            const id = Number(req.params.id)

            const {
                role_id,
                kills_val,
                deaths_val,
                assists_val,
                farm_val,
                obj_val
            } = req.body

            await ScoringRuleService.update(id, {
                role_id,
                kills_val,
                deaths_val,
                assists_val,
                farm_val,
                obj_val
            })

            res.status(200).send()
        } catch (err) {
            if (err.message === 'No such scoring rule!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(400).json({ error: err.message })
        }
    },

    delete: async (req, res) => {
        try {
            const id = Number(req.params.id)

            await ScoringRuleService.delete(id)

            res.status(204).send()
        } catch (err) {
            if (err.message === 'No such scoring rule!') {
                return res.status(404).json({ error: err.message })
            }

            res.status(500).json({ error: err.message })
        }
    }
}

module.exports = ScoringRuleController