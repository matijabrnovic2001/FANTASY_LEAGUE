import {createContext, useState, useContext} from "react";

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(()=> localStorage.getItem("token"))


    const [user, setUser] = useState(()=>{
            const storedUser = localStorage.getItem("user")
            return storedUser ? JSON.parse(storedUser) : null
    })

    const login = (data) => {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setToken(data.token)
        setUser(data.user)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        setToken(null)
        setUser(null)
    }

    const isLoggedIn = !!token
    const isAdmin = user?.is_admin === true


    return (
        <AuthContext.Provider value={{
            token,
            user,
            isLoggedIn,
            isAdmin,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}