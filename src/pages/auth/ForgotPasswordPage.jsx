import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/forgot-password.css";

function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
        }, 900);
    };

    return (
        <div className="fp-shell">
            <div className="fp-shell__glow fp-shell__glow--one" />
            <div className="fp-shell__glow fp-shell__glow--two" />

            <main className="fp-frame">
                <section className="fp-showcase" aria-label="Recuperación de acceso">
                    <div className="fp-showcase__surface">
                        <header className="fp-brandbar">
                            <div className="fp-brandbar__mark" aria-hidden="true">
                                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.5" y="0.5" width="39" height="39" rx="12" fill="url(#brandFill)" />
                                    <path d="M20 30V13.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
                                    <ellipse cx="20" cy="11" rx="3.4" ry="5.4" fill="white" fillOpacity="0.95" />
                                    <path d="M20 20.5C15 19 12.6 15.8 13.8 12.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.78" />
                                    <path d="M20 18.2C24.8 16.6 27.5 13.6 26.2 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.72" />
                                    <path d="M11.5 31.2C14.7 29.4 17.5 29 20 29.8C22.8 30.7 25.4 30.4 28.4 29" stroke="white" strokeWidth="1.35" strokeLinecap="round" opacity="0.45" />
                                    <defs>
                                        <linearGradient id="brandFill" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#2B8C66" />
                                            <stop offset="1" stopColor="#15513A" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            <div className="fp-brandbar__text">
                                <span className="fp-brandbar__name">SIGARROZ</span>
                                <span className="fp-brandbar__tag">Recuperación segura de acceso</span>
                            </div>
                        </header>

                        <div className="fp-showcase__content">
                            <div className="fp-hero">
                                <span className="fp-badge">Acceso protegido · flujo realista</span>
                                <h1 className="fp-hero__title">
                                    Recupera tu contraseña de forma clara y segura.
                                </h1>
                                <p className="fp-hero__text">
                                    Te ayudamos a restablecer el acceso sin exponer información sensible.
                                    Si la cuenta existe, recibirás instrucciones para continuar el proceso.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="fp-access" aria-label="Formulario de recuperación">
                    <div className="fp-access__card">
                        {!submitted ? (
                            <>
                                <div className="fp-access__topbar">
                                    <span className="fp-access__dot" aria-hidden="true" />
                                    <p>Recuperación de contraseña</p>
                                </div>

                                <div className="fp-access__header">
                                    <h2>¿Olvidaste tu contraseña?</h2>
                                    <p>
                                        Ingresa tu correo o usuario y te enviaremos instrucciones para
                                        recuperar el acceso.
                                    </p>
                                </div>

                                <form className="fp-form" onSubmit={handleSubmit} noValidate>
                                    <div className="fp-form-field">
                                        <label htmlFor="identifier" className="fp-form-label">
                                            Correo o usuario
                                        </label>
                                        <input
                                            id="identifier"
                                            type="text"
                                            className="fp-form-input"
                                            placeholder="Ingresa tu correo o usuario"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="fp-btn" disabled={loading}>
                                        {loading ? "Enviando instrucciones..." : "Enviar instrucciones"}
                                    </button>
                                </form>

                                <div className="fp-footer-links">
                                    <Link to="/" className="fp-link-secondary">
                                        Volver al inicio de sesión
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="fp-success-state">
                                <div className="fp-success-state__icon" aria-hidden="true">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 2 11 13" />
                                        <path d="M22 2 15 22 11 13 2 9 22 2z" />
                                    </svg>
                                </div>

                                <h2>Revisa tu correo</h2>
                                <p>
                                    Si la cuenta existe en el sistema, enviamos un enlace de recuperación
                                    con los pasos para restablecer la contraseña.
                                </p>

                                <div className="fp-footer-links fp-footer-links--center">
                                    <Link to="/" className="fp-link-secondary">
                                        Volver al inicio de sesión
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ForgotPasswordPage;