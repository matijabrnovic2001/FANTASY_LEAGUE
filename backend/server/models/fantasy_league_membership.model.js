const pool = require('../config/db')

const FantasyLeagueMembershipModel = {
    getAll: async ({fantasy_team, fantasy_league} = {}) => {
        let query = `SELECT * FROM fantasy_teams_leagues WHERE 1=1 `
        const params = []

        if (fantasy_team) {
            query += `AND fantasy_team = ? `
            params.push(fantasy_team)
        }

        if (fantasy_league) {
            query += `AND fantasy_league = ? `
            params.push(fantasy_league)
        }

        const [rows] = await pool.query(query, params)
        return rows
    },

    create: async ({fantasy_team, fantasy_league}) => {
        const query = `
            INSERT INTO fantasy_teams_leagues(
                fantasy_team,
                fantasy_league
            )
            VALUES (?, ?)
        `

        const [result] = await pool.query(query, [
            fantasy_team,
            fantasy_league
        ])

        return result.affectedRows > 0
    },

    delete: async ({fantasy_team, fantasy_league}) => {
        const query = `
            DELETE FROM fantasy_teams_leagues
            WHERE fantasy_team = ?
            AND fantasy_league = ?
        `

        const [result] = await pool.query(query, [
            fantasy_team,
            fantasy_league
        ])

        return result.affectedRows > 0
    },

    countByLeague: async ({fantasy_league}) => {
        const query = `
            SELECT COUNT(*) AS member_count
            FROM fantasy_teams_leagues
            WHERE fantasy_league = ?
        `

        const [rows] = await pool.query(query, [fantasy_league])
        return rows[0].member_count
    },

    isMember: async ({fantasy_team, fantasy_league}) => {
        const query = `
            SELECT 1
            FROM fantasy_teams_leagues
            WHERE fantasy_team = ?
            AND fantasy_league = ?
        `

        const [rows] = await pool.query(query, [
            fantasy_team,
            fantasy_league
        ])

        return rows.length > 0
    },

    getLeaguesByFantasyTeam: async ({fantasy_team}) => {
        const query = `
            SELECT
                fl.*,
                ftl.join_date,
                u.username AS owner_username
            FROM fantasy_teams_leagues ftl
            JOIN fantasy_leagues fl
                ON ftl.fantasy_league = fl.id
            JOIN users u
                ON fl.owner_user = u.id
            WHERE ftl.fantasy_team = ?
            AND fl.is_active = TRUE
        `

        const [rows] = await pool.query(query, [fantasy_team])
        return rows
    },

    getMembersByLeague: async ({fantasy_league}) => {
        const query = `
            SELECT
                ftl.fantasy_team,
                ftl.fantasy_league,
                ftl.join_date,
                ft.team_name,
                ft.owner,
                u.username AS owner_username
            FROM fantasy_teams_leagues ftl
            JOIN fantasy_teams ft
                ON ftl.fantasy_team = ft.id
            JOIN users u
                ON ft.owner = u.id
            WHERE ftl.fantasy_league = ?
        `

        const [rows] = await pool.query(query, [fantasy_league])
        return rows
    }
}

module.exports = FantasyLeagueMembershipModel