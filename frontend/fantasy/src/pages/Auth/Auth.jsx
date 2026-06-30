import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import {loginUser, registerUser} from "../../services/authService.js";
import {createFantasyTeam} from "../../services/fantasyRosterService.js";

import "./Auth.css";

const Auth = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        birth_date: "",
        fantasy_team_name: ""
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();

    const resetMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleRegister = async () => {
        const registeredUser = await registerUser({
            email: formData.email,
            username: formData.username,
            password: formData.password,
            birth_date: formData.birth_date
        });

        await createFantasyTeam({
            team_name: formData.fantasy_team_name,
            owner: registeredUser.id
        });

        setSuccess("Account created successfully. You can now log in.");
        setIsRegistering(false);

        setFormData(prev => ({
            email: prev.email,
            username: "",
            password: "",
            birth_date: "",
            fantasy_team_name: ""
        }));
    };

    const handleLogin = async () => {
        const data = await loginUser({
            email: formData.email,
            password: formData.password
        });

        login(data);
        navigate("/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        resetMessages();
        setLoading(true);

        try {
            if (isRegistering) {
                await handleRegister();
                return;
            }

            await handleLogin();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMode = () => {
        setIsRegistering(prev => !prev);
        resetMessages();

        setFormData(prev => ({
            ...prev,
            username: "",
            password: "",
            birth_date: "",
            fantasy_team_name: ""
        }));
    };

    return (
        <div className="auth-page">
            <section className="auth-card">
                <h1 className="auth-title">
                    {isRegistering ? "Register" : "Login"}
                </h1>

                <p className="auth-subtitle">
                    {isRegistering ? "Create your fantasy league account" : "Welcome back!"}
                </p>

                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-success">{success}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className="auth-field">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username ..."
                                required
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email ..."
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password ..."
                            required
                        />
                    </div>

                    {isRegistering && (
                        <>
                            <div className="auth-field">
                                <label>Birth Date</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label>Fantasy Team Name</label>
                                <input
                                    type="text"
                                    name="fantasy_team_name"
                                    value={formData.fantasy_team_name}
                                    onChange={handleChange}
                                    placeholder="Fantasy team name ..."
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="auth-submit-btn">
                        <input
                            type="submit"
                            disabled={loading}
                            value={
                                loading
                                    ? "Loading ..."
                                    : isRegistering
                                        ? "Register"
                                        : "Login"
                            }
                        />
                    </div>
                </form>

                <button
                    className="auth-toggle-btn"
                    onClick={handleToggleMode}
                >
                    {isRegistering
                        ? "Already a user? Login"
                        : "Don't have an account yet? Register"
                    }
                </button>
            </section>
        </div>
    );
};

export default Auth;