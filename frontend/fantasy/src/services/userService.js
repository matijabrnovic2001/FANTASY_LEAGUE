const API_URL = "http://localhost:3001/api/users"

export async function getUserList(){
    const response = await fetch(`${API_URL}`)

    if(!response.ok){
        throw new Error("Can't fetch users")
    }

    return await response.json()
}