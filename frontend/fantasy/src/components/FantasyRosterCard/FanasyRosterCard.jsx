import minimap from "../../assets/minimap.png"
import "./FantasyRosterCard.css"

const FantasyRosterCard = ({
                               selectedRole,
                               setSelectedRole,
                               fantasyTeam,
                               contracts = [],
                               contractQueue = [],
                               remainingBudget,
                               totalBudget,
                               onSubmitRoster,
                               submitting
}) => {
    const totalPoints = contracts.reduce((sum, contract) => {
        return sum + Number(contract.player.fantasy_points)
    }, 0)


    function getPlayerByRole(roleId) {
        const signedContract = contracts.find(contract =>
            Number(contract.contract_role) === Number(roleId)
        )

        if (signedContract?.player) {
            return signedContract.player
        }

        const queuedContract = contractQueue.find(contract =>
            Number(contract.contract_role) === Number(roleId)
        )

        return queuedContract?.player
    }

    function handleRoleClick(roleId) {
        setSelectedRole(Number(selectedRole) === Number(roleId) ? "all" : roleId)
    }

    function renderSlot(roleId, roleCode, className) {
        const player = getPlayerByRole(roleId)

        return (
            <button
                className={`roster-slot ${className} ${player ? "filled" : ""}`}
                onClick={() => handleRoleClick(roleId)}
            >
                {player ? (
                    <>
                        <img
                            src={`/player_portraits/${player.player_ign}.png`}
                            alt={player.player_ign}
                        />
                        <span>{player.player_ign}</span>
                    </>
                ) : (
                    <span>{roleCode}</span>
                )}
            </button>
        )
    }

    const selectedCount = contracts.length + contractQueue.length

    return (
        <div className="fantasy-roster-card">
            <div className="fantasy-roster-header">
                <div>
                    <span className="fantasy-roster-eyebrow">Fantasy Team</span>
                    <h2>{fantasyTeam.team_name}</h2>
                </div>

                <div className="fantasy-roster-stats">

                    <div className="fantasy-roster-stat">
                        <span> Roster Price </span>
                        <strong> {totalBudget} </strong>
                    </div>

                    <div className="fantasy-roster-stat">
                        <span>Points </span>
                        <strong>{totalPoints.toFixed(0)} </strong>
                    </div>

                    <div className="fantasy-roster-stat">
                        <span>Selected</span>
                        <strong>{selectedCount}/5</strong>
                    </div>

                    <div className="fantasy-roster-stat">
                        <span>Bank</span>
                        <strong>€{remainingBudget ?? fantasyTeam.budget}</strong>
                    </div>
                </div>
            </div>

            <div className="fantasy-roster-map">
                <img src={minimap} alt="minimap" />

                {renderSlot(1, "TOP", "roster-slot-top")}
                {renderSlot(2, "JGL", "roster-slot-jungle")}
                {renderSlot(3, "MID", "roster-slot-mid")}
                {renderSlot(4, "ADC", "roster-slot-adc")}
                {renderSlot(5, "SUP", "roster-slot-support")}
            </div>

            <div className="fantasy-roster-actions">
                <button
                    type="button"
                    className="submit-roster-button"
                    disabled={contractQueue.length !== 5 || submitting}
                    onClick={onSubmitRoster}
                >
                    {submitting ? "Submitting..." : "Submit Roster"}
                </button>
            </div>
        </div>
    )
}

export default FantasyRosterCard