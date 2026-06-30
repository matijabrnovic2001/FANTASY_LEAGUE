const pool = require('../config/db')

const MatchModel = {
    getAll: async({season, region, team, limit} = {})=>{
        let query = `SELECT * FROM matches WHERE 1=1 `
        const params = []

        if(season){
            query += `AND season=? `
            params.push(season)
        }

        if(region){
            query += `AND region=? `
            params.push(region)
        }

        if(team){
            query += `AND (home_team=? OR away_team=?) `
            params.push(team, team)
        }

        query+=` ORDER BY date_played DESC `

        if(limit){
            query+=` LIMIT ?`
            params.push(Number(limit))
        }

        const [rows] = await pool.query(query, params)
        return rows
    },

    getById: async(id)=>{
        const query = `SELECT * FROM matches WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },

    create: async({home_team, away_team, season, region, date_played, home_team_wins, away_team_wins, match_format})=>{
        const query = `INSERT INTO matches(
                           home_team, away_team, season, region, date_played,
                           home_team_wins, away_team_wins, match_format
                       )
                       VALUES(?, ?, ?, ?, ?, ?, ?, ?)`

        const [result] = await pool.query(query, [
            home_team,
            away_team,
            season,
            region,
            date_played,
            home_team_wins,
            away_team_wins,
            match_format
        ])

        return result.insertId
    },

    delete: async(id)=>{
        const query = `DELETE FROM matches WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows > 0
    },

    update: async(id, {home_team, away_team, season, region, date_played, home_team_wins, away_team_wins, match_format})=>{
        const query = `UPDATE matches
                       SET home_team=?, away_team=?, season=?, region=?, date_played=?,
                           home_team_wins=?, away_team_wins=?, match_format=?
                           
                       WHERE id=?`

        const [result] = await pool.query(query, [
            home_team,
            away_team,
            season,
            region,
            date_played,
            home_team_wins,
            away_team_wins,
            match_format,
            id
        ])

        return result.affectedRows > 0
    },
    getMatchesWithTeamInfo: async({season, region})=>{
        const query = `
            SELECT 
                m.id,
                m.season,
                m.region,
                m.date_played,
                m.home_team_wins,
                m.away_team_wins,
                m.match_format,

                t1.id AS home_team_id,
                t1.team_name AS home_team_name,
                t1.team_code AS home_team_code,

                t2.id AS away_team_id,
                t2.team_name AS away_team_name,
                t2.team_code AS away_team_code

            FROM matches m 
            INNER JOIN teams t1 
            ON m.home_team = t1.id
            INNER JOIN teams t2 
            ON m.away_team = t2.id
            WHERE m.season=? AND m.region=?

            ORDER BY m.date_played ASC
        `

        const [rows] = await pool.query(query, [season, region])
        return rows
    },


    getForm: async ({ team, season, region, limit }) => {
        const query = `
            SELECT id, 
            CASE
                WHEN home_team = ? AND home_team_wins > away_team_wins THEN 1
                WHEN away_team = ? AND away_team_wins > home_team_wins THEN 1
                ELSE 0
            END AS result
            FROM matches 
            WHERE (home_team = ? OR away_team = ?)
            AND season = ?
            AND region = ?

            ORDER BY date_played DESC
            LIMIT ?
        `
    
        const [rows] = await pool.query(query, [
            team,
            team,
            team,
            team,
            season,
            region,
            limit
        ])
    
        return rows
    }

}

module.exports = MatchModel