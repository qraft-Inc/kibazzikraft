"use client";

import { useEffect, useState } from "react";
import Teleprompter from "@/components/Teleprompter";

export default function TeleprompterPage() {
  const [isTeleprompterPlaying, setIsTeleprompterPlaying] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("teleprompter-active", isTeleprompterPlaying);
    return () => {
      document.body.classList.remove("teleprompter-active");
    };
  }, [isTeleprompterPlaying]);

  return (
    <div className="bg-black">
      <Teleprompter onPlayingChange={setIsTeleprompterPlaying} />
    </div>
  );
}