const multer = require("multer")
const path = require("path")
const fs = require("fs")

const ArchiveImageModel = require("../models/archive_image.model")

const archivePath = path.join(__dirname, "../../../frontend/fantasy/public/archive")

function cleanValue(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")
}

function cleanTags(value) {
    return String(value || "")
        .split(",")
        .map(tag => cleanValue(tag))
        .filter(Boolean)
}

function generateFileName(tags) {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000)
    return `${randomNumber}-${tags.join("-")}.jpg`
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(archivePath, { recursive: true })
        cb(null, archivePath)
    },

    filename: (req, file, cb) => {
        const tags = cleanTags(req.body.tags)

        if (tags.length === 0) {
            return cb(new Error("At least one tag is required."))
        }

        let filename = generateFileName(tags)
        let filePath = path.join(archivePath, filename)

        while (fs.existsSync(filePath)) {
            filename = generateFileName(tags)
            filePath = path.join(archivePath, filename)
        }

        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "image/jpeg") {
        return cb(new Error("Only JPG images are allowed."))
    }

    cb(null, true)
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single("image")

const ArchiveImageController = {
    getAll: async (req, res) => {
        try {
            const images = await ArchiveImageModel.getAll()
            res.status(200).json(images)
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },

    getById: async (req, res) => {
        try {
            const image = await ArchiveImageModel.getById(req.params.id)

            if (!image) {
                return res.status(404).json({ message: "Image not found." })
            }

            res.status(200).json(image)
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },

    upload: async (req, res) => {
        upload(req, res, async err => {
            try {
                if (err) {
                    return res.status(400).json({ message: err.message })
                }

                if (!req.file) {
                    return res.status(400).json({ message: "Image is required." })
                }

                const league = cleanValue(req.body.league)
                const split_name = cleanValue(req.body.split_name)
                const year = cleanValue(req.body.year)
                const tagsArray = cleanTags(req.body.tags)

                if (!league || !split_name || !year || tagsArray.length === 0) {
                    fs.unlinkSync(req.file.path)

                    return res.status(400).json({
                        message: "League, split, year, and tags are required."
                    })
                }

                const image_path = `/archive/${req.file.filename}`
                const title = `${league} ${split_name} ${year}`
                const tags = tagsArray.join(",")

                const id = await ArchiveImageModel.create({
                    image_path,
                    title,
                    league,
                    split_name,
                    year,
                    tags
                })

                const image = await ArchiveImageModel.getById(id)

                res.status(201).json(image)
            } catch (err) {
                if (req.file?.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path)
                }

                res.status(500).json({ message: err.message })
            }
        })
    }
}

module.exports = ArchiveImageController