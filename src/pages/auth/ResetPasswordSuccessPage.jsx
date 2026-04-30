import { Link } from "react-router-dom";
import "../../styles/forgot-password.css";

function ResetPasswordSuccessPage() {
    return (
        <div className="fp-shell">
            <div className="fp-shell__glow fp-shell__glow--one" />
            <div className="fp-shell__glow fp-shell__glow--two" />

            <main className="fp-frame fp-frame--compact">
                <section className="fp-access fp-access--single" aria-label="Confirmación exitosa">
                    <div className="fp-access__card">
                        <div className="fp-success-state fp-success-state--full">
                            <div className="fp-success-state__icon" aria-hidden="true">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </div>

                            <h2>Contraseña actualizada</h2>
                            <p>
                                El acceso fue restablecido correctamente. Ya puedes iniciar sesión con
                                tu nueva contraseña.
                            </p>

                            <div className="fp-footer-links fp-footer-links--center">
                                <Link to="/" className="fp-btn fp-btn--link">
                                    Ir al inicio de sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ResetPasswordSuccessPage;