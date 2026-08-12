"use client";

import { useState } from "react";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/me", {
                method: "GET",
                headers: {
                    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Invalid login");
            }

            const auth = await response.json();

            if (!auth.admin) {
                throw new Error("Not admin");
            }

            sessionStorage.setItem(
                "adminAuth",
                `Basic ${btoa(`${username}:${password}`)}`
            );

            window.location.href = "/portfolio";
        } catch {
            setError("Invalid admin login.");
        }
    };

    return (
        <main className="admin-login">
            <form onSubmit={handleLogin}>
                <h1>Admin Login</h1>

                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </label>

                {error && <p>{error}</p>}

                <button type="submit">Login</button>
            </form>
        </main>
    );
}