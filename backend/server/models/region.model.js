const pool = require('../config/db');

const RegionModel = {
    getAll: async()=>{
        const query = `SELECT * FROM regions`
        const [rows] = await pool.query(query)
        return rows
    },
    getById: async(id)=>{
        const query = `SELECT * FROM regions WHERE id=?`
        const [rows] = await pool.query(query, [id])
        return rows[0]
    },
    create: async({region_name, region_code})=>{
        const query = `INSERT INTO regions(region_name, region_code)
                       VALUES(?, ?)`
        const [result] = await pool.query(query, [region_name, region_code])
        return result.insertId;
    },
    delete: async(id)=>{
        const query = `DELETE FROM regions
                       WHERE id=?`
        const [result] = await pool.query(query, [id])
        return result.affectedRows>0
    },
    update: async(id, {region_name, region_code})=>{
        const query = `UPDATE regions
                       SET region_name=?, region_code=?
                       WHERE id=?`
        const [result] = await pool.query(query, [region_name, region_code, id])
        return result.affectedRows>0
    },

}

module.exports = RegionModel;