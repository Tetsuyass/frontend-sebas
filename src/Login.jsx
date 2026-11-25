import React, {useState, useLayoutEffect} from 'react';
import { useNavigate } from "react-router-dom";
import mascotte from './assets/avatars/avatar_idea_2.png'
import axios from 'axios';
import './styles/LoginForm.css'
import NavBarLogin from "./components/NavBarLogin.jsx";
import DOMPurify from "dompurify";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const sanitizedUsername = DOMPurify.sanitize(username);


            const res = await axios.post("http://127.0.0.1:8000/login", {
                password: password,
                username: sanitizedUsername
            });

        } catch (err) {
            const rawError = err.response?.data?.detail || "Erreur serveur.";
            setError(DOMPurify.sanitize(rawError));
        }

        localStorage.setItem("token", "dummy_token");
        navigate("/app");
    };

    useLayoutEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const createAccount = async (e) => {
        e.preventDefault();
        navigate("/create_account");
    };

    const confidentialityPolicy = async (e) => {
        e.preventDefault();
        navigate("/#");
    };


    const sanitizedUsername = DOMPurify.sanitize(username);
    const sanitizedError = DOMPurify.sanitize(error);

    return (
        <div className="page-wrapper">
            <div className="left-part-wrapper">
                <div className="pixel-bubble">
                    <span>Ravi de vous revoir.</span>
                </div>
                <img className="logo-login" src={mascotte} alt="Sebas mascotte"/>
            </div>

            <div className="login-form-wrapper">
                <h1 className="login-title">L'IA pensée<br/>pour vous.</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <input className="input-field" type="text"
                           placeholder="Nom d'utilisateur"
                           value={username}
                           onChange={(e) => setUsername(DOMPurify.sanitize(e.target.value))} // ✅
                    />
                    <input className="input-field" type="password"
                           placeholder="Mot de passe"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="submit-button">
                        Se connecter
                    </button>
                    <button type="button" className="newaccount-button" onClick={createAccount}>
                        Créer un compte
                    </button>
                    <p className="legal-mention-login">
                        En continuant, vous reconnaissez la{" "}
                        <a onClick={confidentialityPolicy} className="hypertext-link">
                            Politique de Confidentialité
                        </a>{" "}
                        de Sebas et acceptez de recevoir occasionnellement des e-mails de mise à jour produit et
                        promotionnels.
                    </p>
                    <p className="legal-mention-login">
                        Ce site est protégé par reCAPTCHA.
                        La <a href="https://policies.google.com/privacy"> politique de confidentialité </a>
                        et les <a href="https://policies.google.com/terms"> conditions d'utilisation </a>
                        de Google s'appliquent.
                    </p>
                </form>
                {error && <p style={{color: "red"}} dangerouslySetInnerHTML={{__html: sanitizedError}}/>}
                {token && <p style={{color: "green"}}>Connecté !</p>}
            </div>

            <NavBarLogin/>
        </div>
    );
}