import {useState, useEffect} from "react"
import {
    getLeaguesByFantasyTeam,
    getMemberCount,
    getLeagueMembers
} from "../../services/fantasyLeagueMembershipService.js"

import FantasyLeagueModal from "../FantasyLeagueModal/FantasyLeagueModal.jsx"

import {useAuth} from "../../context/AuthContext.jsx";

const MyFantasyLeagueList = ({fantasyTeamId, teamCode, refreshTrigger}) => {
    const [myLeagues, setMyLeagues] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [selectedLeague, setSelectedLeague] = useState(null)
    const [leagueMembers, setLeagueMembers] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [modalError, setModalError] = useState(null)

    const {user, isLoggedIn} = useAuth()

    async function handleLeagueClick(league) {
        try {
            setSelectedLeague(league)
            setLeagueMembers([])
            setModalLoading(true)
            setModalError(null)

            const members = await getLeagueMembers({
                fantasy_league: league.id
            })

            setLeagueMembers(members)

        } catch (err) {
            setModalError(err.message)
        } finally {
            setModalLoading(false)
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (!fantasyTeamId) {
                setMyLeagues([])
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const leagueData = await getLeaguesByFantasyTeam({
                    fantasy_team: fantasyTeamId
                })

                const leaguesWithMemberCount = await Promise.all(
                    leagueData.map(async league => {
                        const data = await getMemberCount({
                            fantasy_league: league.id
                        })

                        return {
                            ...league,
                            member_count: data.member_count
                        }
                    })
                )

                setMyLeagues(leaguesWithMemberCount)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [fantasyTeamId, refreshTrigger])

    const filteredLeagues = myLeagues.filter(league =>
        league.league_name.toLowerCase().includes(teamCode.toLowerCase()) ||
        league.league_code?.toLowerCase().includes(teamCode.toLowerCase())
    )

    if (loading) return <p>Loading your fantasy leagues...</p>
    if (error) return <p>{error}</p>
    if (!fantasyTeamId) return <p>No fantasy team selected.</p>
    if (myLeagues.length === 0) return <p>You have not joined any leagues yet.</p>

    return (
        <div className="table-container">
            <table className="league-table">
                <thead>
                <tr>
                    <th>League</th>
                    <th>Founder</th>
                    <th>Members</th>
                    <th>Joined At</th>
                </tr>
                </thead>

                <tbody>
                {filteredLeagues.map(league => (
                    <tr
                        key={league.id}
                        onClick={() => handleLeagueClick(league)}
                    >
                        <td>
                            <div className="league-name-container">
                                {league.league_name}

                                {league.is_official ? (
                                    <span className="official-badge">✪ Official</span>
                                ) : (
                                    <span className="community-badge">🌐 Community</span>
                                )}
                            </div>
                        </td>

                        <td>{league.owner_username}</td>
                        <td>{league.member_count} / {league.max_cap}</td>
                        <td>{league.join_date ? league.join_date.slice(0, 10) : "Unknown"}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <FantasyLeagueModal
                league={selectedLeague}
                members={leagueMembers}
                loading={modalLoading}
                error={modalError}
                onClose={() => setSelectedLeague(null)}
            />
        </div>
    )
}

export default MyFantasyLeagueList