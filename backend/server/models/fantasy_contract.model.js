const pool = require('../config/db')

const FantasyContractModel = {
    getAll: async({fantasy_team, fantasy_player, contract_role} = {})=>{
        let query = `SELECT * FROM fantasy_contracts WHERE 1=1 `
        const params = []

        if(fantasy_team){
            query += `AND fantasy_team=? `
            params.push(fantasy_team)
        }

        if(fantasy_player){
            query += `AND fantasy_player=? `
            params.push(fantasy_player)
        }

        if(contract_role){
            query += `AND contract_role=? `
            params.push(contract_role)
        }

        const [rows] = await pool.query(query, params)
        return rows
    },

    getById: async(id)=>{
        const query = `SELECT * FROM fantasy_contracts WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },

    create: async({fantasy_team, fantasy_player, contract_role, price})=>{
        const query = `INSERT INTO fantasy_contracts(fantasy_team, fantasy_player, contract_role, price)
                       VALUES(?, ?, ?, ?)`
        const [result] = await pool.query(query, [fantasy_team, fantasy_player, contract_role, price])
        return result.insertId
    },

    update: async(id, {fantasy_team, fantasy_player, contract_role, price})=>{
        const query = `UPDATE fantasy_contracts
                       SET fantasy_team=?, fantasy_player=?, contract_role=?, price=?
                       WHERE id=?`
        const [result] = await pool.query(query, [fantasy_team, fantasy_player, contract_role, price, id])
        return result.affectedRows>0
    },

    delete: async(id)=>{
        const query = `DELETE FROM fantasy_contracts WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    }
}

module.exports = FantasyContractModel