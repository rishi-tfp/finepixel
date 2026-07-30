"use client";

import { useEffect } from "react";

/** Customizer studio is hidden for now — send traffic to the homepage section. */
export default function CustomizerPage() {
  useEffect(() => {
    window.location.replace("/#customizer");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center font-body-md text-on-surface-variant">
      Opening customizer…
    </div>
  );
}
