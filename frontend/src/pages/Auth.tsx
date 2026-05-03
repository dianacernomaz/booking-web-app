import { useState } from "react";
import "./Home.css";

type Mode = "login" | "register";

type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const LS_USER = "auth_user_demo_v2";
const LS_SESSION = "auth_session_demo_v2";

export default function Auth() {
    const [mode, setMode] = useState<Mode>("login");
    const [showPassword, setShowPassword] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    function saveUser(user: User) {
        localStorage.setItem(LS_USER, JSON.stringify(user));
    }

    function getUser(): User | null {
        const raw = localStorage.getItem(LS_USER);
        if (!raw) return null;
        return JSON.parse(raw);
    }

    function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setMessage({ type: "error", text: "Completează toate câmpurile." });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: "error", text: "Parola trebuie să aibă minim 6 caractere." });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Parolele nu coincid." });
            return;
        }

        saveUser({ firstName, lastName, email, password });

        setMessage({ type: "success", text: "Cont creat cu succes. Te poți loga." });
        setMode("login");
    }

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        const user = getUser();
        if (!user) {
            setMessage({ type: "error", text: "Nu există cont. Creează unul." });
            return;
        }

        if (user.email !== email || user.password !== password) {
            setMessage({ type: "error", text: "Email sau parolă incorectă." });
            return;
        }

        localStorage.setItem(LS_SESSION, JSON.stringify({ email }));

        setMessage({ type: "success", text: `Bine ai venit, ${user.firstName}!` });

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    }

    return (
        <div style={wrapper}>
            <div style={card}>
                <h2 style={{ textAlign: "center", marginBottom: 10 }}>
                    {mode === "login" ? "Autentificare" : "Creează cont"}
                </h2>

                <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 20 }}>
                    {mode === "login"
                        ? "Intră în contul tău pentru a gestiona rezervările."
                        : "Înregistrează-te pentru a face rezervări rapide."}
                </p>

                {message && (
                    <div
                        style={
                            message.type === "error"
                                ? errorBox
                                : successBox
                        }
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
                    {mode === "register" && (
                        <>
                            <input
                                style={input}
                                placeholder="Prenume"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                style={input}
                                placeholder="Nume"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </>
                    )}

                    <input
                        style={input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div style={{ position: "relative" }}>
                        <input
                            style={{ ...input, paddingRight: 45 }}
                            type={showPassword ? "text" : "password"}
                            placeholder="Parolă"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={eyeButton}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {mode === "register" && (
                        <input
                            style={input}
                            type="password"
                            placeholder="Confirmă parola"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}

                    <button type="submit" style={mainButton}>
                        {mode === "login" ? "Logare" : "Înregistrare"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: 15 }}>
                    {mode === "login" ? (
                        <>
                            Nu ai cont?{" "}
                            <span style={link} onClick={() => setMode("register")}>
                Înregistrează-te
              </span>
                        </>
                    ) : (
                        <>
                            Ai deja cont?{" "}
                            <span style={link} onClick={() => setMode("login")}>
                Loghează-te
              </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* STYLES */

const wrapper: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: 20,
};

const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    background: "white",
    padding: 30,
    borderRadius: 18,
    boxShadow: "0 25px 40px rgba(0,0,0,0.15)",
};

const input: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 14,
};

const mainButton: React.CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 5,
};

const link: React.CSSProperties = {
    color: "#2563eb",
    fontWeight: 600,
    cursor: "pointer",
};

const errorBox: React.CSSProperties = {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
};

const successBox: React.CSSProperties = {
    background: "#d1fae5",
    color: "#065f46",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
};

const eyeButton: React.CSSProperties = {
    position: "absolute",
    right: 10,
    top: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
};
