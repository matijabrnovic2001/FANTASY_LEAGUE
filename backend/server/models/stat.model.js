const pool = require('../config/db')

const StatModel = {
    getAll: async({player, for_match}={})=>{
        let query = `SELECT * FROM stats WHERE 1=1`;
        const params = []

        if(player){
            query+=` AND player=? `
            params.push(player)
        }
        if(for_match){
            query+=` AND for_match=? `
            params.push(for_match)
        }

        const [rows] = await pool.query(query, params)
        return rows
    },
    getById: async(id)=>{
        const query = `SELECT * FROM stats WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },
    create: async({player, for_match, kills, deaths, assists, farm, obj})=>{
        const query = `INSERT INTO stats(player, for_match, kills, deaths, assists, farm, obj)
                       VALUES(?, ?, ?, ?, ?, ?, ?)`
        const [result] = await pool.query(query, [player, for_match, kills, deaths, assists, farm, obj])
        return result.insertId
    },
    delete: async(id)=>{
        const query = `DELETE FROM stats WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    },
    update: async(id,{player, for_match, kills, deaths, assists, farm, obj})=>{
        const query = `UPDATE stats SET
                       player=?, for_match=?, kills=?, deaths=?, assists=?, farm=?, obj=?
                       WHERE id=?`
        const [result] = await pool.query(query, [player, for_match, kills, deaths, assists, farm, obj, id])
        return result.affectedRows>0
    },
 



}

module.exports = StatModel