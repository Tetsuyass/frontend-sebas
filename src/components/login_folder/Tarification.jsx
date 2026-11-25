import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarLogin from "../../components/NavBarLogin.jsx";
import "../../styles/Tarification.css";

const ANNUAL_DISCOUNT = 0.2; // -20 % en facturation annuelle

// TODO : tous les prix, quotas et fonctionnalités ci-dessous sont des PLACEHOLDERS.
// Remplace-les par tes vraies offres.
const PLANS = [
    {
        id: "free",
        name: "Découverte",
        tagline: "Pour faire connaissance avec Sebas.",
        monthly: 0,
        quota: "Quota mensuel limité",
        features: [
            "Conversations avec Sebas",
            "Historique sur 7 jours",
            "Réponses standard",
            "Support via la FAQ",
        ],
        cta: "Commencer gratuitement",
        route: "/create_account",
    },
    {
        id: "essential",
        name: "Essentiel",
        tagline: "Pour un usage régulier au quotidien.",
        monthly: 9,
        quota: "Quota mensuel étendu",
        features: [
            "Tout de Découverte",
            "Historique illimité",
            "Mémoire des conversations",
            "Validation des actions sensibles",
            "Support par e-mail",
        ],
        cta: "Choisir Essentiel",
        route: "/create_account",
        highlighted: true,
    },
    {
        id: "pro",
        name: "Pro",
        tagline: "Pour déléguer davantage, en gardant le contrôle.",
        monthly: 19,
        quota: "Quota mensuel élevé",
        features: [
            "Tout d'Essentiel",
            "Journal d'activité de l'agent",
            "Priorité de traitement",
            "Support prioritaire",
        ],
        cta: "Choisir Pro",
        route: "/create_account",
    },
];

const FAQ_PRICING = [
    {
        q: "Puis-je changer d'offre à tout moment ?",
        a: "Oui, vous pouvez passer à une offre supérieure ou revenir à l'offre gratuite quand vous le souhaitez.",
    },
    {
        q: "Que se passe-t-il quand mon quota est atteint ?",
        a: "Vous êtes prévenu avant d'atteindre la limite. Vous pouvez alors attendre le renouvellement ou changer d'offre.",
    },
    {
        q: "Puis-je tester avant de payer ?",
        a: "Oui : l'offre Découverte est gratuite, et la page « Essayer Sebas » permet de tester sans compte.",
    },
];

const formatPrice = (plan, annual) => {
    if (plan.monthly === 0) return "0";
    const value = annual ? plan.monthly * (1 - ANNUAL_DISCOUNT) : plan.monthly;
    return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(".", ",");
};

export default function Tarification() {
    const navigate = useNavigate();
    const [annual, setAnnual] = useState(false);

    return (
        <div className="tf-page">
            <div className="tf-scroll">
                <header className="tf-header">
                    <button className="tf-back" onClick={() => navigate(-1)} aria-label="Retour">
                        ← Retour
                    </button>
                    <span className="tf-tag">TARIFICATIONS</span>
                    <h1 className="tf-title">Des offres simples,<br />sans surprise.</h1>
                    <p className="tf-lead">
                        Commencez gratuitement, évoluez quand vous en avez besoin. Vous pouvez changer d'offre à tout
                        moment.
                    </p>

                    <div className="tf-toggle" role="group" aria-label="Période de facturation">
                        <button
                            className={`tf-toggle-btn ${!annual ? "active" : ""}`}
                            onClick={() => setAnnual(false)}
                            aria-pressed={!annual}
                        >
                            Mensuel
                        </button>
                        <button
                            className={`tf-toggle-btn ${annual ? "active" : ""}`}
                            onClick={() => setAnnual(true)}
                            aria-pressed={annual}
                        >
                            Annuel <span className="tf-badge">-{ANNUAL_DISCOUNT * 100}%</span>
                        </button>
                    </div>
                </header>

                {/* ===== OFFRES ===== */}
                <section className="tf-plans" aria-label="Offres">
                    {PLANS.map((plan) => (
                        <article
                            className={`tf-plan ${plan.highlighted ? "tf-plan-highlight" : ""}`}
                            key={plan.id}
                        >
                            {plan.highlighted && <span className="tf-popular">LE PLUS CHOISI</span>}
                            <h2 className="tf-plan-name">{plan.name}</h2>
                            <p className="tf-plan-tagline">{plan.tagline}</p>

                            <p className="tf-price">
                                <span className="tf-price-amount">{formatPrice(plan, annual)} €</span>
                                <span className="tf-price-period">/ mois</span>
                            </p>
                            {annual && plan.monthly > 0 && (
                                <p className="tf-price-note">Facturé annuellement</p>
                            )}

                            <p className="tf-quota">{plan.quota}</p>

                            <ul className="tf-features">
                                {plan.features.map((f) => (
                                    <li key={f}>{f}</li>
                                ))}
                            </ul>

                            <button
                                className={`tf-btn ${plan.highlighted ? "tf-btn-primary" : "tf-btn-ghost"}`}
                                onClick={() => navigate(plan.route)}
                            >
                                {plan.cta}
                            </button>
                        </article>
                    ))}
                </section>

                <p className="tf-try">
                    Pas encore sûr ?{" "}
                    <a className="tf-link" onClick={() => navigate("/essayer")} role="link" tabIndex={0}
                       onKeyDown={(e) => e.key === "Enter" && navigate("/essayer")}>
                        Essayez Sebas sans compte
                    </a>
                </p>

                {/* ===== FAQ TARIFS ===== */}
                <section className="tf-faq">
                    <h2 className="tf-section-title">Questions sur les tarifs</h2>
                    <div className="tf-faq-grid">
                        {FAQ_PRICING.map((item) => (
                            <article className="tf-faq-card" key={item.q}>
                                <h3>{item.q}</h3>
                                <p>{item.a}</p>
                            </article>
                        ))}
                    </div>
                    <p className="tf-help">
                        Une autre question ?{" "}
                        <a className="tf-link" onClick={() => navigate("/aide")} role="link" tabIndex={0}
                           onKeyDown={(e) => e.key === "Enter" && navigate("/aide")}>
                            Contactez le centre d'aide
                        </a>
                    </p>
                </section>
            </div>

            <NavBarLogin />
        </div>
    );
}