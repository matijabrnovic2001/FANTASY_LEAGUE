import { useState } from "react"
import { uploadArchiveImage } from "../../services/archiveImageService.js"

import "./ImportAdminPanel.css"

const ImportAdminPanel = () => {
    const [league, setLeague] = useState("")
    const [splitName, setSplitName] = useState("")
    const [year, setYear] = useState("")
    const [tags, setTags] = useState("")
    const [image, setImage] = useState(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()

        if (!image) {
            setError("Image is required.")
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const uploadedImage = await uploadArchiveImage({
                league,
                split_name: splitName,
                year,
                tags,
                image
            })

            setSuccess(`Uploaded ${uploadedImage.image_path}`)
            setLeague("")
            setSplitName("")
            setYear("")
            setTags("")
            setImage(null)
            e.target.reset()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="mod-import-form" onSubmit={handleSubmit}>
            <div className="mod-import-header">
                <div>
                    <h3>Import Image</h3>
                    <p>Upload a JPG image into the media archive.</p>
                </div>

                <button
                    type="submit"
                    className="mod-panel-action-button"
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload Image"}
                </button>
            </div>

            <div className="mod-import-body">
                <div className="mod-import-grid">
                    <label>
                        <span>League</span>
                        <input
                            value={league}
                            onChange={e => setLeague(e.target.value)}
                            placeholder="LEC"
                            required
                        />
                    </label>

                    <label>
                        <span>Split</span>
                        <input
                            value={splitName}
                            onChange={e => setSplitName(e.target.value)}
                            placeholder="Spring"
                            required
                        />
                    </label>

                    <label>
                        <span>Year</span>
                        <input
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            placeholder="2025"
                            required
                        />
                    </label>

                    <label>
                        <span>Tags</span>
                        <input
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            placeholder="Caps, G2, Stage"
                            required
                        />
                    </label>
                </div>

                <label className="mod-import-file">
                    <span>Image</span>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,image/jpeg"
                        onChange={e => setImage(e.target.files?.[0] || null)}
                        required
                    />
                </label>
            </div>

            {(error || success) && (
                <div className="mod-import-message-row">
                    {error && <p className="mod-panel-error">{error}</p>}
                    {success && <p className="mod-panel-success">{success}</p>}
                </div>
            )}
        </form>
    )
}

export default ImportAdminPanel