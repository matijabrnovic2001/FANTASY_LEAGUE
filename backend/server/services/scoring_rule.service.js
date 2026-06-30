const ScoringRuleModel = require('../models/scoring_rule.model')

const ScoringRuleService = {
    getAll: async ({ role_id } = {}) => {
        return await ScoringRuleModel.getAll({ role_id })
    },

    getById: async (id) => {
        const rule = await ScoringRuleModel.getById(id)

        if (!rule) throw new Error('No such scoring rule!')

        return rule
    },

    create: async ({
        role_id,
        kills_val,
        deaths_val,
        assists_val,
        farm_val,
        obj_val
    }) => {
        validateScoringRule({
            role_id,
            kills_val,
            deaths_val,
            assists_val,
            farm_val,
            obj_val
        })

        return await ScoringRuleModel.create({
            role_id,
            kills_val,
            deaths_val,
            assists_val,
            farm_val,
            obj_val
        })
    },

    delete: async (id) => {
        const deleted = await ScoringRuleModel.delete(id)

        if (!deleted) throw new Error('No such scoring rule!')

        return deleted
    },

    update: async (id, {
        role_id,
        kills_val,
        deaths_val,
        assists_val,
        farm_val,
        obj_val
    }) => {
        validateScoringRule({
            role_id,
            kills_val,
            deaths_val,
            assists_val,
            farm_val,
            obj_val
        })

        const updated = await ScoringRuleModel.update(id, {
            role_id,
            kills_val,
            deaths_val,
            assists_val,
            farm_val,
            obj_val
        })

        if (!updated) throw new Error('No such scoring rule!')

        return updated
    }
}

function validateScoringRule(rule) {
    if (!rule.role_id) {
        throw new Error('Role ID is required!')
    }

    const fields = [
        'kills_val',
        'deaths_val',
        'assists_val',
        'farm_val',
        'obj_val'
    ]

    fields.forEach(field => {
        if (rule[field] === undefined || rule[field] === null || rule[field] === '') {
            throw new Error(`${field} is required!`)
        }

        if (isNaN(Number(rule[field]))) {
            throw new Error(`${field} must be a number!`)
        }
    })
}

module.exports = ScoringRuleService