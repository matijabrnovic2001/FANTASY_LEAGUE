const API_URL = 'http://localhost:3001/api/regions'

export async function getRegions() {
    const response = await fetch(API_URL)
    if(!response.ok)
        throw new Error("Can't fetch seasons!")

    return await response.json()
}