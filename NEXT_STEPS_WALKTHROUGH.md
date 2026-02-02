# Next Steps Walkthrough – Vital Edge Insurance
**For someone new to deploying, Search Console, and Google Business Profile**

This guide walks you through each step in plain language. Do them in order when you’re ready.

---

## Step 1: Deploy (Push to main so Vercel deploys)

**What this means:** Your code lives in a Git repo (e.g. GitHub). When you push to the `main` branch, Vercel automatically builds and publishes your site so the world can see it (including the new SEO metadata).

### 1A. Do you already have this project on GitHub and connected to Vercel?

- **If YES:** Skip to **1C** and push your changes.
- **If NO:** Do **1B** first, then **1C**.

### 1B. First-time setup: GitHub + Vercel

1. **Create a GitHub account** (if you don’t have one): [github.com](https://github.com)
2. **Create a new repository** on GitHub:
   - Click **New repository**
   - Name it something like `vital-edge-insurance`
   - Leave it empty (no README, no .gitignore)
   - Click **Create repository**
3. **Connect your project to that repo** (in Terminal, from your project folder):

   ```bash
   cd /Users/patrickmackiniv/Projects/vital-edge-insurance
   git init
   git add .
   git commit -m "Initial commit - Vital Edge Insurance site with SEO"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vital-edge-insurance.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your actual GitHub username. If GitHub asks for login, use your username + a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens).

4. **Connect the repo to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in (use “Continue with GitHub”).
   - Click **Add New…** → **Project**.
   - Import your `vital-edge-insurance` repo.
   - Leave defaults (Framework: Next.js, Root: .) and click **Deploy**.
   - When it’s done, Vercel gives you a URL like `vital-edge-insurance.vercel.app` (or your custom domain if you added one).

### 1C. Push your latest changes (including SEO)

From your project folder in Terminal:

```bash
cd /Users/patrickmackiniv/Projects/vital-edge-insurance
git status
git add .
git commit -m "SEO: Patrick Mackin IV metadata, Person schema, page titles"
git push origin main
```

- **If you see “nothing to commit”:** Your changes might already be committed; run `git push origin main` to update the remote.
- **If you get “remote not found” or “permission denied”:** You need to do 1B (create repo, add remote, connect Vercel).

After the push, Vercel will deploy automatically. Wait 1–2 minutes, then open your live URL (e.g. `https://vital-edge-insurance.vercel.app`).

---

## Step 2: Verify (Check that SEO is live)

**What this means:** Confirm that your live site has the new title and the Person schema so Google (and you) can see “Patrick Mackin IV” and the right metadata.

### 2A. Check the page title

1. Open your **live** site in a browser (e.g. `https://vital-edge-insurance.vercel.app` or your custom domain).
2. **View page source:**
   - **Mac:** Right‑click the page → **View Page Source** (or `Cmd + Option + U`).
   - **Windows:** Right‑click → **View page source** (or `Ctrl + U`).
3. In the source window, press **Cmd + F** (Mac) or **Ctrl + F** (Windows) to search.
4. Search for: **Patrick Mackin IV**
   - You should see it in the `<title>` tag near the top, e.g.  
     `Patrick Mackin IV | Vital Edge Insurance | Licensed Florida Health Insurance Agent in Jacksonville`.

### 2B. Check the Person schema (JSON-LD)

1. In the **same** page source, search for: **"@type": "Person"**
2. You should see a block of JSON that includes:
   - `"@type": "Person"`
   - `"name": "Patrick Mackin IV"`
   - `"jobTitle": "Licensed Health Insurance Agent"`
   - `"worksFor"` with Vital Edge Insurance

If both 2A and 2B are present, your SEO changes are live and correct.

---

## Step 3: Google Search Console (Submit sitemap and request indexing)

**What this means:** Search Console is Google’s tool for site owners. Submitting your sitemap helps Google discover and index your pages. Requesting indexing asks Google to crawl important URLs sooner.

### 3A. Add your site to Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Sign in with the Google account you want to use for the site.
3. Click **Add property** (or “Add property”).
4. Choose **URL prefix** and enter your full site URL, e.g.:
   - `https://vital-edge-insurance.vercel.app`
   - or `https://yourdomain.com` if you use a custom domain.
5. Click **Continue**.
6. **Verify ownership.** Google will suggest methods; the easiest is usually:
   - **HTML tag:** Copy the meta tag they give you. We can add it to your site’s `<head>` (in `layout.tsx` or via Vercel env), then you click “Verify” in Search Console.
   - **DNS:** If you have a custom domain, you can add a TXT record where your domain is hosted (e.g. Vercel, GoDaddy, Cloudflare).
   - **Google Analytics:** If the site already uses GA4 with that same domain, you can verify that way.
7. After verification, the property will show in your Search Console dashboard.

### 3B. Submit your sitemap

1. In Search Console, select your property (your site).
2. In the left sidebar, open **Sitemaps** (under “Indexing”).
3. Where it says “Add a new sitemap,” enter: **sitemap.xml**
4. Click **Submit**.
5. Status will change to “Success” once Google has read it (can take a few minutes to a few days).

Your sitemap URL is: **https://yourdomain.com/sitemap.xml** (replace with your real domain).

### 3C. Request indexing for key URLs (optional but useful)

1. In the left sidebar, click **URL Inspection** (under “Indexing”).
2. Paste a URL you care about, e.g.:
   - `https://vital-edge-insurance.vercel.app`
   - `https://vital-edge-insurance.vercel.app/about`
   - `https://vital-edge-insurance.vercel.app/aca`
   - `https://vital-edge-insurance.vercel.app/medicare`
   - `https://vital-edge-insurance.vercel.app/duval-county`
3. Press Enter. Google will show whether the URL is indexed.
4. If it says “URL is not on Google,” click **Request indexing**. If the button is there, click it to ask Google to crawl that URL sooner.

You don’t have to request every page; the homepage, /about, /aca, /medicare, and /duval-county are a good start.

---

## Step 4: Google Business Profile (Claim/optimize “Vital Edge Insurance” in Jacksonville)

**What this means:** A Google Business Profile is the listing that shows when people search “Vital Edge Insurance” or “health insurance agent Jacksonville” on Google (with map, hours, phone, etc.). Claiming and filling it out helps local SEO and builds trust.

### 4A. Claim or create your business

1. Go to [Google Business Profile](https://business.google.com) (or search “Google Business Profile”).
2. Sign in with the Google account you want to manage the business.
3. **If “Vital Edge Insurance” already appears in Google Maps/Search:**
   - Click **Add your business to Google** or **Manage now** and search for “Vital Edge Insurance, Jacksonville.”
   - If you find it, select it and choose **Claim this business**. Follow the steps to verify (postcard, phone, or email).
4. **If it doesn’t exist yet:**
   - Click **Add your business to Google**.
   - Enter **business name:** Vital Edge Insurance.
   - Choose **category:** e.g. “Insurance agency” or “Health insurance agency.”
   - Enter **location.** If you serve clients at an address in Jacksonville, add it; otherwise you can choose “I deliver goods and services to my customers” (service area only).
   - Add your **service area:** e.g. Jacksonville, Duval County, St. Johns County, Miami-Dade County.
   - Add **phone:** (352) 214-8879.
   - Add **website:** your live site URL (e.g. vital-edge-insurance.vercel.app or your custom domain).
   - Complete verification (postcard to address is common).

### 4B. Fill out the profile for SEO and trust

Once claimed, in the Business Profile dashboard (or via the “Edit profile” options in Google Search):

1. **Business name:** Vital Edge Insurance  
2. **Primary category:** Insurance agency / Health insurance agency  
3. **Address** (if you have a physical location) or **Service areas:** Jacksonville, Duval County, St. Johns County, Miami-Dade County, FL  
4. **Phone:** (352) 214-8879  
5. **Website:** Your live URL  
6. **Hours:** Your real business hours (or “By appointment”)  
7. **Short description (750 chars):** Use a sentence that includes:
   - **Patrick Mackin IV**, licensed Florida health insurance agent  
   - Vital Edge Insurance  
   - Jacksonville, Duval County, St. Johns County  
   - ACA Marketplace, Medicare, Medigap, ICHRA, small business health insurance  
   - Education-first, independent guidance  
8. **Services:** Add items like: ACA Marketplace enrollment, Medicare education, Medicare Supplement (Medigap), ICHRA, small group health insurance, health insurance guidance.  
9. **Photos:** Add a professional headshot of you and/or your logo so the listing looks complete.

Save all changes. It can take a few days for updates to show in Search and Maps.

---

## Quick reference

| Step | What you’re doing | Where |
|------|--------------------|--------|
| 1. Deploy | Push code to `main` so Vercel builds and publishes the site | Terminal: `git push origin main` |
| 2. Verify | Confirm “Patrick Mackin IV” in `<title>` and `"@type": "Person"` in source | Browser: View Page Source, search for those strings |
| 3. Search Console | Add property, submit sitemap, optionally request indexing | [search.google.com/search-console](https://search.google.com/search-console) |
| 4. Business Profile | Claim/optimize “Vital Edge Insurance” and add your name + areas | [business.google.com](https://business.google.com) |

---

## If something doesn’t work

- **Deploy:** If `git push` fails, check that the repo exists, the remote URL is correct, and you’re logged in (GitHub + Vercel).  
- **Verify:** If you don’t see the new title or Person schema, make sure you’re on the **live** URL (after Vercel deploy), not localhost. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R) and try again.  
- **Search Console:** Verification can take a few minutes. If the HTML tag method fails, try DNS or Google Analytics if you have them.  
- **Business Profile:** Verification by postcard often takes 5–14 days. Use the exact business address where you receive mail.

You can do Step 1 and 2 right after deploying; Steps 3 and 4 can be done in the next few days when you have time. The SEO implementation in the code is already complete and validated.
