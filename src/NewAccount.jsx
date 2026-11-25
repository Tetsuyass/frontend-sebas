import { useNavigate } from "react-router-dom";
import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import mascotte from './assets/avatars/avatar_idea_2.png'
import './styles/NewAccount.css'
import NavBarLogin from "./components/NavBarLogin.jsx";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
//import useValidation from './hooks/validation_schema.js'
import { z } from "zod";

const schema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

export default function NewAccount() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });
    const [pssw_verif, setPsswVerif] = useState("");
    const [error, setError] = useState("");

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (prop) => (event) => {
        setValues({
            ...values,
            [prop]: event.target.value,
        });
    };

    useLayoutEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validations locales D'ABORD
    if (password !== pssw_verif) {
        setError("Les mots de passe ne correspondent pas.");
        return;
    }

    const sanitizedUsername = DOMPurify.sanitize(username);
    const result = schema.safeParse({ username: sanitizedUsername, password });
    if (!result.success) {
        setError(result.error.errors[0].message);
        return;
    }

    // 2. Vérifier que executeRecaptcha est disponible
    if (!executeRecaptcha) {
        setError("reCAPTCHA non prêt, réessayez.");
        return;
    }

    // 3. Captcha seulement si tout est valide
    const captchaToken = await executeRecaptcha("create_account");

    if (!captchaToken) {
        setError("Échec du reCAPTCHA, réessayez.");
        return;
    }

    try {
        const res = await axios.post("http://127.0.0.1:8000/create_account", {
            username: sanitizedUsername,
            password,
            captcha_token: captchaToken
        });
        navigate("/app");
    } catch (err) {
        const rawError = err.response?.data?.detail || "Erreur serveur.";
        setError(DOMPurify.sanitize(rawError));
    }
};

    const goBack = (e) => {
        e.preventDefault();
        navigate("/");
    };

    const confidentialityPolicy = async (e) => {
        e.preventDefault();
        navigate("#");
    };

    return (
        <div className="page-wrapper">
            <div className="left-part-wrapper">
                <div className="pixel-bubble">
                    <span>J'espère pouvoir travailler avec vous.</span>
                </div>
                <img className="logo-login" src={mascotte} alt="Sebas mascotte" />
            </div>

            <div className="login-form-wrapper">
                <h1 className="login-title">Rejoins<br/>Sebas.</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(DOMPurify.sanitize(e.target.value))}
                        required
                    />
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={pssw_verif}
                        onChange={(e) => setPsswVerif(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">
                        Créer mon compte
                    </button>
                    <button type="button" className="newaccount-button" onClick={goBack}>
                        Déjà un compte ? Se connecter
                    </button>
                    <div className="legal-checkbox-wrapper">
                        <input type="checkbox" id="legal-new-account" required/>
                        <label htmlFor="legal-new-account">En continuant, vous reconnaissez la <a
                            onClick={confidentialityPolicy}>Politique de Confidentialité</a> de Sebas et acceptez de
                            recevoir occasionnellement des e-mails de mise à jour produit et promotionnels.</label>
                    </div>
                </form>
                <p className="legal-mention-login">
                    Ce site est protégé par reCAPTCHA.
                    La <a href="https://policies.google.com/privacy">politique de confidentialité</a> et les <a href="https://policies.google.com/terms">conditions d'utilisation</a> de Google s'appliquent.
                </p>
                {error && <p style={{color: "#ff6b6b", fontSize: "13px", margin: "4px 0 0"}}>{error}</p>}
            </div>
            <NavBarLogin/>
        </div>
    );
}