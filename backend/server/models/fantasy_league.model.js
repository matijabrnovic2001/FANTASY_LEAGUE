const pool = require('../config/db')

const FantasyLeagueModel = {
    getAll: async () => {
        const query = `SELECT * FROM fantasy_leagues`
        const [rows] = await pool.query(query)
        return rows
    },

    getPublic: async () => {
        const query = `
            SELECT
                fl.*,
                u.username AS owner_username
            FROM fantasy_leagues fl
            JOIN users u
                ON fl.owner_user = u.id
            WHERE fl.is_public = TRUE
            AND fl.is_active = TRUE
        `

        const [rows] = await pool.query(query)
        return rows
    },

    getById: async (id) => {
        const query = `SELECT * FROM fantasy_leagues WHERE id = ?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },

    getByCode: async (league_code) => {
        const query = `SELECT * FROM fantasy_leagues WHERE league_code = ?`
        const [rows] = await pool.query(query, [league_code])
        return rows[0]
    },

    create: async ({
        league_name,
        league_code,
        description,
        owner_user,
        max_cap,
        is_public,
        is_official
    }) => {
        const query = `
            INSERT INTO fantasy_leagues(
                league_name,
                league_code,
                description,
                owner_user,
                max_cap,
                is_public,
                is_official
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `

        const [result] = await pool.query(query, [
            league_name,
            league_code,
            description ?? null,
            owner_user,
            max_cap ?? 100,
            is_public ?? true,
            is_official ?? false
        ])

        return result.insertId
    },

    update: async (id, {
        league_name,
        league_code,
        description,
        max_cap,
        is_public,
        is_active,
        is_official
    }) => {
        const query = `
            UPDATE fantasy_leagues
            SET
                league_name = ?,
                league_code = ?,
                description = ?,
                max_cap = ?,
                is_public = ?,
                is_active = ?,
                is_official = ?
            WHERE id = ?
        `

        const [result] = await pool.query(query, [
            league_name,
            league_code,
            description ?? null,
            max_cap ?? 100,
            is_public ?? true,
            is_active ?? true,
            is_official ?? false,
            id
        ])

        return result.affectedRows > 0
    },

    delete: async (id) => {
        const query = `DELETE FROM fantasy_leagues WHERE id = ?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows > 0
    }
}

module.exports = FantasyLeagueModel