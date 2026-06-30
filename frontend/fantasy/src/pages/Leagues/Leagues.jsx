import Navbar from "../../components/Navbar/Navbar.jsx"
import TitleCard from "../../components/TitleCard/TitleCard.jsx"
import Footer from "../../components/Footer/Footer.jsx"
import FantasyLeagueList from "../../components/FantasyLeagueList/FantasyLeagueList.jsx"
import MyFantasyLeagueList from "../../components/MyFantasyLeagueList/MyFantasyLeagueList.jsx"

import {getFantasyTeam} from "../../services/fantasyRosterService.js"

import {useState, useEffect} from "react"
import {useAuth} from "../../context/AuthContext.jsx"
import CreateFantasyLeagueModal from "../../components/CreateFantasyLeagueModal/CreateFantasyLeagueModal.jsx";

import "./Leagues.css"

const Leagues = () => {
    const [activeTab, setActiveTab] = useState("public")
    const [teamCode, setTeamCode] = useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createdLeagueTrigger, setCreatedLeagueTrigger] = useState(0);

    const [userFantasyRoster, setUserFantasyRoster] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const {user, isLoggedIn, isAdmin} = useAuth()

    useEffect(() => {
        async function fetchData() {
            if (!isLoggedIn || !user?.id) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const rosterData = await getFantasyTeam({owner: user.id})
                setUserFantasyRoster(Array.isArray(rosterData) ? rosterData[0] : rosterData)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user, isLoggedIn])

    const handleLeagueCreated = () => {
        setCreatedLeagueTrigger(prev => prev + 1);
    };

    if (loading) return <p>Loading Fantasy Leagues ...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="page">
            <Navbar />
            <TitleCard title="Leagues" />

            <div className="main-content">
                <div className="league-tabs">
                    <button
                        className={"filter-button " + (activeTab === "my" ? "active-tab" : "")}
                        onClick={() => setActiveTab("my")}
                    >
                        My Leagues
                    </button>

                    <button
                        className={"filter-button " + (activeTab === "public" ? "active-tab" : "")}
                        onClick={() => setActiveTab("public")}
                    >
                        Browse Leagues
                    </button>

                    <input
                        type="text"
                        value={teamCode}
                        onChange={(e)=>setTeamCode(e.target.value)}
                        placeholder="🔍 Find by Team Code . . ."
                    />

                    <button
                        className="filter-button create-league-button"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create League
                    </button>
                </div>

                {activeTab === "my" ? (
                    <MyFantasyLeagueList
                        fantasyTeamId={userFantasyRoster?.id}
                        teamCode={teamCode}
                        refreshTrigger={createdLeagueTrigger}
                    />
                ) : (
                    <FantasyLeagueList
                        roster={userFantasyRoster}
                        teamCode={teamCode}
                        refreshTrigger={createdLeagueTrigger}
                    />
                )}
            </div>

            {isCreateModalOpen && (
                <CreateFantasyLeagueModal
                    roster={userFantasyRoster}
                    onClose={() => setIsCreateModalOpen(false)}
                    onLeagueCreated={handleLeagueCreated}
                />
            )}

            <Footer />
        </div>
    )
}

export default Leagues