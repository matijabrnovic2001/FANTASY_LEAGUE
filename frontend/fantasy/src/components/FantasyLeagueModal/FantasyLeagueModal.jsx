import {useState} from "react"
import "./FantasyLeagueModal.css"

const FantasyLeagueModal = ({
                                league,
                                members,
                                loading,
                                error,
                                onClose
                            }) => {
    const [copied, setCopied] = useState(false)

    if (!league) return null

    async function handleCopyCode() {
        try {
            await navigator.clipboard.writeText(league.league_code)
            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 1200)
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <div className="league-modal-backdrop" onClick={onClose}>
            <div className="league-modal" onClick={(e) => e.stopPropagation()}>
                <div className="league-modal-header">
                    <div>
                        <div className="league-modal-title-row">
                            <h2>{league.league_name}</h2>

                            {league.is_official ? (
                                <span className="official-badge">✪ Official</span>
                            ) : (
                                <span className="community-badge">🌐 Community</span>
                            )}
                        </div>

                        <p>{league.description || "No league description provided."}</p>
                    </div>

                    <button className="league-modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="league-modal-info-grid">
                    <div className="league-modal-info-card">
                        <span>Founder</span>
                        <strong>{league.owner_username || league.owner_user}</strong>
                    </div>

                    <div className="league-modal-info-card">
                        <span>Members</span>
                        <strong>{league.member_count} / {league.max_cap}</strong>
                    </div>

                    <div
                        className="league-modal-info-card copy-code-card"
                        onClick={handleCopyCode}
                    >
                        <span>{copied ? "Copied!" : "League Code"}</span>
                        <strong>{league.league_code}</strong>
                    </div>

                    <div className="league-modal-info-card">
                        <span>Created At</span>
                        <strong>{league.created_at ? league.created_at.slice(0, 10) : "Unknown"}</strong>
                    </div>
                </div>

                <div className="league-modal-section-header">
                    <h3>Fantasy Teams</h3>
                </div>

                {loading && <p className="league-modal-status">Loading members...</p>}
                {error && <p className="league-modal-error">{error}</p>}

                {!loading && !error && members.length === 0 && (
                    <p className="league-modal-status">
                        No fantasy teams have joined this league yet.
                    </p>
                )}

                {!loading && !error && members.length > 0 && (
                    <table className="league-members-table">
                        <thead>
                        <tr>
                            <th>Fantasy Team</th>
                            <th>Owner</th>
                            <th>Joined</th>
                        </tr>
                        </thead>

                        <tbody>
                        {members.map(member => (
                            <tr key={member.fantasy_team}>
                                <td>{member.team_name}</td>
                                <td>{member.owner_username}</td>
                                <td>{member.join_date ? member.join_date.slice(0, 10) : "Unknown"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default FantasyLeagueModal