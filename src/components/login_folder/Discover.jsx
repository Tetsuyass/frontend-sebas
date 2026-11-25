import React from "react";
import { useNavigate } from "react-router-dom";
import mascotte from "../../assets/avatars/avatar_idea_2.png";
import NavBarLogin from "../NavBarLogin.jsx";
import "../../styles/Discover.css";

const STEPS = [
    {
        icon: "💬",
        title: "Vous parlez",
        text: "Écrivez simplement ce dont vous avez besoin, comme à un collègue. Pas de commande à apprendre.",
    },
    {
        icon: "⚙️",
        title: "Sebas agit",
        text: "Il comprend votre demande, cherche, organise ou rédige, et vous montre ce qu'il fait.",
    },
    {
        icon: "🛡️",
        title: "Vous gardez la main",
        text: "Vous relisez, vous corrigez, vous validez. Rien de sensible ne part sans votre accord.",
    },
];

const VALUES = [
    { title: "Transparence", text: "Vous savez ce que l'assistant fait et pourquoi." },
    { title: "Continuité", text: "Vos conversations sont conservées pour reprendre là où vous vous étiez arrêté." },
    { title: "Confidentialité", text: "Vos données restent les vôtres, avec des règles claires et lisibles." },
];

export default function Discover() {
    const navigate = useNavigate();

    return (
        <div className="dc-page">
            <div className="dc-scroll">
                {/* ===== HERO ===== */}
                <section className="dc-hero">
                    <div className="dc-hero-text">
                        <span className="dc-tag">DÉCOUVRIR SEBAS</span>
                        <h1 className="dc-title">
                            L'IA pensée<br />pour vous.
                        </h1>
                        <p className="dc-lead">
                            Sebas est un agent IA personnel : un assistant qui ne se contente pas de répondre, il vous aide
                            à avancer sur vos tâches, tout en vous laissant le contrôle.
                        </p>
                        <div className="dc-actions">
                            <button className="dc-btn dc-btn-primary" onClick={() => navigate("/try-sebas")}>
                                Essayer Sebas
                            </button>
                            <button className="dc-btn dc-btn-ghost" onClick={() => navigate("/create_account")}>
                                Créer un compte
                            </button>
                        </div>
                    </div>

                    <div className="dc-hero-visual">
                        <div className="dc-pixel-bubble">
                            <span>Enchanté, je suis Sebas.</span>
                        </div>
                        <img className="dc-mascotte" src={mascotte} alt="Sebas mascotte" />
                    </div>
                </section>

                {/* ===== FONCTIONNEMENT ===== */}
                <section className="dc-section">
                    <h2 className="dc-section-title">Comment ça marche</h2>
                    <div className="dc-grid dc-grid-3">
                        {STEPS.map((step, i) => (
                            <article className="dc-card" key={step.title}>
                                <span className="dc-card-number">0{i + 1}</span>
                                <div className="dc-card-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ===== VALEURS ===== */}
                <section className="dc-section">
                    <h2 className="dc-section-title">Ce qui nous guide</h2>
                    <div className="dc-grid dc-grid-3">
                        {VALUES.map((v) => (
                            <article className="dc-card dc-card-flat" key={v.title}>
                                <h3>{v.title}</h3>
                                <p>{v.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ===== HISTOIRE ===== */}
                <section className="dc-section dc-story">
                    <h2 className="dc-section-title">L'histoire de Sebas</h2>
                    <div className="dc-panel">
                        {/* TODO : remplace ce texte par la vraie histoire de ton projet */}
                        <p>
                            Sebas est né d'un constat simple : la plupart des assistants IA oublient ce qu'on leur a dit,
                            agissent sans qu'on sache comment, et laissent peu de place à la confiance.
                        </p>
                        <p>
                            Le projet est parti d'une première version baptisée Lilith, pensée comme un compagnon de
                            conversation avec une vraie personnalité. Au fil des tests et des retours, il est devenu
                            Sebas : un agent personnel qui garde la mémoire, explique ses actions et vous laisse décider.
                        </p>
                        <p>
                            L'application évolue en continu, avec les retours de ses utilisateurs.
                        </p>
                    </div>
                </section>

                {/* ===== DÉVELOPPEUR ===== */}
                <section className="dc-section">
                    <h2 className="dc-section-title">Le développeur</h2>
                    <div className="dc-panel dc-dev">
                        <div className="dc-dev-avatar" aria-hidden="true">T</div>
                        <div className="dc-dev-info">
                            <h3>Tetsuya</h3>
                            <p className="dc-dev-role">Développeur full stack · Étudiant à l'EFREI Paris</p>
                            {/* TODO : ajuste cette présentation à ta façon de te présenter */}
                            <p>
                                Sebas est conçu et développé par Tetsuya, étudiant en Bachelor Ingénierie Numérique,
                                spécialisé en développement logiciel full stack. Du front React au back, il construit
                                l'application de bout en bout.
                            </p>
                            <a
                                className="dc-link"
                                href="https://github.com/Tetsuyass"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                github.com/Tetsuyass ↗
                            </a>
                        </div>
                    </div>
                </section>

                {/* ===== CTA FINAL ===== */}
                <section className="dc-cta">
                    <h2>Prêt à rencontrer Sebas ?</h2>
                    <div className="dc-actions dc-actions-center">
                        <button className="dc-btn dc-btn-primary" onClick={() => navigate("/essayer")}>
                            Essayer gratuitement
                        </button>
                        <button className="dc-btn dc-btn-ghost" onClick={() => navigate("/tarifs")}>
                            Voir les tarifs
                        </button>
                    </div>
                </section>
            </div>

            <NavBarLogin />
        </div>
    );
}