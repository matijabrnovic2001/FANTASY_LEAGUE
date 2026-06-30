const API_URL = "http://localhost:3001/api/auth"

export async function loginUser({email, password}) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    })

    const data = await response.json()
    if(!response.ok)
        throw new Error(data.error || "Login failed")

    return data

}

export async function registerUser({email, username, password, birth_date}) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, username, password, birth_date})
    })

    const data = await response.json()
    if(!response.ok)
        throw new Error(data.error || 'Registration failed')

    return data

}