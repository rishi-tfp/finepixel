import type { CatalogProduct } from "@/lib/shopify/mappers";
import type { CartLineAttribute } from "@/lib/shopify/types";

export type CoverColor = {
  hex: string;
  label: string;
};

export type MaterialTexture = {
  id: "leather" | "linen";
  label: string;
  description: string;
};

export type BindingStyle = {
  id: "hardcover" | "spiral";
  label: string;
  description: string;
};

export type FoilColor = {
  hex: string;
  label: string;
};

export type CustomizerConfig = {
  color: CoverColor;
  texture: MaterialTexture;
  binding: BindingStyle;
  foilText: string;
  foilColor: FoilColor;
};

export const COVER_COLORS: CoverColor[] = [
  { hex: "#111111", label: "Jet Black" },
  { hex: "#2C3E50", label: "Midnight Navy" },
  { hex: "#785929", label: "Heritage Tan" },
  { hex: "#E5E2E1", label: "Stone Grey" },
];

export const MATERIALS: MaterialTexture[] = [
  {
    id: "leather",
    label: "Fine Grain Leather",
    description: "Italian calfskin with subtle pebbled finish",
  },
  {
    id: "linen",
    label: "Woven Belgian Linen",
    description: "Organic tactile weave with matte finish",
  },
];

export const BINDINGS: BindingStyle[] = [
  {
    id: "hardcover",
    label: "Classic Hardcover",
    description: "Lay-flat library binding for archival longevity.",
  },
  {
    id: "spiral",
    label: "Steel Spiral",
    description: "Black oxidized steel for maximum flexibility.",
  },
];

export const FOIL_COLORS: FoilColor[] = [
  { hex: "#C9A26B", label: "Gold" },
  { hex: "#EAEAEA", label: "Silver" },
  { hex: "#000000", label: "Charcoal" },
];

export const DEFAULT_CUSTOMIZER: CustomizerConfig = {
  color: COVER_COLORS[1],
  texture: MATERIALS[0],
  binding: BINDINGS[0],
  foilText: "",
  foilColor: FOIL_COLORS[0],
};

const DRAFT_KEY = "tfp-customizer-draft-v1";

export function loadCustomizerDraft(): CustomizerConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CustomizerConfig;
    if (!data?.color?.hex || !data?.binding?.id) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveCustomizerDraft(config: CustomizerConfig) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(config));
}

export function clearCustomizerDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

/** Prefer a product tagged `customizer`, else match binding edition. */
export function resolveCustomizerProduct(
  products: CatalogProduct[],
  binding: BindingStyle["id"],
): CatalogProduct | undefined {
  const available = products.filter((p) => p.available && p.defaultVariantId);
  if (available.length === 0) return undefined;

  const tagged = available.find((p) =>
    p.tags.some((t) => t.toLowerCase() === "customizer"),
  );
  if (tagged) return tagged;

  if (binding === "spiral") {
    return (
      available.find((p) => p.edition === "softcover") ??
      available.find((p) =>
        p.tags.some((t) => /spiral|softcover/i.test(t)),
      ) ??
      available[0]
    );
  }

  return (
    available.find((p) => p.edition === "hardcover") ??
    available.find((p) => p.tags.some((t) => /hardcover/i.test(t))) ??
    available[0]
  );
}

export function buildCustomizerAttributes(
  config: CustomizerConfig,
): CartLineAttribute[] {
  const attributes: CartLineAttribute[] = [
    { key: "Studio", value: "Customizer" },
    { key: "Cover Color", value: config.color.label },
    { key: "Material", value: config.texture.label },
    { key: "Binding", value: config.binding.label },
    { key: "Foil Color", value: config.foilColor.label },
  ];

  const text = config.foilText.trim().toUpperCase().slice(0, 12);
  if (text) {
    attributes.push({ key: "Embossing", value: text });
  }

  return attributes;
}

export function customizerDetailLine(config: CustomizerConfig) {
  const parts = [
    config.color.label,
    config.texture.label,
    config.binding.label,
  ];
  const text = config.foilText.trim().toUpperCase();
  if (text) parts.push(`“${text}” ${config.foilColor.label}`);
  return parts.join(" · ");
}
