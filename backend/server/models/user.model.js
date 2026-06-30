const pool = require('../config/db')

const UserModel = {
    getAll: async()=>{
        const query = `SELECT id, email, username, birth_date, is_admin FROM users`
        const [rows] = await pool.query(query)
        return rows
    },
    getById: async(id)=>{
        const query = `SELECT id, email, username, birth_date, is_admin FROM users WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },
    getByEmail: async(email)=>{
        const query = `SELECT * FROM users WHERE email=?`
        const [rows] = await pool.query(query, [email])
        return rows[0]
    },
    create: async({email, username, password_hash, birth_date})=>{
        const query = `INSERT INTO users(email, username, password_hash, birth_date) 
                       VALUES(?, ?, ?, ?)`
        const [result] = await pool.query(query, [email, username, password_hash, birth_date])
        return result.insertId
    },
    delete: async(id)=>{
        const query = `DELETE FROM users WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    },
    update: async(id, {email, username, password_hash})=>{
        const query = `UPDATE users
                       SET email=?, username=?, password_hash=?
                       WHERE id=?`
        const [result] = await pool.query(query, [email, username, password_hash, id])
        return result.affectedRows>0
    },
    turnToAdmin: async(id)=>{
        const query = `UPDATE users SET is_admin=1 WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    }
}

module.exports = UserModel