const DEFAULT_MESSAGE =
  "Hi! I'd like to order a customized Fine Pixel notebook.";

export const WHATSAPP_QUOTE_MESSAGE =
  "Hi! I'd like to request a quote for Fine Pixel corporate / bulk stationery.";

/** Digits-only phone with country code, e.g. 9198XXXXXXXX */
export function getWhatsAppNumber() {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
}

export function getWhatsAppOrderUrl(message = DEFAULT_MESSAGE) {
  const phone = getWhatsAppNumber();
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
