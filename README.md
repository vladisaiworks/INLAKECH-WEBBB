# In Lak’ech - Digital Sanctuary Landing Page

> **A regenerative ecosystem in the heart of the Yucatán jungle.**

This repository contains the production-ready landing page for the **In Lak’ech** project. It is built as a highly responsive, cinematic web experience designed to connect with high-net-worth investors through an organic, "Maya Contemporary" aesthetic.

## 🌟 Project Overview

- **Concept**: "Digital Sanctuary" – A space that feels alive, breathing, and deeply connected to nature without sacrificing Swiss-level precision.
- **Tech Stack**: 
  - HTML5 (Semantic)
  - CSS3 (Vanilla + Fluid Tokens + Responsive System)
  - JavaScript (Vanilla)
  - **GSAP** (ScrollTrigger, Animations)
  - **Lenis** (Smooth Scrolling)
- **State**: Production Candidate (v5.0)

## 🛠 Prerequisites

To run and edit this project as intended, you need:

1.  **Antigravity** (AI Agent Environment) installed on your machine.
    *   *Note: This project can be run in any standard web server, but it is optimized for the Antigravity workflow.*
2.  **Git** (to clone the repository).
3.  **A modern browser** (Chrome, Edge, Safari, Firefox).

## 🚀 Installation & Setup

Follow these steps to get the project running locally in your Antigravity workspaces.

### 1. Clone the Repository

Open your terminal (PowerShell, Bash, or Command Prompt) and run:

```bash
git clone https://github.com/YOUR_USERNAME/inlakech-landing.git
cd inlakech-landing
```

*(Replace `YOUR_USERNAME` with your actual GitHub username)*

### 2. Open in Antigravity

- Launch **Antigravity**.
- Point the agent to the specific folder where you cloned the repo (`inlakech-landing`).
- The agent will automatically detect the configuration in `.agent/` (if included) and the project structure.

## 🏃‍♂️ How to Run

Since this is a static site (HTML/CSS/JS), you do not strictly need a build step (like `npm run build`), but for the best development experience regarding assets and CORS policies:

### Option A: Simple Local Server (Recommended)
If you have Python installed (standard in many environments):

```bash
# Run inside the project folder
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option B: VS Code "Live Server"
If you use VS Code:
1.  Install the **Live Server** extension.
2.  Right-click `index.html`.
3.  Select **"Open with Live Server"**.

### Option C: Direct File Open
You can simply double-click `index.html`, but some advanced scroll animations (GSAP) might behave strictly depending on browser security policies regarding local file access.

## 📂 Project Structure

```
inlakech-landing/
├── index.html            # Main entry point
├── README.md             # This documentation
├── .gitignore            # Git exclusion rules
│
├── assets/               # Static Assets
│   ├── css/              # Stylesheets
│   │   ├── main.css      # Core styles
│   │   ├── tokens.css    # Design tokens (colors, fonts, sizes)
│   │   ├── responsive.css# Media queries & fluid layout rules
│   │   └── ambient.css   # Special lighting effects
│   │
│   ├── js/               # Logic
│   │   ├── animations.js # GSAP sequences & interactions
│   │   └── main.js       # Core functionality
│   │
│   └── images/           # Optimized images (WebP/PNG/JPG)
│
└── .agent/               # Antigravity Configuration (Context & Memory)
```

## ✨ Key Features
- **Fluid Typography**: Uses `clamp()` for perfect scaling from mobile to large screens.
- **Global Light Wave**: A continuous, organic ambient light that follows the user through specific sections.
- **Cinematic Scroll**: Powered by Lenis + GSAP ScrollTrigger.
- **Laptop Optimized**: Specifically tuned for 13-15" viewports.

---

**© 2026 In Lak’ech Project.** All rights reserved.
