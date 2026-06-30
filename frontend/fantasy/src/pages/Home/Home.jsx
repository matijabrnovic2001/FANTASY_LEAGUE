import Navbar from "../../components/Navbar/Navbar.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import { Link } from "react-router-dom"

import "./Home.css"

import {useState, useEffect} from "react";

import {getUserList} from "../../services/userService.js";
import {getMatchesWithTeamInfo} from "../../services/matchService.js";
import {useAuth} from "../../context/AuthContext.jsx";

const Home = () => {
    const [users, setUsers] = useState([])
    const [matches, setMatches] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const {user, isLoggedIn} = useAuth()

    useEffect(()=>{
        async function fetchData(){
            setError(null)
            setLoading(true)

            try {
                const [userData, matchData] = await Promise.all([
                        getUserList(),
                        getMatchesWithTeamInfo({season:3, region:3})
                ])
                setUsers(userData)
                setMatches(matchData)
            }catch (err){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()


    }, [])

    if (loading) return <p>Loading roster...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="page">
            <Navbar />

            <main className="home-page">
                <section className="home-hero">
                    <div className="home-hero-content">
                        <span className="home-eyebrow">Fantasy League Platform</span>

                        <h1>Build your ideal League of Legends roster.</h1>

                        <p>
                            Compare players, follow match results, track standings,
                            and create a fantasy team based on role-specific scoring.
                        </p>

                        <div className="home-hero-actions">
                            <Link to={isLoggedIn ? "/fantasy/roster" : "/auth"} className="home-primary-btn">
                                Create Roster
                            </Link>

                            <Link to="/players" className="home-secondary-btn">
                                View Players
                            </Link>
                        </div>
                    </div>

                    <div className="home-hero-panel">
                        <div className="home-panel-stat">
                            <span>Users</span>
                            <strong>{users.length}</strong>
                        </div>

                        <div className="home-panel-stat">
                            <span>Teams</span>
                            <strong>10</strong>
                        </div>

                        <div className="home-panel-stat">
                            <span>Matches</span>
                            <strong>{matches.length}</strong>
                        </div>
                    </div>
                </section>

                <section className="home-features">
                    <article className="home-feature-card">
                        <h2>Player Analytics</h2>
                        <p>
                            We track everything that the players do in game ...
                            Worried about a support having low points because of no farm?
                            Don't worry, we grade everything according to the role they play!
                        </p>
                    </article>

                    <article className="home-feature-card">
                        <h2>Fantasy Roster</h2>
                        <p>
                            Build your dream roster! You love Caps? He's yours to recruit,
                            but at a steep price ..
                        </p>
                    </article>

                    <article className="home-feature-card">
                        <h2>Team Standings</h2>
                        <p>
                            Who needs sofaScore, we do it better!
                        </p>
                    </article>

                    <article className="home-feature-card">
                        <h2>Match History</h2>
                        <p>
                            See the complete match archives of the
                            entire LoL Esports ecosystem!
                        </p>
                    </article>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Home