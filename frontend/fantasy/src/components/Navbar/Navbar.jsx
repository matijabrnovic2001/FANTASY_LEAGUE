import logo from '../../assets/site_logo.png'
import NavbarElement from "./NavbarElement.jsx";
import ModPanelModal from "../ModPanelModal/ModPanelModal.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

import './Navbar.css'
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const { isLoggedIn, isAdmin, user, logout} = useAuth()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isFantasyMenuOpen, setIsFantasyMenuOpen] = useState(false)
    const [isModPanelOpen, setIsModPanelOpen] = useState(false)

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        setIsMenuOpen(false)
        navigate("/")
    }

    return (
        <div className='navbar-container'>

            <div
                className="navbar-logo"
                onClick={() => navigate("/")}
            >
                <img src={logo} alt="app logo" />
            </div>

            <div className='navbar-links'>

                {isLoggedIn && (<div className="fantasy-menu">
                    <button
                        type="button"
                        className="navbar-link fantasy-menu-trigger"
                        onClick={() => setIsFantasyMenuOpen(!isFantasyMenuOpen)}
                    >
                        Fantasy ▾
                    </button>

                    {isFantasyMenuOpen && (
                        <div className="fantasy-dropdown">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFantasyMenuOpen(false)
                                    navigate("/fantasy/leagues")
                                }}
                            >
                                Leagues
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsFantasyMenuOpen(false)
                                    navigate("/fantasy/roster")
                                }}
                            >
                                My Roster
                            </button>
                        </div>
                    )}
                </div>)}

                <NavbarElement content={'Standings'} destinationUrl={'/standings'} />
                <NavbarElement content={'Matches'} destinationUrl={'/matches'}/>
                <NavbarElement content={'Players'} destinationUrl={'/players'}/>
                <NavbarElement content={'Media Archive'} destinationUrl={'/media_archive'}/>
                {isAdmin && (
                    <button
                        onClick={() => setIsModPanelOpen(true)}
                        className="navbar-mod-panel-button"
                    >
                        Mod Panel
                    </button>
                )}

                {isModPanelOpen && (
                    <ModPanelModal onClose={() => setIsModPanelOpen(false)} />
                )}


            </div>

            <div className="navbar-auth">
                {isLoggedIn ? (
                    <div className='user-menu'>
                        <button
                            type='button'
                            className='open-menu-btn'
                            onClick={()=>setIsMenuOpen(!isMenuOpen)}
                        >
                            {user.username}
                        </button>

                        {isMenuOpen && (
                            <div className='user-menu-dropdown'>
                                <button
                                    type='button'
                                    onClick={()=> {
                                        setIsMenuOpen(false)
                                        navigate("/profile")
                                    }}
                                >
                                    Profile
                                </button>

                                <button
                                    type='button'
                                    onClick={()=>{
                                        setIsMenuOpen(false)
                                        navigate("/settings")
                                    }}
                                >
                                    Settings
                                </button>

                                <button
                                    type='button'
                                    onClick={handleLogout}
                                    className='logout-option'
                                >
                                    Log Out
                                </button>


                            </div>
                        )}

                    </div>
                ) : (
                    <NavbarElement content="Log In" destinationUrl="/auth" />
                )}
            </div>

        </div>

    )
}

export default Navbar