const pool = require('../config/db')

const FantasyTeamModel = {
    getAll: async ({owner} = {})=>{
        let query = `SELECT * FROM fantasy_teams WHERE 1=1 `;
        const params = []

        if(owner) {
            query+= ` AND owner=?`
            params.push(owner)
        }

        const [rows] = await pool.query(query, params)
        return rows

    },
    getById: async (id)=>{
        const query = `SELECT * FROM fantasy_teams WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },
    create: async ({team_name, owner})=>{
        const query = `INSERT INTO fantasy_teams(team_name, owner)
                       VALUES(?, ?)`
        const [result] = await pool.query(query, [team_name, owner])
        return result.insertId
    },
    delete: async (id)=>{
        const query = `DELETE FROM fantasy_teams WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    },
    update: async (id, {team_name, owner, budget})=>{
        const query = `UPDATE fantasy_teams 
                       SET team_name=?, owner=?, budget=? 
                       WHERE id=?`
        const [result] = await pool.query(query, [team_name, owner, budget, id])
        return result.affectedRows>0
    },

}

module.exports = FantasyTeamModel