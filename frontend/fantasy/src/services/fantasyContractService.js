const API_URL = "http://localhost:3001/api/fantasy-contracts"

export async function getFantasyContracts({fantasy_team}) {
    const response = await fetch(`${API_URL}?fantasy_team=${fantasy_team}`)
    if(!response.ok){
        throw new Error("Can't fetch fantasy contracts")
    }

    return await response.json()
}

export async function createFantasyContract(contract) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contract)
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create fantasy contract.")
    }

    return await response.json()
}