import Navbar from '../../components/Navbar/Navbar.jsx';
import PlayerTable from "../../components/PlayerTable/PlayerTable.jsx";
import TitleCard from "../../components/TitleCard/TitleCard.jsx";
import PlayerTableDash from "../../components/PlayerTableDash/PlayerTableDash.jsx";
import './Players.css'

import {useState} from "react";
import Footer from "../../components/Footer/Footer.jsx";

const Players = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSeason, setSelectedSeason] = useState(3)
    const [selectedRole, setSelectedRole] = useState("")
    const [isPerGameView, setIsPerGameView] = useState(false)

    return (
        <div className='players-page'>
            <Navbar />
            <TitleCard title='Players' />

            <div className='players-content'>
                <PlayerTableDash
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    isPerGameView={isPerGameView}
                    setIsPerGameView={setIsPerGameView}
                />

                <PlayerTable
                    season={selectedSeason}
                    searchTerm={searchTerm}
                    selectedRole={selectedRole}
                    isPerGameView={isPerGameView}
                />
            </div>

            <Footer />
        </div>
    )
}

export default Players