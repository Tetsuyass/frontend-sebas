import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import mascotte from "../../assets/avatars/avatar_idea_2.png";
import NavBarLogin from "../../components/NavBarLogin.jsx";
import "../../styles/TrySebas.css";

// ---- Réglages de la démo ----
const TOKEN_BUDGET = 300;          // quota total offert (très limité)
const MAX_INPUT_CHARS = 200;       // longueur max d'un message
const STORAGE_KEY = "sebas_try_tokens_used";
// TODO : route à créer côté FastAPI. Elle DOIT limiter les tokens côté serveur
// (par IP / session), car le compteur ci-dessous peut être contourné dans le navigateur.
const TRY_ENDPOINT = "http://127.0.0.1:8000/chat/demo";

// Estimation grossière : environ 4 caractères par token
const estimateTokens = (text) => Math.ceil(text.length / 4);

const readUsed = () => {
    try {
        const value = parseInt(localStorage.getItem(STORAGE_KEY), 10);
        return Number.isNaN(value) ? 0 : Math.min(value, TOKEN_BUDGET);
    } catch {
        return 0;
    }
};

const saveUsed = (value) => {
    try {
        localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
        /* stockage indisponible : on ignore */
    }
};

export default function TrySebas() {
    const navigate = useNavigate();
    const [used, setUsed] = useState(readUsed);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState([
        {
            author: "sebas",
            text: "Bonjour ! Je suis Sebas. Tu peux me poser quelques questions pour me tester.",
        },
    ]);
    const endRef = useRef(null);

    const remaining = Math.max(0, TOKEN_BUDGET - used);
    const exhausted = remaining === 0;
    const percentUsed = Math.min(100, Math.round((used / TOKEN_BUDGET) * 100));

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, loading]);

    //const handleSubmit = async (e) => {
    //    e.preventDefault();
    //    setError("");
//
    //    const text = DOMPurify.sanitize(input.trim());
    //    if (!text || loading || exhausted) return;
//
    //    if (estimateTokens(text) > remaining) {
    //        setError("Il ne te reste pas assez de tokens pour ce message. Essaie un message plus court.");
    //        return;
    //    }
//
    //    setMessages((prev) => [...prev, { author: "user", text }]);
    //    setInput("");
    //    setLoading(true);

    //    try {
    //        const res = await axios.post(TRY_ENDPOINT, { user_message: text });
    //        const reply = String(res.data?.reply ?? "");
//
    //        setMessages((prev) => [...prev, { author: "sebas", text: reply }]);
//
    //        const cost = estimateTokens(text) + estimateTokens(reply);
    //        const newUsed = Math.min(TOKEN_BUDGET, used + cost);
    //        setUsed(newUsed);
    //        saveUsed(newUsed);
    //    } catch (err) {
    //        const detail = err.response?.data?.detail;
    //        setError(
    //            typeof detail === "string"
    //                ? detail
    //                : "Le serveur ne répond pas, merci de réessayer ultérieurement."
    //        );
    //    } finally {
    //        setLoading(false);
    //    }
    //};

    return (
        <div className="ts-page">
            <div className="ts-scroll">
                <header className="ts-header">
                    <button className="ts-back" onClick={() => navigate(-1)} aria-label="Retour">
                        ← Retour
                    </button>
                    <span className="ts-tag">MODE DÉMO</span>
                    <h1 className="ts-title">Essayer Sebas</h1>
                    <p className="ts-lead">
                        Teste l'assistant sans compte. Le quota est volontairement très limité : il sert uniquement à
                        te faire une idée.
                    </p>
                </header>

                <div className="ts-layout">
                    {/* ===== CHAT ===== */}
                    <section className="ts-chat" aria-label="Conversation de démonstration">
                        <div className="ts-messages" aria-live="polite">
                            {messages.map((msg, i) => (
                                <div className={`ts-bubble ts-${msg.author}`} key={i}>
                                    {msg.author === "sebas" && (
                                        <img className="ts-avatar" src={mascotte} alt="Sebas" />
                                    )}
                                    <div className="ts-bubble-text">{msg.text}</div>
                                </div>
                            ))}

                            {loading && (
                                <div className="ts-bubble ts-sebas">
                                    <img className="ts-avatar" src={mascotte} alt="Sebas" />
                                    <div className="ts-bubble-text ts-typing" aria-label="Sebas écrit">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            )}

                            {exhausted && (
                                <div className="ts-exhausted">
                                    <p>
                                        <strong>Quota de démo épuisé.</strong> Crée un compte pour continuer à
                                        discuter avec Sebas.
                                    </p>
                                    <div className="ts-actions">
                                        <button className="ts-btn ts-btn-primary" onClick={() => navigate("/create_account")}>
                                            Créer un compte
                                        </button>
                                        <button className="ts-btn ts-btn-ghost" onClick={() => navigate("/tarifs")}>
                                            Voir les tarifs
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        {error && <p className="ts-error" role="alert">{error}</p>}

                        <form className="ts-form" >
                            <input
                                className="ts-input"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={exhausted ? "Quota épuisé" : "Pose ta question à Sebas..."}
                                maxLength={MAX_INPUT_CHARS}
                                disabled={exhausted || loading}
                                aria-label="Ton message"
                            />
                            <button
                                type="submit"
                                className="ts-send"
                                disabled={exhausted || loading || !input.trim()}
                            >
                                Envoyer
                            </button>
                        </form>
                        <p className="ts-hint">{input.length}/{MAX_INPUT_CHARS} caractères</p>
                    </section>

                    {/* ===== COMPTEUR ===== */}
                    <aside className="ts-side">
                        <div className="ts-panel">
                            <h2 className="ts-panel-title">Tokens restants</h2>
                            <p className="ts-count">
                                <span>{remaining}</span> / {TOKEN_BUDGET}
                            </p>
                            <div
                                className="ts-progress"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={TOKEN_BUDGET}
                                aria-valuenow={remaining}
                            >
                                <div
                                    className={`ts-progress-bar ${remaining <= TOKEN_BUDGET * 0.2 ? "low" : ""}`}
                                    style={{ width: `${percentUsed}%` }}
                                />
                            </div>
                            <p className="ts-note">
                                Un token correspond à environ 4 caractères. Tes messages et mes réponses comptent
                                tous les deux.
                            </p>
                        </div>

                        <div className="ts-panel">
                            <h2 className="ts-panel-title">Envie d'aller plus loin ?</h2>
                            <p className="ts-note">
                                Avec un compte : historique des conversations, plus de tokens et toutes les
                                fonctionnalités.
                            </p>
                            <button className="ts-btn ts-btn-primary ts-btn-full" onClick={() => navigate("/create_account")}>
                                Créer un compte
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            <NavBarLogin />
        </div>
    );
}