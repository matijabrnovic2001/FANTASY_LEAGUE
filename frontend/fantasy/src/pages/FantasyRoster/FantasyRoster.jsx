import Navbar from "../../components/Navbar/Navbar.jsx";
import TitleCard from "../../components/TitleCard/TitleCard.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import FantasyPlayerList from "../../components/FantasyPlayerList/FantasyPlayerList.jsx";
import FantasyRosterCard from "../../components/FantasyRosterCard/FanasyRosterCard.jsx";

import "./FantasyRoster.css"
import {useState, useEffect} from "react"
import {getRoles} from "../../services/roleService.js";
import {getFantasyTeam} from "../../services/fantasyRosterService.js";
import {getFantasyContracts, createFantasyContract} from "../../services/fantasyContractService.js";
import {getPlayerStats} from "../../services/playerService.js";
import {useAuth} from "../../context/AuthContext.jsx";

const FantasyRoster = ()=>{
    const [selectedRole, setSelectedRole] = useState("all")
    const [roles, setRoles] = useState([])
    const [players, setPlayers] = useState([])

    const [fantasyTeam, setFantasyTeam] = useState(null)
    const [contracts, setContracts] = useState([])

    const [contractQueue, setContractQueue] = useState([])
    const [submitting, setSubmitting] = useState(false)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const {user, isLoggedIn} = useAuth()

    const queuedTotal = contractQueue.reduce((sum, contract) => {
        return sum + Number(contract.price)
    }, 0)

    const contractedTotal = contracts.reduce((sum, contract) => {
        return sum + Number(contract.price)
    }, 0)

    const totalBudget = contractedTotal + queuedTotal

    const remainingBudget = fantasyTeam
        ? Number(fantasyTeam.budget) - contractedTotal - queuedTotal
        : 0

    function attachPlayersToContracts(contractData, playerData) {
        return contractData.map(contract => {
            const player = playerData.find(player =>
                Number(player.id) === Number(contract.fantasy_player)
            )

            return {
                ...contract,
                player
            }
        })
    }

    async function handleSubmitRoster() {
        if (contractQueue.length !== 5) return

        setSubmitting(true)
        setError(null)

        try {
            const contractsToCreate = contractQueue.map(({player, ...contract}) => contract)

            await Promise.all(
                contractsToCreate.map(contract =>
                    createFantasyContract(contract)
                )
            )

            const updatedContracts = await getFantasyContracts({
                fantasy_team: fantasyTeam.id
            })

            setContracts(attachPlayersToContracts(updatedContracts, players))
            setContractQueue([])
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    function handleTogglePlayer(player) {

        const alreadyQueued = contractQueue.some(contract =>
            Number(contract.fantasy_player) === Number(player.id)
        )

        if (alreadyQueued) {
            setContractQueue(prev =>
                prev.filter(contract =>
                    Number(contract.fantasy_player) !== Number(player.id)
                )
            )
            return
        }

        const playerPrice = Number(player.fantasy_price)

        if (playerPrice > remainingBudget) return

        const roleAlreadyQueued = contractQueue.some(contract =>
            Number(contract.contract_role) === Number(player.player_role)
        )

        const roleAlreadyContracted = contracts.some(contract =>
            Number(contract.contract_role) === Number(player.player_role)
        )

        if (roleAlreadyQueued || roleAlreadyContracted) return

        const queuedContract = {
            fantasy_team: fantasyTeam.id,
            fantasy_player: player.id,
            contract_role: player.player_role,
            price: player.fantasy_price,
            player: player
        }

        setContractQueue(prev => [...prev, queuedContract])
    }

    useEffect(() => {
        async function fetchData() {
            if (!isLoggedIn || !user?.id) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const [fantasyTeamData, roleData, playerData] = await Promise.all([
                    getFantasyTeam({owner: user.id}),
                    getRoles(),
                    getPlayerStats({season: 3})
                ])

                if (!fantasyTeamData.length) {
                    setFantasyTeam(null)
                    setRoles(roleData)
                    setPlayers(playerData)
                    return
                }

                const contractData = await getFantasyContracts({
                    fantasy_team: fantasyTeamData[0].id
                })

                setFantasyTeam(fantasyTeamData[0])
                setContracts(attachPlayersToContracts(contractData, playerData))
                setRoles(roleData)
                setPlayers(playerData)
            } catch (err){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user, isLoggedIn])

    if (loading) return <p>Loading roster...</p>
    if (error) return <p>{error}</p>
    if (!isLoggedIn) return <p>You need to log in to view your roster.</p>
    if (!fantasyTeam) return <p>No fantasy team found.</p>

    return(
        <div className='page'>
            <Navbar />
            <TitleCard title='My Roster' />

            <div className='roster-content'>
                <FantasyPlayerList
                    players={players}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    roles={roles}
                    contractQueue={contractQueue}
                    contracts={contracts}
                    remainingBudget={remainingBudget}
                    onTogglePlayer={handleTogglePlayer}
                />

                <FantasyRosterCard
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    fantasyTeam={fantasyTeam}
                    contracts={contracts}
                    remainingBudget={remainingBudget}
                    contractQueue={contractQueue}
                    onSubmitRoster={handleSubmitRoster}
                    submitting={submitting}
                    totalBudget={totalBudget}
                />
            </div>

            <Footer />
        </div>
    )
}

export default FantasyRoster