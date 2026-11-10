import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";

// Shared Tailwind classes for the panel's inputs and buttons. The base button class
// leaves out padding-x, border color, and font size: Tailwind doesn't let a later
// class override an earlier one of the same kind, so each variant sets its own.
const inputClass =
    "w-full rounded-[11px] border border-[#e7e0d5] bg-white px-3.5 py-3 font-normal text-[#28251f] outline-none transition placeholder:text-[#aaa397] focus:border-[#c86a34] focus:ring-3 focus:ring-[#c86a34]/15";
const buttonClass =
    "min-h-11 cursor-pointer rounded-[11px] border py-2.5 font-bold transition hover:-translate-y-px focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#c86a34]/35 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";
const primaryButtonClass = `${buttonClass} border-transparent bg-[#c45f2b] px-3.5 text-sm text-white hover:bg-[#a94e22]`;
const secondaryButtonClass = `${buttonClass} border-[#e7e0d5] bg-[#fffefa] px-3.5 text-sm text-[#49443b] hover:border-[#d7cabb] hover:bg-[#faf7f1]`;
const textButtonClass = `${buttonClass} border-transparent bg-transparent px-2 text-xs text-[#756d60] hover:bg-[#f6f1e9] hover:text-[#403a31]`;

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

    async function callBackend(withToken) {
        setMessage("Calling POST /api/users...");
        const res = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(withToken && session
                    ? { Authorization: `Bearer ${session.access_token}` }
                    : {}),
            },
            body: JSON.stringify({ username: "authtest" }),
        });
        const body = await res.json();
        setMessage(`${res.status}: ${body.error ?? JSON.stringify(body)}`);
    }

    return (
        <main className="grid min-h-screen place-items-center bg-[#faf7f1] bg-[radial-gradient(ellipse_at_15%_10%,rgb(255_220_175/45%),transparent_38%)] px-5 py-10 font-sans text-[#28251f]">
            <section
                className="w-full max-w-110 rounded-[20px] border border-[#eee5d8] bg-[#fffefa] px-5.5 py-6.5 shadow-[0_24px_70px_rgb(72_51_26/10%)] sm:rounded-3xl sm:p-9"
                aria-labelledby="auth-test-title"
            >
                <header className="mb-6.5">
                    <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[#b55b27]">
                        Developer tools
                    </span>
                    <h1
                        id="auth-test-title"
                        className="mt-2 mb-1.5 text-[clamp(1.8rem,6vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.045em]"
                    >
                        Authentication
                    </h1>
                    <p className="text-[0.95rem] leading-normal text-[#777166]">
                        Test your TasteBudd account and API connection.
                    </p>
                </header>

                <div
                    className={`mb-6 flex items-start gap-3 rounded-[14px] border px-4 py-3.5 ${
                        session ? "border-[#d8e9d8] bg-[#f2f8f0]" : "border-[#eee8dc] bg-[#f8f5ef]"
                    }`}
                >
                    <span
                        className={`mt-1.25 size-2.25 shrink-0 rounded-full ${
                            session ? "bg-[#4c9b57] ring-4 ring-[#4c9b57]/12" : "bg-[#a69d8f]"
                        }`}
                        aria-hidden="true"
                    />
                    <div>
                        <strong className="text-[0.9rem]">
                            {session ? "You're signed in" : "You're signed out"}
                        </strong>
                        {session && (
                            <p className="mt-1 text-[0.84rem] wrap-anywhere text-[#6f6a60]">
                                {session.user.email}
                                <span className="mt-0.75 block text-[0.72rem] text-[#999184]">
                                    {session.user.id}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-4">
                    {!session && (
                        <label className="grid gap-1.75 text-[0.82rem] font-semibold text-[#48443c]">
                            <span>Email address</span>
                            <input
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={inputClass}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                    )}
                    <label className="grid gap-1.75 text-[0.82rem] font-semibold text-[#48443c]">
                        <span>{session ? "New password" : "Password"}</span>
                        <input
                            type="password"
                            autoComplete={session ? "new-password" : "current-password"}
                            placeholder="Enter your password"
                            className={inputClass}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </div>

                {session ? (
                    <div className="mt-5 grid gap-2.5">
                        <button className={primaryButtonClass} onClick={() => run("Set password", () => supabase.auth.updateUser({ password }))}>
                            Set password
                        </button>
                        <button className={secondaryButtonClass} onClick={() => run("Sign out", () => supabase.auth.signOut())}>
                            Sign out
                        </button>
                    </div>
                ) : (
                    <div className="mt-5 grid gap-2.5">
                        <button className={primaryButtonClass} onClick={() => run("Sign in", () => supabase.auth.signInWithPassword({ email, password }))}>
                            Sign in
                        </button>
                        <button className={secondaryButtonClass} onClick={() => run("Sign up", () => supabase.auth.signUp({ email, password }))}>
                            Create account
                        </button>
                    </div>
                )}

                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#eee8dc] pt-3.75">
                    <button className={textButtonClass} disabled={!session} onClick={() => callBackend(true)}>
                        Call API (with token)
                    </button>
                    <button className={textButtonClass} onClick={() => callBackend(false)}>
                        Call API (no token)
                    </button>
                </div>

                {message && (
                    <p
                        className="mt-4.5 rounded-[10px] bg-[#f7f1e7] px-3.5 py-3 text-[0.86rem] leading-normal wrap-anywhere text-[#5d4b34]"
                        role="status"
                        aria-live="polite"
                    >
                        {message}
                    </p>
                )}

                <span className="mt-6 block text-center text-[0.72rem] text-[#a59d90]">
                    Temporary development panel
                </span>
            </section>
        </main>
    );
}

export default AuthTest;
