import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {createFantasyLeague} from "../../services/fantasyLeagueService.js";
import {joinFantasyLeague} from "../../services/fantasyLeagueMembershipService.js";

import "./CreateFantasyLeagueModal.css";

const CreateFantasyLeagueModal = ({roster, onClose, onLeagueCreated}) => {
    const {user, isAdmin} = useAuth();

    const [formData, setFormData] = useState({
        league_name: "",
        max_cap: 100,
        league_code: "",
        description: "",
        is_public: true,
        is_official: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            if (!roster?.id) {
                throw new Error("You need a fantasy roster before creating a league");
            }

            const payload = {
                league_name: formData.league_name,
                max_cap: Number(formData.max_cap),
                league_code: formData.league_code || null,
                description: formData.description || null,
                owner_user: user?.id,
                is_public: formData.is_public,
                is_active: true,
                is_official: isAdmin ? formData.is_official : false
            };

            const createdLeague = await createFantasyLeague(payload);

            await joinFantasyLeague({
                fantasy_team: roster.id,
                fantasy_league: createdLeague.id
            });

            onLeagueCreated(createdLeague);
            onClose();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-league-modal-backdrop" onClick={onClose}>
            <section className="create-league-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="create-league-modal-header">
                    <div>
                        <div className="create-league-modal-title-row">
                            <h2>Create League</h2>

                            <span className={formData.is_official ? "create-league-modal-badge-official" : "create-league-modal-badge-community"}>
                                {formData.is_official ? "Official" : "Community"}
                            </span>
                        </div>

                        <p>
                            Set up a fantasy league.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="create-league-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <p className="create-league-modal-error">
                        {error}
                    </p>
                )}

                <form className="create-league-modal-form" onSubmit={handleSubmit}>
                    <div className="create-league-modal-grid">
                        <div className="create-league-modal-field">
                            <label>League Name</label>
                            <input
                                type="text"
                                name="league_name"
                                value={formData.league_name}
                                onChange={handleChange}
                                placeholder="League name ..."
                                maxLength={30}
                                required
                            />
                        </div>

                        <div className="create-league-modal-field">
                            <label>League Code</label>
                            <input
                                type="text"
                                name="league_code"
                                value={formData.league_code}
                                onChange={handleChange}
                                placeholder="Optional code ..."
                                maxLength={12}
                            />
                        </div>
                    </div>

                    <div className="create-league-modal-field">
                        <label>Max Capacity</label>
                        <input
                            type="number"
                            name="max_cap"
                            value={formData.max_cap}
                            onChange={handleChange}
                            min={2}
                            max={100}
                            required
                        />
                    </div>

                    <div className="create-league-modal-field">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Short league description ..."
                            maxLength={255}
                        />
                    </div>

                    <div className="create-league-modal-options">
                        <label>
                            <input
                                type="checkbox"
                                name="is_public"
                                checked={formData.is_public}
                                onChange={handleChange}
                            />
                            Public League
                        </label>

                        {isAdmin && (
                            <label>
                                <input
                                    type="checkbox"
                                    name="is_official"
                                    checked={formData.is_official}
                                    onChange={handleChange}
                                />
                                Official League
                            </label>
                        )}
                    </div>

                    <div className="create-league-modal-actions">
                        <button
                            type="button"
                            className="create-league-modal-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-league-modal-submit"
                            disabled={loading}
                        >
                            {loading ? "Creating ..." : "Create League"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CreateFantasyLeagueModal;