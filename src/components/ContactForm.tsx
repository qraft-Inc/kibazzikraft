"use client";

import { useState } from "react";
import { siteContact } from "@/data/site";

const initialState = {
  name: "",
  email: "",
  eventType: "",
  date: "",
  budget: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    const message = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Event type: ${form.eventType}`,
      `Date: ${form.date}`,
      `Budget: ${form.budget}`,
      `Message: ${form.message}`,
    ]
      .filter((line) => !line.endsWith(": "))
      .join("\n");

    const url = `${siteContact.whatsappUrl}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("sent");
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <input
          name="eventType"
          placeholder="Event type"
          value={form.eventType}
          onChange={handleChange}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm"
        />
        <input
          name="budget"
          placeholder="Budget (UGX)"
          value={form.budget}
          onChange={handleChange}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm"
        />
      </div>
      <textarea
        name="message"
        placeholder="Tell us about your event"
        rows={5}
        value={form.message}
        onChange={handleChange}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm"
      />
      <button type="submit" className="btn-primary">
        {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Send Inquiry"}
      </button>
      <p className="text-xs text-zinc-500">
        Your inquiry opens in WhatsApp with the details prefilled.
      </p>
    </form>
  );
}
