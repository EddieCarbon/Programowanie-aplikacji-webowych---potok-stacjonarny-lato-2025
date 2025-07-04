"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Wszystkie pola są wymagane.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Hasła muszą być takie same.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Błąd rejestracji");
      setSuccess(
        "Rejestracja zakończona sukcesem! Możesz się teraz zalogować."
      );
      setForm({ name: "", email: "", password: "", confirm: "" });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Wystąpił nieznany błąd.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold mb-4">Rejestracja</h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <Input
          placeholder="Imię i nazwisko"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Hasło"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Powtórz hasło"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Rejestruję..." : "Zarejestruj się"}
        </Button>
      </form>
    </div>
  );
}
