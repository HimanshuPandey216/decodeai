# DECODE AI — Learn AI. Build Future.

> **Decode AI** is a modern, high-performance, community-driven educational platform designed for discovering, reading, sharing, and contributing high-quality study materials for Artificial Intelligence, Machine Learning, Data Science, Deep Learning, Generative AI, LLMs, and AI Engineering.

---

## 🚀 Quick Start (Local Setup)

Decode AI is built as a static-first, zero-dependency platform. No complicated build pipeline or package installation is required to preview the site locally!

### Option 1: Using Python (Recommended)
Open your terminal in the `decodeai/` folder and run:
```bash
python -m http.server 8000
```
Then visit [`http://localhost:8000`](http://localhost:8000) in your browser.

### Option 2: Using Node.js `serve`
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 🎨 Brand & Logo Replacement Guide

Decode AI comes equipped with an automated logo fallback system.

- **Official Logo Location**: `assets/logo.png`
- **Favicon Location**: `assets/favicon.png`

### How to Replace the Logo:
1. Place your official PNG logo file inside the `/assets/` directory.
2. Name it exactly `logo.png`.
3. The platform automatically detects and renders `assets/logo.png` across all headers and footers without requiring any code modifications!

*Note: If `logo.png` is absent or loading, a visually attractive branded placeholder (`DECODE AI`) automatically renders as a fallback.*

---

## 📚 How to Add New Content (Continuous Content System)

Adding new study guides, book summaries, PDFs, or research paper explainers is simple:

### Step 1: Add your Content File
Place your file in the appropriate directory inside `/content/`:
- **HTML Notes**: `/content/html/your-note-name.html`
- **PDF Documents**: `/content/pdfs/your-cheatsheet.pdf`
- **Book Summaries**: `/content/books/book-title-summary.html`
- **Research Papers**: `/content/research/paper-title-explainer.html`
- **Notes**: `/content/notes/topic-guide.html`

### Step 2: Register in `data/resources.json`
Open `data/resources.json` and append a new JSON object:

```json
{
  "id": "res-013",
  "title": "Your New AI Guide Title",
  "slug": "your-new-ai-guide-slug",
  "description": "A brief 2-sentence summary of what learners will gain from this resource.",
  "category": "Deep Learning",
  "subcategory": "Neural Networks",
  "level": "Intermediate",
  "type": "NOTES",
  "author": "Your Name / Community",
  "contributor": "Your Name",
  "tags": ["PyTorch", "Deep Learning", "Tutorial"],
  "date": "2026-08-28",
  "featured": true,
  "file": "/content/html/your-note-name.html",
  "externalLink": null,
  "estimatedReadingTime": "12 min read"
}
```

That's it! The homepage, search modal (`Ctrl+K`), resource explorer, category pages, and dynamic reader will immediately render your new resource.

---

## ☁️ How to Deploy for FREE on Render

Decode AI is designed specifically for free deployment on **Render Static Sites**.

### Step-by-Step Render Deployment:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Decode AI platform"
   git remote add origin https://github.com/YOUR_USERNAME/decode-ai.git
   git push -u origin main
   ```

2. **Create a Static Site on Render**:
   - Log in to your [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** → **Static Site**.
   - Connect your GitHub repository `decode-ai`.

3. **Configure Build & Deploy Settings**:
   - **Name**: `decode-ai` (or your preferred site name)
   - **Branch**: `main`
   - **Build Command**: *(Leave completely blank or set to `echo "No build required"`)*
   - **Publish Directory**: `.` *(Root dot directory)*

4. **Click "Create Static Site"**:
   - Render will instantly deploy your site for FREE with an automatic SSL certificate (`https://your-site.onrender.com`).

---

## 🔮 Future Architecture & V2 Backend Roadmap

Although V1 operates cleanly as a static platform, the data access layer (`js/resources.js`) uses async abstraction methods (`ResourceService.getAll()`, `ResourceService.getBySlug()`). 

In V2, you can seamlessly connect a backend database:
- **Database**: Supabase / PostgreSQL
- **Authentication**: Supabase Auth / NextAuth
- **Admin Dashboard**: For approving community submissions, featuring resources, and tracking user reading progress.

---

## 📄 Content & Legal Standards
Decode AI focuses on original study notes, transformative educational summaries, open-source implementations, and proper citations to primary research papers and books.

*Built with passion by learners, for learners.*
