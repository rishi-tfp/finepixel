import { shopifyFetch } from "@/lib/shopify/client";
import {
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_RENEW_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_QUERY,
} from "@/lib/shopify/queries";

export type ShopifyCustomer = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  defaultAddress: {
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
  } | null;
};

export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

type UserError = { field?: string[] | null; message: string; code?: string };

function firstError(errors: UserError[] | undefined, fallback: string) {
  return errors?.[0]?.message || fallback;
}

type CustomerCreateResponse = {
  customerCreate: {
    customer: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
    customerUserErrors: UserError[];
  };
};

type TokenCreateResponse = {
  customerAccessTokenCreate: {
    customerAccessToken: CustomerAccessToken | null;
    customerUserErrors: UserError[];
  };
};

type TokenDeleteResponse = {
  customerAccessTokenDelete: {
    deletedAccessToken: string | null;
    userErrors: UserError[];
  };
};

type TokenRenewResponse = {
  customerAccessTokenRenew: {
    customerAccessToken: CustomerAccessToken | null;
    userErrors: UserError[];
  };
};

type CustomerQueryResponse = {
  customer: ShopifyCustomer | null;
};

export async function shopifyCustomerCreate(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}) {
  const data = await shopifyFetch<CustomerCreateResponse>(
    CUSTOMER_CREATE_MUTATION,
    { input },
  );
  const errors = data.customerCreate.customerUserErrors;
  if (errors?.length || !data.customerCreate.customer) {
    throw new Error(firstError(errors, "Could not create account"));
  }
  return data.customerCreate.customer;
}

export async function shopifyCustomerLogin(email: string, password: string) {
  const data = await shopifyFetch<TokenCreateResponse>(
    CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    { input: { email, password } },
  );
  const payload = data.customerAccessTokenCreate;
  if (payload.customerUserErrors?.length || !payload.customerAccessToken) {
    throw new Error(
      firstError(payload.customerUserErrors, "Invalid email or password"),
    );
  }
  return payload.customerAccessToken;
}

export async function shopifyCustomerLogout(accessToken: string) {
  try {
    await shopifyFetch<TokenDeleteResponse>(
      CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
      { customerAccessToken: accessToken },
    );
  } catch {
    /* token may already be invalid */
  }
}

export async function shopifyCustomerRenew(accessToken: string) {
  const data = await shopifyFetch<TokenRenewResponse>(
    CUSTOMER_ACCESS_TOKEN_RENEW_MUTATION,
    { customerAccessToken: accessToken },
  );
  return data.customerAccessTokenRenew.customerAccessToken;
}

export async function shopifyGetCustomer(accessToken: string) {
  const data = await shopifyFetch<CustomerQueryResponse>(CUSTOMER_QUERY, {
    customerAccessToken: accessToken,
  });
  return data.customer;
}
