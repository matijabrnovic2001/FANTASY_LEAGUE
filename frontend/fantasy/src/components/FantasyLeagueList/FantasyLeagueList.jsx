import {getPublicFantasyLeagues} from "../../services/fantasyLeagueService.js"
import {
    getMemberCount,
    getLeagueMembers,
    isFantasyTeamMember,
    joinFantasyLeague,
    leaveFantasyLeague
} from "../../services/fantasyLeagueMembershipService.js"

import FantasyLeagueModal from "../FantasyLeagueModal/FantasyLeagueModal.jsx"

import {useState, useEffect} from "react"

import "./FantasyLeagueList.css"

const FantasyLeagueList = ({roster, teamCode, refreshTrigger}) => {
    const [publicLeagues, setPublicLeagues] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [selectedLeague, setSelectedLeague] = useState(null)
    const [leagueMembers, setLeagueMembers] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [modalError, setModalError] = useState(null)

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

    async function handleMembershipClick(e, league) {
        e.stopPropagation()

        if (!roster?.id) {
            setError("You need a fantasy team before joining leagues.")
            return
        }

        try {
            setError(null)

            if (league.is_member) {
                await leaveFantasyLeague({
                    fantasy_team: roster.id,
                    fantasy_league: league.id
                })

                setPublicLeagues(prev =>
                    prev.map(item =>
                        item.id === league.id
                            ? {
                                ...item,
                                is_member: false,
                                member_count: Math.max(0, item.member_count - 1)
                            }
                            : item
                    )
                )

                return
            }

            await joinFantasyLeague({
                fantasy_team: roster.id,
                fantasy_league: league.id
            })

            setPublicLeagues(prev =>
                prev.map(item =>
                    item.id === league.id
                        ? {
                            ...item,
                            is_member: true,
                            member_count: item.member_count + 1
                        }
                        : item
                )
            )

        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                setError(null)

                const publicLeagueData = await getPublicFantasyLeagues()

                const publicLeagueWithData = await Promise.all(
                    publicLeagueData.map(async league => {
                        const countData = await getMemberCount({
                            fantasy_league: league.id
                        })

                        let isMember = false

                        if (roster?.id) {
                            const memberData = await isFantasyTeamMember({
                                fantasy_team: roster.id,
                                fantasy_league: league.id
                            })

                            isMember = memberData.is_member
                        }

                        return {
                            ...league,
                            member_count: countData.member_count,
                            is_member: isMember
                        }
                    })
                )

                setPublicLeagues(publicLeagueWithData)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [roster, refreshTrigger])


    const filteredLeagues = publicLeagues.filter(league =>
        league.league_code?.toLowerCase().includes(teamCode.toLowerCase())
    )

    if (loading) return <p>Loading Fantasy Leagues ...</p>
    if (error) return <p>{error}</p>
    if (publicLeagues.length === 0) return <p>No public leagues found.</p>

    return (
        <div className="table-container">
            <table className="league-table">
                <thead>
                <tr>
                    <th>League</th>
                    <th>Founder</th>
                    <th>Members</th>
                    <th>Created At</th>
                    <th>Action</th>
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
                        <td>{league.created_at ? league.created_at.slice(0, 10) : "Unknown"}</td>

                        <td>
                            <button
                                onClick={(e) => handleMembershipClick(e, league)}
                                className={`filter-button ${league.is_member ? "leave-button" : "join-button"}`}
                            >
                                {league.is_member ? "Leave" : "Join"}
                            </button>
                        </td>
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

export default FantasyLeagueList