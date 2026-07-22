"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api(
        "/api/auth/register",
        { method: "POST", body: JSON.stringify({ email, password }) },
        { redirectOnAuth: false }
      );
      const data = await res.json();
      setToken(data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg"
      >
        <h1 className="mb-4 text-2xl font-semibold">Register</h1>
        {error && (
          <p className="mb-3 rounded bg-red-900/40 p-2 text-sm text-red-200">
            {error}
          </p>
        )}
        <label className="mb-1 block text-sm text-slate-400">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-indigo-500"
        />
        <label className="mb-1 block text-sm text-slate-400">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mb-6 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 py-2 font-medium hover:bg-indigo-500"
        >
          Create account
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
