import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";

// Temporary dev-only panel for testing Supabase Auth. Delete once the real login page exists.
function AuthTest() {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(() => {
        // Supabase puts failures (e.g. an expired invite link) in the URL hash
        const params = new URLSearchParams(window.location.hash.slice(1));
        return params.get("error_description") ?? "";
    });

    useEffect(() => {
        // Fires on load too, including when an invite/confirm link signs the user in
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("[AuthTest]", event, session);
            setSession(session);
        });
        return () => data.subscription.unsubscribe();
    }, []);

    async function run(label, action) {
        setMessage(`${label}...`);
        const { error } = await action();
        setMessage(error ? `${label} failed: ${error.message}` : `${label} OK`);
    }

    return (
        <div style={{ border: "2px dashed orange", padding: "1rem", margin: "1rem", maxWidth: "24rem" }}>
            <h2>Auth test (dev only)</h2>
            <p>
                {session
                    ? `Signed in as ${session.user.email} (${session.user.id})`
                    : "Not signed in"}
            </p>

            {!session && (
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            )}
            <input
                type="password"
                placeholder={session ? "new password" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {session ? (
                <div>
                    <button onClick={() => run("Set password", () => supabase.auth.updateUser({ password }))}>
                        Set password
                    </button>
                    <button onClick={() => run("Sign out", () => supabase.auth.signOut())}>
                        Sign out
                    </button>
                </div>
            ) : (
                <div>
                    <button onClick={() => run("Sign in", () => supabase.auth.signInWithPassword({ email, password }))}>
                        Sign in
                    </button>
                    <button onClick={() => run("Sign up", () => supabase.auth.signUp({ email, password }))}>
                        Sign up
                    </button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}

export default AuthTest;