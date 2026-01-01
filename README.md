# 🌑 Memento Mori — Time Tracker

> *"It is not that we have a short space of time, but that we waste much of it."* — Seneca.

**[View Live Application](https://memento-mori-topaz.vercel.app/)**

This tool serves as a visual and minimalist reminder of human finitude. Designed to help prioritize what truly matters, it divides time into tangible blocks (days, weeks, years) and visualizes your life progress in real-time.

---

## ✨ Special Features

* **Cosmic View:** A 100-year map (5,200 weeks) to put your life scale into perspective.
* **10-Minute Grid:** Daily visualization divided into 144 blocks to help you focus on the "now."
* **Brutalist Aesthetic:** A high-contrast, monochromatic black-and-white interface to eliminate distractions.
* **Precision Countdown:** Real-time tracking of the current year's end down to the millisecond.

---

## 🛠️ Tech Stack

* **Frontend:** React 18 + TypeScript
* **Build Tool:** Vite
* **Deployment:** Vercel (Hosting & CI/CD)
* **Styling:** CSS-in-JS (Inline styles) for ultra-minimalist delivery.

---

## 🚀 Local Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/memento-mori.git](https://github.com/your-username/memento-mori.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd memento-mori
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

```text
├── public/              # Static assets (Favicons, etc.)
├── src/
│   ├── components/      # Main UI components
│   ├── App.tsx          # Main application entry point
│   └── main.tsx         # React DOM rendering
├── index.html           # Root HTML template
└── package.json         # Scripts and dependencies
