# Go live — thefinepixel.com

Follow these steps **in order**. Tick each one when done.

## Part A — Put the website on the internet

### 1. Create a GitHub repo (if you don’t have one)
1. Open [github.com/new](https://github.com/new)
2. Name it `the-fine-pixel` (or similar), keep it **Private** if you prefer
3. Do **not** add a README (this project already has files)
4. In Terminal, from the project folder:

```bash
cd "/Users/pradhum.bansal/The Fine Pixel "
git remote add origin https://github.com/YOUR_USERNAME/the-fine-pixel.git
git add -A
git status   # check nothing sensitive like .env.local is staged
git commit -m "Prepare site for thefinepixel.com launch"
git push -u origin main
```

(Ask the agent to run the git commit/push for you if you want.)

### 2. Deploy on Vercel
1. Open [vercel.com](https://vercel.com) → sign in with GitHub
2. **Add New Project** → import `the-fine-pixel`
3. Framework: Next.js (auto-detected)
4. **Environment Variables** — add these (same values as `.env.local`):

| Name | Value |
|------|--------|
| `SHOPIFY_STORE_DOMAIN` | `the-fine-pixel-2.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | *(from `.env.local`)* |
| `SHOPIFY_API_VERSION` | `2026-01` |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `the-fine-pixel-2.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_ENABLED` | `true` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.thefinepixel.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919412814189` |

5. Click **Deploy** and wait until it succeeds
6. You’ll get a temporary URL like `something.vercel.app` — open it and confirm the site loads

### 3. Connect your domain
1. In Vercel → your project → **Settings → Domains**
2. Add `www.thefinepixel.com`
3. Add `thefinepixel.com`
4. Vercel will show DNS records. In your domain registrar (where you bought thefinepixel.com):
   - For **www**: usually a **CNAME** → `cname.vercel-dns.com` (use the exact value Vercel shows)
   - For **apex** (`thefinepixel.com`): usually an **A** record → Vercel’s IP (exact value from Vercel)
5. In Vercel, set **www.thefinepixel.com** as the **primary** domain
6. Redirect `thefinepixel.com` → `www.thefinepixel.com`
7. Wait 10–60 minutes for DNS, then open https://www.thefinepixel.com

### 4. Confirm SEO files
After the domain works, open:
- https://www.thefinepixel.com/sitemap.xml
- https://www.thefinepixel.com/robots.txt

---

## Part B — Shopify (so checkout doesn’t send people to the wrong store)

### 5. Checkout logo → your site
1. Shopify Admin → **Online Store → Themes**
2. Current theme → **⋯ → Edit code**
3. Open `layout/theme.liquid`
4. Paste the contents of `shopify/theme-headless-redirect.liquid` as the **first thing inside `<head>`**
5. Save
6. Test: start checkout → click Fine Pixel logo → should land on https://www.thefinepixel.com

### 6. Hide the old Online Store (optional but recommended)
1. Shopify Admin → **Online Store → Preferences**
2. Enable **password protection** so customers can’t browse the Liquid shop by accident

### 8. Discount code WELCOME30
1. Shopify Admin → **Discounts → Create discount**
2. Code: `WELCOME30`
3. Match your offer (e.g. 30% off when buying 3 notebooks)
4. Save, then test Apply on `/bag`

---

## Part C — Smoke test (buy like a customer)
1. Open https://www.thefinepixel.com
2. Open a product → **Add to Bag**
3. `/bag` → coupon (optional) → **Proceed to Checkout**
4. Complete a small real/test order if possible
5. Logo on checkout should return to your site (after step 5)

---

## Done when
- [ ] Site opens on https://www.thefinepixel.com
- [ ] Products load from Shopify
- [ ] Bag → checkout works
- [ ] Checkout logo returns to your site
- [ ] `/sitemap.xml` loads
