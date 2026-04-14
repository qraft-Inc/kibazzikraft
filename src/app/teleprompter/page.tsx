"use client";

import { useEffect, useState } from "react";
import Teleprompter from "@/components/Teleprompter";

const initialScript = `Welcome to the Decent Work & Social Protection online course.
My name is Berivan.
As a Decent Work and Social Protection Expert, I will accompany your learning journey with pleasure.
Whether you work in a farm in Fort Portal, a construction site in Casablanca, a mine in Kolwezi, or an office in Dar es Salaam - this course is for you.

In this training you will learn:
What decent work means
Your rights and responsibilities at work
How to stay safe and healthy at work
What social protection is, why it matters for you and your family
What gender-based discrimination and violence mean at work
How to report workplace problems
Where to find support when needed

This might sound a lot, don't be afraid!
It will take a maximum of 2.5 hours to complete the whole course.
You can save and return whenever you want, you do not have to sit and complete it all at once.
There will be a short questionnaire to achieve for certification and a feedback survey to get your ideas about the course at the end. Please don't forget to fill it out!

Now, your learning journey to fair, safe, and empowering work starts here.
As Enabel team, we are happy to guide you.
Let's start!`;

export default function TeleprompterPage() {
  const [script, setScript] = useState(initialScript);
  const [draft, setDraft] = useState("");
  const [isTeleprompterPlaying, setIsTeleprompterPlaying] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("teleprompter-active", isTeleprompterPlaying);
    return () => {
      document.body.classList.remove("teleprompter-active");
    };
  }, [isTeleprompterPlaying]);

  const replaceScript = () => {
    if (!draft.trim()) return;
    setScript(draft.trim());
  };

  const appendScript = () => {
    if (!draft.trim()) return;
    setScript((prev) => `${prev}\n\n${draft.trim()}`);
    setDraft("");
  };

  return (
    <div className="space-y-4 bg-black px-0 pb-0 pt-4 sm:pt-6">
      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-zinc-100 sm:p-6">
        <h1 className="text-lg font-semibold sm:text-xl">Teleprompter Script</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your intro is preloaded. Paste extra sections below, then append or replace.
        </p>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Paste or type additional script here"
          className="mt-4 h-36 w-full resize-y rounded-lg border border-zinc-700 bg-black/60 p-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={appendScript}
            className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium transition hover:bg-zinc-700"
          >
            Append To Script
          </button>
          <button
            type="button"
            onClick={replaceScript}
            className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium transition hover:bg-zinc-700"
          >
            Replace Script
          </button>
          <button
            type="button"
            onClick={() => {
              setScript(initialScript);
              setDraft("");
            }}
            className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium transition hover:bg-zinc-700"
          >
            Reset To Intro Script
          </button>
        </div>
      </section>

      <Teleprompter script={script} onPlayingChange={setIsTeleprompterPlaying} />
    </div>
  );
}