"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, clearToken } from "@/lib/api";

type User = {
  id: number;
  email: string;
  created_at: string;
};

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Chat() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api("/api/auth/me", {}, { redirectOnAuth: false })
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setBusy(true);

    try {
      const res = await api("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "(no reply)" },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Error: ${err.message}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    clearToken();
    setUser(null);
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">A8 Persona Chat</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{user?.email}</span>
          <button
            onClick={logout}
            className="rounded border border-slate-700 px-3 py-1 text-sm hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
        {messages.length === 0 && (
          <p className="text-center text-slate-500">
            Send a message to start chatting.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-100"
            }`}
          >
            {m.text}
          </div>
        ))}
        {busy && (
          <div className="max-w-[80%] rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-400">
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={busy}
          className="flex-1 rounded border border-slate-700 bg-slate-950 px-4 py-2 outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
