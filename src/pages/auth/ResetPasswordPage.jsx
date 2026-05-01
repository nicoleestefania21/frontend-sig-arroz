import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { API } from "../../api";
import "../../styles/forgot-password.css";

function ResetPasswordPage() {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (form.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API.users}/password-reset-confirm/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uidb64,
                    token,
                    password: form.password,
                    confirm_password: form.confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "No se pudo actualizar la contraseña.");
            }

            navigate("/recuperar-contrasena/exito", { replace: true });
        } catch (err) {
            setError(err.message || "Ocurrió un error al actualizar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fp-shell">
            <div className="fp-shell__glow fp-shell__glow--one" />
            <div className="fp-shell__glow fp-shell__glow--two" />

            <main className="fp-frame fp-frame--compact">
                <section className="fp-access fp-access--single" aria-label="Nueva contraseña">
                    <div className="fp-access__card">
                        <div className="fp-access__topbar">
                            <span className="fp-access__dot" aria-hidden="true" />
                            <p>Actualización segura de credenciales</p>
                        </div>

                        <div className="fp-access__header">
                            <h2>Crear nueva contraseña</h2>
                            <p>
                                Define una nueva contraseña para recuperar el acceso a tu cuenta en
                                SIGARROZ.
                            </p>
                        </div>

                        {tokenPreview ? (
                            <div className="fp-token-chip">Enlace de recuperación válido</div>
                        ) : (
                            <div className="fp-error" role="alert">
                                No se encontró un token de recuperación válido.
                            </div>
                        )}

                        {error && (
                            <div className="fp-error" role="alert">
                                {error}
                            </div>
                        )}

                        <form className="fp-form" onSubmit={handleSubmit} noValidate>
                            <div className="fp-form-field">
                                <label htmlFor="password" className="fp-form-label">
                                    Nueva contraseña
                                </label>

                                <div className="fp-input-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="fp-form-input fp-form-input--password"
                                        placeholder="Ingresa tu nueva contraseña"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="fp-eye-btn"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                            </div>

                            <div className="fp-form-field">
                                <label htmlFor="confirmPassword" className="fp-form-label">
                                    Confirmar contraseña
                                </label>

                                <div className="fp-input-wrapper">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        name="confirmPassword"
                                        className="fp-form-input fp-form-input--password"
                                        placeholder="Confirma tu nueva contraseña"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="fp-eye-btn"
                                        onClick={() => setShowConfirm((prev) => !prev)}
                                        aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                                    >
                                        {showConfirm ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                            </div>

                            <div className="fp-rules">
                                <span>Recomendaciones</span>
                                <ul>
                                    <li>Mínimo 8 caracteres.</li>
                                    <li>Combina letras, números y signos si es posible.</li>
                                    <li>Evita reutilizar tu contraseña anterior.</li>
                                </ul>
                            </div>

                            <button type="submit" className="fp-btn" disabled={loading || !tokenPreview}>
                                {loading ? "Actualizando contraseña..." : "Actualizar contraseña"}
                            </button>
                        </form>

                        <div className="fp-footer-links">
                            <Link to="/" className="fp-link-secondary">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ResetPasswordPage;