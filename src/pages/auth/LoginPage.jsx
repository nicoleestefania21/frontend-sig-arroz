import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (formData) => {
    setError("");
    const result = login(formData);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/inicio");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h2>SIG-ARROZ</h2>
          <p>Plataforma para la planificación, control y monitoreo del cultivo de arroz.</p>
        </div>

        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
}

export default LoginPage;