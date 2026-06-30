import { useEffect, useState } from "react"

import ImportAdminPanel from "../ImportAdminPanel/ImportAdminPanel.jsx"
import MatchAdminPanel from "../MatchAdminPanel/MatchAdminPanel.jsx";
import "./ModPanelModal.css"

const panelConfig = [
    {
        id: "matches",
        label: "Matches"
    },
    {
        id: "import",
        label: "Import"
    }
]

const ModPanelModal = ({ onClose }) => {
    const [activePanel, setActivePanel] = useState("matches")

    useEffect(() => {
        function handleEsc(e) {
            if (e.key === "Escape") {
                e.preventDefault()
                e.stopPropagation()
                onClose()
            }
        }

        document.addEventListener("keydown", handleEsc, true)

        return () => {
            document.removeEventListener("keydown", handleEsc, true)
        }
    }, [onClose])

    function renderPanel() {
        if (activePanel === "matches") {
            return <MatchAdminPanel />
        }

        if (activePanel === "import") {
            return <ImportAdminPanel />
        }

        return null
    }

    return (
        <div className="mod-panel-backdrop" onClick={onClose}>
            <div
                className="mod-panel-modal"
                onClick={e => e.stopPropagation()}
            >
                <div className="mod-panel-header">
                    <div>
                        <h2>Mod Panel</h2>
                        <p>Manage fantasy data, match records, and media archive content.</p>
                    </div>

                    <button className="mod-panel-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="mod-panel-content">
                    {renderPanel()}
                </div>

                <nav className="mod-panel-bottom-nav">
                    {panelConfig.map(panel => (
                        <button
                            key={panel.id}
                            className={activePanel === panel.id ? "mod-panel-nav-item active" : "mod-panel-nav-item"}
                            onClick={() => setActivePanel(panel.id)}
                        >
                            {panel.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}

export default ModPanelModal