"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bubble-card p-8 text-center animate-in fade-in duration-500">
      <h1 className="text-2xl font-light tracking-widest uppercase mb-8">Admin Access</h1>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Admin Password"
            className="w-full px-4 py-3 bg-transparent border-b border-color-beige-400 dark:border-dark-100 focus:outline-none focus:border-foreground transition-colors text-center font-mono tracking-widest"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-foreground text-background uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors rounded-sm"
        >
          Login
        </button>
      </form>
    </div>
  );
}
