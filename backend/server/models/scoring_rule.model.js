const pool = require('../config/db')

const ScoringRuleModel = {
    getAll: async ({ role_id } = {}) => {
        let query = `SELECT * FROM scoring_rules WHERE 1=1 `
        const params = []

        if (role_id) {
            query += `AND role_id = ? `
            params.push(role_id)
        }

        const [rows] = await pool.query(query, params)
        return rows
    },

    getById: async (id) => {
        const query = `SELECT * FROM scoring_rules WHERE id = ?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },

    create: async ({
        role_id,
        kills_val,
        deaths_val,
        assists_val,
        farm_val,
        obj_val
    }) => {
        const query = `
            INSERT INTO scoring_rules
            (role_id, kills_val, deaths_val, assists_val, farm_val, obj_val)
            VALUES (?, ?, ?, ?, ?, ?)
        `

        const [result] = await pool.query(query, [
            role_id,
            kills_val,
            deaths_val,
            assists_val,
            farm_val,
            obj_val
        ])

        return result.insertId
    },

    update: async (id, {
        role_id,
        kills_val,
        deaths_val,
        assists_val,
        farm_val,
        obj_val
    }) => {
        const query = `
            UPDATE scoring_rules
            SET
                role_id = ?,
                kills_val = ?,
                deaths_val = ?,
                assists_val = ?,
                farm_val = ?,
                obj_val = ?
            WHERE id = ?
        `

        const [result] = await pool.query(query, [
            role_id,
            kills_val,
            deaths_val,
            assists_val,
            farm_val,
            obj_val,
            id
        ])

        return result.affectedRows > 0
    },

    delete: async (id) => {
        const query = `DELETE FROM scoring_rules WHERE id = ?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows > 0
    }
}

module.exports = ScoringRuleModel