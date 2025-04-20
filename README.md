# 🛍️ Cloudinary AI Re‑Color Demo Store

> A modern demo shop to generate color variants using Cloudinary AI.

![Cloudinary AI Recolor Preview](preview.png)

---

## ✨ Features

- Upload a product image
- Instantly generate unlimited color variants via **Cloudinary Generative Recolor**
- Reusable watermark overlay
- JSON-based data persistence (no database)
- Built with **Next.js 15**, **Tailwind CSS 4**, **shadcn/ui**, and **Motion.dev**

---

## 🛠 Built With

[![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=next.js)](https://nextjs.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-AI--powered-lightblue?logo=cloudinary)](https://cloudinary.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/github/license/musebe/cloudinary-ai-recolor)](./LICENSE)

---

## 📚 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [.env Configuration](#env-configuration)
- [One-Time Watermark Upload](#one-time-watermark-upload)
- [Available Scripts](#available-scripts)
- [Deploying](#deploying)
- [Useful Links](#useful-links)

---

## ✅ Prerequisites

- **Node.js 18+** (tested on Node 20)

```bash
nvm install 20
nvm use 20
```

- A free [Cloudinary](https://cloudinary.com/) account  
  → Grab your **Cloud Name**, **API Key**, and **API Secret**

---

## 🚀 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/musebe/cloudinary-ai-recolor.git
cd cloudinary-ai-recolor

# 2. Install dependencies
npm install  # or pnpm / yarn / bun

# 3. Add environment variables
cp .env.example .env.local
#    → Paste your Cloudinary keys in .env.local

# 4. Run the dev server
npm run dev
#    → Visit http://localhost:3000
```

---

## ⚙️ .env Configuration

Create a `.env.local` file in the root directory with the following:

| Key                                 | Example             | Description                              |
|-------------------------------------|---------------------|------------------------------------------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `my-cloud`          | Public Cloudinary cloud name             |
| `NEXT_PUBLIC_CLOUDINARY_FOLDER`     | `demo-store`        | Folder for all assets                    |
| `CLOUDINARY_API_KEY`                | `123456789012345`   | API Key (server-side use)                |
| `CLOUDINARY_API_SECRET`             | `s0m3-sup3r-s3cr3t` | API Secret (server-side use)             |

> ⚠️ Do **not** commit real keys. `.env.local` is in `.gitignore`.

---

## 🖼️ One-Time Watermark Upload

The app expects `demo-store/watermark.png` to exist in Cloudinary.

Upload your watermark manually or run this script (after `.env.local` is set):

```bash
node - <<'JS'
const { v2: cld } = require('cloudinary');
cld.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
cld.uploader.upload('watermark.png', {
  folder:    process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
  public_id: 'watermark'
}).then(r => console.log('✅ Watermark uploaded →', r.secure_url))
  .catch(console.error);
JS
```

---

## 📜 Available Scripts

| Command                   | Description                            |
|---------------------------|----------------------------------------|
| `npm run dev`             | Start local dev server                 |
| `npm run build`           | Build the app                          |
| `npm run start`           | Run production server                  |
| `npm run lint`            | Run ESLint and TypeScript checks       |

---

## 🌍 Deployment

This repo is ready for **Vercel**:

1. Push to GitHub
2. Import into [vercel.com](https://vercel.com/)
3. Add the same environment variables
4. Click **Deploy**

Also works with **Netlify** and **Render** — just set the same env vars.

---

## 🔗 Useful Links

- 📘 [Generative Recolor Docs](https://cloudinary.com/documentation/transformation_reference#e_gen_recolor)
- 💫 [Motion.dev](https://motion.dev)
- 🧠 [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- 🛠 [shadcn/ui](https://ui.shadcn.com)

---

**Enjoy building — and recoloring — your store!** 🌈🛒