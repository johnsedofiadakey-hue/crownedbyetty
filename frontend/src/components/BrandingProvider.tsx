"use client";

import { useEffect } from "react";

export default function BrandingProvider() {
  useEffect(() => {
    async function applyBranding() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/settings`);

        if (res.ok) {
          const settings = await res.json();
          const root = document.documentElement;

          if (settings.themeColors?.primary) {
            root.style.setProperty('--primary', settings.themeColors.primary);
          }
          if (settings.themeColors?.accent) {
            root.style.setProperty('--accent', settings.themeColors.accent);
          }

          if (settings.storeName) {
            document.title = `${settings.storeName} | Premium Hair Growth`;
          }
        }
      } catch (e) {
        console.error("Branding Handshake Failed:", e);
      }
    }

    applyBranding();
  }, []);

  return null;
}
