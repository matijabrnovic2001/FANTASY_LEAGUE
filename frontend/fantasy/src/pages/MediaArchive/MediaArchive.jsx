import { useEffect, useState } from "react"

import Navbar from "../../components/Navbar/Navbar.jsx"
import TitleCard from "../../components/TitleCard/TitleCard.jsx"
import MediaCard from "../../components/MediaCard/MediaCard.jsx"
import Footer from "../../components/Footer/Footer.jsx"

import { getAllImages } from "../../services/archiveImageService.js"

import "./MediaArchive.css"

const MediaArchive = () => {
    const [mediaList, setMediaList] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchMedia() {
            setLoading(true)
            setError(null)

            try {
                const imageData = await getAllImages()
                setMediaList(imageData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMedia()
    }, [])

    function getImageTitle(image) {
        return image.title
    }

    function getImagePath(image) {
        return image.image_path
    }

    function getImageTags(image) {
        if (!image.tags) {
            return []
        }

        return image.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean)
    }

    function handleImageClick(image) {
        setSelectedImage({
            path: getImagePath(image),
            title: getImageTitle(image),
            tags: getImageTags(image)
        })
    }

    return (
        <div className="page">
            <Navbar />
            <TitleCard title="Media archive" />

            <div className="page-main-content">
                {loading && <p className="media-archive-status">Loading media archive...</p>}

                {error && <p className="media-archive-error">{error}</p>}

                {!loading && !error && mediaList.length === 0 && (
                    <p className="media-archive-status">No archive images found.</p>
                )}

                {!loading && !error && mediaList.map(image => {
                    const path = getImagePath(image)
                    const title = getImageTitle(image)
                    const tags = getImageTags(image)

                    return (
                        <MediaCard
                            key={image.id}
                            path={path}
                            title={title}
                            tags={tags}
                            onClick={() => handleImageClick(image)}
                        />
                    )
                })}
            </div>

            {selectedImage && (
                <div
                    className="image-modal"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="image-modal-content"
                        onClick={event => event.stopPropagation()}
                    >
                        <button
                            className="image-modal-close"
                            onClick={() => setSelectedImage(null)}
                        >
                            ×
                        </button>

                        <img src={selectedImage.path} alt={selectedImage.title} />

                        <div className="image-modal-info">
                            <h3>{selectedImage.title}</h3>

                            <div className="selected-image-tags">
                                {selectedImage.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="media-card-tag"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default MediaArchive