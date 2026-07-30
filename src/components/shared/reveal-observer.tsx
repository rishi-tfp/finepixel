"use client";

import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    const revealCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, {
      threshold: 0.1,
    });

    document.querySelectorAll("main section").forEach((section) => {
      section.classList.add("reveal");
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
