
const pool = require('../config/db')

const SeasonModel = {
    getAll: async ()=>{
        const query = `SELECT * FROM seasons`
        const [rows] = await pool.query(query)
        return rows
    },

    getById: async (id)=>{
        const query = `SELECT * FROM seasons
                       WHERE id=?`

        const [rows] = await pool.query(query, [id])
        return rows[0]
    },
    create: async ({szn_name, szn_year})=>{
        const query = `INSERT INTO seasons(szn_name, szn_year)
                       VALUES(?, ?)`
        const [result] = await pool.query(query, [szn_name, szn_year])
        return result.insertId
    }, 
    update: async (id, {szn_name, szn_year})=>{
        const query = `UPDATE seasons
                       SET szn_name=?, szn_year=?
                       WHERE id=?`
        const [result] = await pool.query(query, [szn_name, szn_year, id])
        return result.affectedRows>0
        
    },
    delete: async (id)=>{
        const query = `DELETE FROM seasons
                       WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    }

}

module.exports = SeasonModel