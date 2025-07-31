# **App Name**: CoinLookout

## Core Features:

- Market Listing: Display a paginated list of top cryptocurrencies (50 per page) with rank, icon, name, symbol, price, 24h change %, market cap, and 24h volume. Only USD currency is enough.
- Search and Filter: Implement a client-side search input that filters the cryptocurrency list by name or symbol.
- State Management: Show loading, empty, and error states for API calls.
- Coin Details View: Create detailed view accessible from main coin list page, displaying detailed coin information like price, market cap, volume, rank, and supply.
- Price Chart: Display a chart of the price with selectable ranges (24h / 7d / 30d / 90d) for coin details view.
- Watchlist: Allow users to save/remove coins from a local watchlist using localStorage, which is persisted, so its state is maintained between sessions.
- Enhancements: Display loading skeletons and use debouncing on the search input to reduce API calls.

## Style Guidelines:

- Primary color: Vivid sky-blue (#7DD3FC), evoking a sense of clarity, forward motion, and modern finance.
- Background color: Very light sky-blue (#E0F7FA). The very light tint maintains harmony with the primary color but ensures comfortable readability.
- Accent color: Lilac (#A855F7), a vivid analogous color that suggests technological sophistication and a modern outlook, drawing attention to interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif, should be used throughout for its modern and neutral appearance, ensuring readability and a clean aesthetic.
- Use clean, minimalist icons to represent coin types and actions (e.g., watchlist). Ensure consistency in style and weight.
- Employ a clean and responsive layout with clear visual hierarchy. Prioritize key information and provide intuitive navigation.
- Incorporate subtle animations for loading states and transitions to enhance the user experience without being distracting.