import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [gmail, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/usuarios/login", {
                gmail,
                password,
            });
            localStorage.setItem("token", response.data.token);
            navigate("/"); // Redirigir al home después de iniciar sesión
        } catch (err) {
            setError("Usuario o contraseña incorrectos");
        }
    };
    const handleGoBack = () => {
        navigate(-1); // Volver a la página anterior
    };
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
                <div className="container mt-5">
                    <h2>Iniciar Sesión</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Usuario</label>
                            <input type="text" className="form-control" value={gmail} onChange={(e) => setUser(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                    </form>
                    <button onClick={handleGoBack} className="btn btn-secondary w-100 mt-3">
                        Volver
                    </button>
                </div>
            </div>

        </div>

    );
}

export default Login;
