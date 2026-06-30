const pool = require("../config/db")

const ArchiveImageModel = {
    getAll: async()=>{
        const query = `
            SELECT * FROM archive_images
        `

        const [rows] = await pool.query(query)
        return rows
    },
    getById: async(id)=> {
        const query = `
            SELECT * FROM archive_images
            WHERE id=?
        `

        const [rows] = await pool.query(query, [id])
        return rows[0]
    },
    create: async ({ image_path, title, league, split_name, year, tags }) => {
        const query = `
            INSERT INTO archive_images
            (image_path, title, league, split_name, year, tags)
            VALUES (?, ?, ?, ?, ?, ?)
        `
        const [result] = await pool.query(query, [image_path, title, league, split_name, year, tags])
        return result.insertId
    }



}

module.exports = ArchiveImageModel