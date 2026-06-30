const pool = require('../config/db')

const PlayerModel = {
    //parametrizovan query jer cu vjerovatno htjeti filtrirati igrace 
    getAll: async ({player_role, residency, search})=>{
        let query = `SELECT * FROM players WHERE 1=1 ` //chatgpt-ova genijalna ideja -> ' WHERE 1=1 '
        let params = []

        if(player_role) {
            query+= `AND player_role=? `
            params.push(player_role)
        }

        if(residency){
            query+=` AND residency=? `
            params.push(residency)
        }

        if(search){
            query+=` AND ( player_ign LIKE ? OR full_name LIKE ? ) `
            params.push(`%${search}%`)
            params.push(`%${search}%`)
        }

        const [rows] = await pool.query(query, params)
        return rows


    },
    getById: async (id)=>{
        const query = `SELECT * FROM players WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]

    },
    create: async ({player_ign, full_name, birth_date, residency, player_role, fantasy_price})=>{
        const query = `INSERT INTO 
                       players(player_ign, full_name, birth_date, residency, player_role, fantasy_price)
                       VALUES(?, ?, ?, ?, ?, ?)`

        fantasy_price = fantasy_price ?? 3000
        const [result] = await pool.query(query, [
                player_ign, 
                full_name, 
                birth_date, 
                residency, 
                player_role, 
                fantasy_price
            ])
        return result.insertId
    },
    delete: async (id)=>{
        const query = `DELETE FROM players WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0

    },
    update: async (id, {player_ign, full_name, birth_date, residency, player_role, fantasy_price})=>{
        const query = `UPDATE players SET 
                       player_ign=?, 
                       full_name=?, 
                       birth_date=?, 
                       residency=?, 
                       player_role=?, 
                       fantasy_price=? 
                       WHERE id=?`
        const [result] = await pool.query(query, [player_ign, full_name, birth_date, residency, player_role, fantasy_price, id])
        return result.affectedRows>0
    },
    getPlayerStats: async({season})=>{
        const query = `
        SELECT
            p.id,
            p.player_ign,
            p.full_name,
            p.birth_date,
            p.residency,
            p.player_role,
            p.fantasy_price,

            t.id AS team_id,
            t.team_name,
            t.team_code,

            COUNT(s.id) AS matches_played,

            SUM(s.kills) AS total_kills,
            SUM(s.deaths) AS total_deaths,
            SUM(s.assists) AS total_assists,
            SUM(s.farm) AS total_farm,
            SUM(s.obj) AS total_obj,

            SUM(
                s.kills * r.kills_val +
                s.deaths * r.deaths_val +
                s.assists * r.assists_val +
                s.farm * r.farm_val +
                s.obj * r.obj_val
            ) AS fantasy_points

        FROM players p

        INNER JOIN contracts c
        ON p.id = c.player
        AND c.is_active = 1

        INNER JOIN teams t
        ON c.team = t.id

        INNER JOIN stats s
        ON p.id = s.player

        INNER JOIN matches m
        ON s.for_match = m.id

        INNER JOIN scoring_rules r
        ON p.player_role = r.role_id

        WHERE m.season = ?

        GROUP BY
            p.id,
            p.player_ign,
            p.full_name,
            p.birth_date,
            p.residency,
            p.player_role,
            p.fantasy_price,
            t.id,
            t.team_name,
            t.team_code
        `
    

    const [rows] = await pool.query(query, [season])
    return rows

    }
}

module.exports = PlayerModel