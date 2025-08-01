# 🚀 CoinLook

**CoinLook** is a sleek, responsive, and intuitive cryptocurrency tracking app built for modern finance enthusiasts. Stay on top of market trends, keep a personalized watchlist, and dive into detailed analytics—all with a clean, minimalist UI.

---

## 🔑 Core Features

- **📈 Market Listing**  
  View the top cryptocurrencies with key stats like:
  - Rank
  - Icon
  - Name & Symbol
  - Price (USD)
  - 24h Change %
  - Market Cap
  - 24h Volume  
  Paginated at 50 coins per page.

- **🔎 Search & Filter**  
  - Client-side, real-time search bar  
  - Debounced input to reduce load

- **📊 Coin Detail View**  
  Tap into a detailed view with:
  - Live price
  - Market Cap, Rank, Volume
  - Total & Circulating Supply
  - Dynamic Price Chart (select 24h / 7d / 30d / 90d)

- **⭐ Watchlist**  
  - Add or remove coins to a local watchlist  
  - Data is persisted using `localStorage` for session durability

- **⚙️ State Management**  
  - Clean handling for loading, empty, and error states  
  - Skeletons used for smoother experience during API fetches

---

## 🧑‍💻 Tech Stack

- **FrameWork:** Next.js with turbo pack
- **Frontend:** React + TypeScript 
- **State:** React Hooks + Context or Zustand (as needed)
- **API:** coingecko 
- **Styling:** TailwindCSS
- **Charting:** Recharts / Chart.js
- **Storage:** `localStorage` for watchlist persistence

---

## 📦 Installation

```bash
git clone https://github.com/prathamkchandra/Crypto-dashboard.git
cd Crypto-dashboard
npm install
npm run dev
