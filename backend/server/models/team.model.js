const pool = require('../config/db')

const TeamModel = {
    getAll: async({region}={})=>{
        let query = `
            SELECT * 
            FROM teams 
            WHERE 1=1 
        `
        let params = []

        if(region){
            query+= ` AND region=?`
            params.push(region)
        }

        console.log(query, params)

        const [rows] = await pool.query(query, params)
        return rows
    },
    getById: async(id)=>{
        const query = `SELECT * FROM teams WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },
    delete: async(id)=>{
        const query = `DELETE FROM teams WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    },
    create: async({team_name, team_code, region})=>{
        const query = `INSERT INTO teams(team_name, team_code, region)
                       VALUES(?, ?, ?)`
        const [result] = await pool.query(query, [team_name, team_code, region])
        return result.insertId
    },
    update: async(id, {team_name, team_code, region})=>{
        const query = `UPDATE teams
                       SET team_name=?, team_code=?, region=?
                       WHERE id=?`
        const [result] = await pool.query(query, [team_name, team_code, region, id])
        return result.affectedRows>0

    },
    getStandings: async({season, region})=>{
        const query = 
        `
            SELECT  t.id, t.team_code, t.region,
            COUNT(*) AS played_matches,
            SUM(
                CASE 
                    WHEN m.home_team = t.id AND m.home_team_wins > m.away_team_wins THEN 1
                    WHEN m.away_team = t.id AND m.away_team_wins > m.home_team_wins THEN 1
                    ELSE 0
                END
            ) AS wins,
            SUM(
                CASE 
                    WHEN m.home_team = t.id AND m.home_team_wins < m.away_team_wins THEN 1
                    WHEN m.away_team = t.id AND m.away_team_wins < m.home_team_wins THEN 1
                    ELSE 0
                END
            ) AS losses
            FROM teams t
            INNER JOIN matches m 
            ON t.id = m.home_team OR t.id = m.away_team
            WHERE m.season = ? AND m.region = ?
            GROUP BY t.id, t.team_code, t.region
            ORDER BY wins DESC, losses ASC
        `
        const [rows] = await pool.query(query, [season, region])
        return rows;
    },
    getRoster: async(team_id)=>{
        const query = `
        SELECT 
            p.id AS player_id,
            p.player_ign, 
            c.role_id,
            t.team_code

        FROM players p 
        INNER JOIN contracts c 
            ON p.id=c.player
        INNER JOIN teams t
            ON c.team=t.id

        WHERE c.is_active=1 AND t.id=?;
        `

        const [rows] = await pool.query(query, [team_id])
        return rows;

    }
}

module.exports = TeamModel