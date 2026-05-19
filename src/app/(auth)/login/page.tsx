"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message || "Invalid credentials");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-1" />
      <div className="login-bg-2" />

      <div className="login-card card-glass">
        <h1 className="login-title">
          HI<span style={{ color: "var(--color-primary)" }}>MA</span> Admin
        </h1>
        <p className="login-subtitle">
          Sign in to manage your organization&apos;s content
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div
              style={{
                padding: "var(--space-3) var(--space-4)",
                background: "oklch(0.6 0.2 25 / 0.08)",
                border: "1px solid oklch(0.6 0.2 25 / 0.2)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-danger)",
                fontSize: "var(--text-sm)",
              }}
            >
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="admin@hima.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: "100%", marginTop: "var(--space-2)" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
