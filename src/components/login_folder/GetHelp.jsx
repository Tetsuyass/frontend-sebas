import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import NavBarLogin from "../../components/NavBarLogin.jsx";
import "../../styles/GetHelp.css";

// TODO : adapte l'URL à ton backend (route à créer côté FastAPI)
const CONTACT_ENDPOINT = "http://127.0.0.1:8000/contact";

// TODO : relis et valide chaque réponse avec le fonctionnement réel de l'appli
const FAQ = [
    {
        category: "Démarrer",
        q: "Qu'est-ce que Sebas ?",
        a: "Sebas est un agent IA personnel : un assistant qui vous aide à avancer sur vos tâches au quotidien. Vous lui écrivez, il répond et agit, et vous gardez toujours la main.",
    },
    {
        category: "Démarrer",
        q: "Comment créer un compte ?",
        a: "Cliquez sur « Créer un compte », choisissez un nom d'utilisateur (3 à 20 caractères : lettres, chiffres et _) et un mot de passe d'au moins 8 caractères avec une majuscule et un chiffre.",
    },
    {
        category: "Démarrer",
        q: "Puis-je essayer Sebas sans compte ?",
        a: "Oui, la page « Essayer Sebas » donne accès à un nombre limité de tokens pour tester l'application. Une fois ce quota utilisé, il faut créer un compte pour continuer.",
    },
    {
        category: "Compte et données",
        q: "J'ai oublié mon mot de passe, que faire ?",
        a: "Contactez-nous via le formulaire en bas de cette page en indiquant votre nom d'utilisateur. Nous vous aiderons à retrouver l'accès à votre compte.",
    },
    {
        category: "Compte et données",
        q: "Que deviennent mes conversations ?",
        a: "Vos conversations vous appartiennent. La Politique de Confidentialité détaille ce qui est conservé et pendant combien de temps.",
    },
    {
        category: "Compte et données",
        q: "Sebas peut-il agir sans mon accord ?",
        a: "Non. Les actions sensibles doivent être validées par vous avant d'être exécutées.",
    },
    {
        category: "Offres",
        q: "Sebas est-il gratuit ?",
        a: "Une offre gratuite permet de découvrir l'application. Les offres payantes donnent accès à plus de tokens et à des fonctionnalités supplémentaires : tous les détails sont sur la page Tarifications.",
    },
    {
        category: "Offres",
        q: "Qu'est-ce qu'un token ?",
        a: "Un token est un petit morceau de texte (quelques caractères) que l'IA lit ou écrit. Votre quota se consomme à chaque message envoyé et chaque réponse reçue.",
    },
    {
        category: "Problèmes",
        q: "Le serveur ne répond pas, que faire ?",
        a: "Patientez quelques instants puis réessayez. Si le problème persiste, signalez-le via le formulaire de contact en précisant l'heure et ce que vous essayiez de faire.",
    },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

export default function GetHelp() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);
    const [status, setStatus] = useState({ type: "", text: "" });
    const [sending, setSending] = useState(false);

    const filteredFaq = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return FAQ;
        return FAQ.filter(
            (item) => item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term)
        );
    }, [search]);

    const toggle = (question) => setOpenIndex((prev) => (prev === question ? null : question));

    const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", text: "" });

        const payload = {
            name: DOMPurify.sanitize(form.name.trim()),
            email: form.email.trim(),
            subject: DOMPurify.sanitize(form.subject.trim()),
            message: DOMPurify.sanitize(form.message.trim()),
        };

        if (!payload.name) {
            setStatus({ type: "error", text: "Indiquez votre nom." });
            return;
        }
        if (!EMAIL_REGEX.test(payload.email)) {
            setStatus({ type: "error", text: "Adresse e-mail invalide." });
            return;
        }
        if (payload.message.length < 10) {
            setStatus({ type: "error", text: "Votre message est trop court (10 caractères minimum)." });
            return;
        }

        setSending(true);
        try {
            await axios.post(CONTACT_ENDPOINT, payload);
            setStatus({ type: "success", text: "Message envoyé. Nous vous répondrons dès que possible." });
            setForm(EMPTY_FORM);
        } catch (err) {
            // Affiché comme texte par React : pas besoin de dangerouslySetInnerHTML
            const detail = err.response?.data?.detail;
            setStatus({
                type: "error",
                text: typeof detail === "string" ? detail : "Impossible d'envoyer le message pour le moment. Réessayez plus tard.",
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="gh-page">
            <div className="gh-scroll">
                <header className="gh-header">
                    <button className="gh-back" onClick={() => navigate(-1)} aria-label="Retour">
                        ← Retour
                    </button>
                    <span className="gh-tag">CENTRE D'AIDE</span>
                    <h1 className="gh-title">Comment pouvons-nous<br />vous aider ?</h1>
                    <input
                        className="gh-search"
                        type="search"
                        placeholder="Rechercher dans la FAQ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Rechercher dans la FAQ"
                    />
                </header>

                <div className="gh-layout">
                    {/* ===== FAQ ===== */}
                    <section className="gh-faq" aria-labelledby="gh-faq-title">
                        <h2 id="gh-faq-title" className="gh-section-title">Questions fréquentes</h2>

                        {filteredFaq.length === 0 && (
                            <p className="gh-empty">
                                Aucun résultat pour « {search} ». Essayez un autre mot ou écrivez-nous directement.
                            </p>
                        )}

                        {filteredFaq.map((item) => {
                            const isOpen = openIndex === item.q;
                            return (
                                <div className={`gh-faq-item ${isOpen ? "open" : ""}`} key={item.q}>
                                    <button
                                        className="gh-faq-question"
                                        onClick={() => toggle(item.q)}
                                        aria-expanded={isOpen}
                                    >
                                        <span>
                                            <small className="gh-faq-category">{item.category}</small>
                                            {item.q}
                                        </span>
                                        <span className="gh-faq-chevron" aria-hidden="true">+</span>
                                    </button>
                                    {isOpen && <p className="gh-faq-answer">{item.a}</p>}
                                </div>
                            );
                        })}
                    </section>

                    {/* ===== CONTACT ===== */}
                    <section className="gh-contact" aria-labelledby="gh-contact-title">
                        <h2 id="gh-contact-title" className="gh-section-title">Contacter le support</h2>
                        <p className="gh-contact-intro">
                            Vous ne trouvez pas votre réponse ? Écrivez-nous, nous reviendrons vers vous.
                        </p>

                        <form className="gh-form" onSubmit={handleSubmit} noValidate>
                            <input
                                className="gh-input"
                                type="text"
                                placeholder="Votre nom"
                                value={form.name}
                                onChange={handleChange("name")}
                                maxLength={60}
                                required
                            />
                            <input
                                className="gh-input"
                                type="email"
                                placeholder="Votre e-mail"
                                value={form.email}
                                onChange={handleChange("email")}
                                maxLength={120}
                                required
                            />
                            <input
                                className="gh-input"
                                type="text"
                                placeholder="Sujet"
                                value={form.subject}
                                onChange={handleChange("subject")}
                                maxLength={100}
                            />
                            <textarea
                                className="gh-input gh-textarea"
                                placeholder="Décrivez votre problème ou votre question..."
                                value={form.message}
                                onChange={handleChange("message")}
                                maxLength={1500}
                                rows={6}
                                required
                            />
                            <button type="submit" className="gh-submit" disabled={sending}>
                                {sending ? "Envoi en cours..." : "Envoyer le message"}
                            </button>

                            {status.text && (
                                <p className={`gh-status gh-status-${status.type}`} role="status">
                                    {status.text}
                                </p>
                            )}
                        </form>
                    </section>
                </div>
            </div>

            <NavBarLogin />
        </div>
    );
}