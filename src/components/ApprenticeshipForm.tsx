"use client";

import { useState } from "react";
import { siteContact } from "@/data/site";

const initialState = {
  name: "",
  email: "",
  phone: "",
  experience: "",
};

export default function ApprenticeshipForm() {
  const [form, setForm] = useState(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const message = [
      "Apprenticeship Application",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Experience: ${form.experience}`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `${siteContact.whatsappUrl}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        name="name"
        placeholder="Full name"
        required
        value={form.name}
        onChange={handleChange}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm"
      />
      <input
        name="email"
        type="email"
        placeholder="Email address"
        required
        value={form.email}
        onChange={handleChange}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm"
      />
      <input
        name="phone"
        placeholder="Phone number"
        required
        value={form.phone}
        onChange={handleChange}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm"
      />
      <input
        name="experience"
        placeholder="Experience level (Beginner/Intermediate/Pro)"
        required
        value={form.experience}
        onChange={handleChange}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm"
      />
      <button type="submit" className="btn-primary">
        Apply Now
      </button>
      <p className="text-xs text-zinc-500">
        Submissions open WhatsApp with your details prefilled.
      </p>
    </form>
  );
}
