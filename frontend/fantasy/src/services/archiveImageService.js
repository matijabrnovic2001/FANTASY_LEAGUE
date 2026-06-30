const API_URL = "http://localhost:3001/api/images"

export async function getAllImages() {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error("Can't fetch images")
    }

    const data = await response.json()
    console.log(data)

    return await data
}

export async function uploadArchiveImage({ league, split_name, year, tags, image }) {
    const token = localStorage.getItem("token")

    const formData = new FormData()
    formData.append("league", league)
    formData.append("split_name", split_name)
    formData.append("year", year)
    formData.append("tags", tags)
    formData.append("image", image)

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Can't upload archive image")
    }

    return data
}