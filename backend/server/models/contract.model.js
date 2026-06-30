const pool = require('../config/db')

const ContractModel = {
    getAll: async({player, team, is_active} = {})=>{
        let query = `SELECT * FROM contracts WHERE 1=1 `
        const params = []

        if(player){
            query+= ` AND player=?`
            params.push(player)
        }

        if(team) {
            query+= ` AND team=?`
            params.push(team)
        }

        if(is_active!==undefined){
            query+=` AND is_active=?`
            params.push(is_active)
        }

        const [rows] = await pool.query(query, params)
        return rows

    },
    getById: async(id)=>{
        const query = `SELECT * FROM contracts WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },
    create: async ({player, team, role_id, sign_date, expiration_date, contract_value, is_active})=>{
        const query = `INSERT INTO contracts(player, team, role_id, sign_date, expiration_date, contract_value, is_active)
                       VALUES(?, ?, ?, ?, ?, ?, ?)`

        const [result] = await pool.query(query, [
                player, 
                team, 
                role_id, 
                sign_date, 
                expiration_date, 
                contract_value, 
                is_active
        ])

        return result.insertId
    },
    update: async(id, {player, team, role_id, sign_date, expiration_date, contract_value, is_active})=>{
        const query = `UPDATE contracts
                       SET player=?, team=?, role_id=?, sign_date=?, expiration_date=?, contract_value=?, is_active=?
                       WHERE id=?`
        const [result] = await pool.query(query, [
                player, 
                team, 
                role_id, 
                sign_date, 
                expiration_date, 
                contract_value, 
                is_active,
                id
        ])

        return result.affectedRows>0

    },
    delete: async (id)=>{
        const query = `DELETE FROM contracts
                       WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    },
    deactivateContract: async (id)=>{
        const query = `UPDATE contracts SET is_active=false WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    }







}

module.exports = ContractModel