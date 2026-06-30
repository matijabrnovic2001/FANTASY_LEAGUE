const pool = require('../config/db')

const RoleModel = {
    getAll: async ()=>{
        const query = `SELECT * FROM roles`
        const [rows] = await pool.query(query)
        
        return rows
    },

    getById: async(id)=>{
        const query = `SELECT * FROM roles WHERE id=?` 
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },

    getByCode: async(roleCode)=>{
        const query = `SELECT * FROM roles WHERE role_code=?`
        const [rows]= await pool.query(query, [roleCode])
        return rows[0]
    },


    create: async({role_code, role_name})=>{
        const query = `INSERT INTO roles(role_code, role_name)
                       VALUES(?, ?)`
        const [result] = await pool.query(query, [role_code, role_name])
        return result.insertId
    },


    delete: async(id)=>{
        const query = `DELETE FROM roles WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    },



}

module.exports = RoleModel