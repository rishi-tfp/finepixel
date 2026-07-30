type ShopifyMoney = { amount: string; currencyCode: string };

type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price?: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
  selectedOptions?: { name: string; value: string }[];
};

type ShopifyImage = { url: string; altText?: string | null };

export type ShopifyProductOption = {
  name: string;
  values: string[];
};

export type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  productType?: string;
  tags?: string[];
  options?: ShopifyProductOption[];
  featuredImage?: ShopifyImage | null;
  images?: { edges: { node: ShopifyImage }[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode?: string } };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode?: string };
  };
  variants?: { edges: { node: ShopifyVariant }[] };
  publishedAt?: string | null;
};

export type CartLineAttribute = {
  key: string;
  value: string;
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
  attributes?: CartLineAttribute[];
};
