# Consultant AI UI

A clean, modern chat interface built with TypeScript and Vite.

## Features

- 🎨 Minimalist white theme design
- 💬 ChatGPT-like interface
- ⚡ Real-time typing animation
- 🔄 Loading spinner with emoji
- 📱 Responsive design
- ⌨️ Auto-expanding textarea
- 🚀 Fast development with Vite

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Integration

The application uses two dummy endpoints:

- **POST** `/api/chat` - Send user messages
- **GET** `/api/response` - Fetch assistant responses

To connect to real APIs, update the endpoints in `src/main.ts`:

```typescript
const API_BASE_URL = 'http://your-api-url';
const POST_ENDPOINT = `${API_BASE_URL}/api/chat`;
const GET_ENDPOINT = `${API_BASE_URL}/api/response`;
```

Then uncomment the actual API call code in the `sendMessageToAPI` and `fetchResponseFromAPI` functions.

## Project Structure

```
consultant-ai-ui/
├── index.html          # Main HTML file
├── src/
│   ├── main.ts         # TypeScript application logic
│   └── style.css       # Styles
├── image.png           # Logo image
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

## Customization

### Typing Speed

Adjust the typing animation speed in `src/main.ts`:

```typescript
await sleep(20); // Change this value (milliseconds per character)
```

### Colors

Edit the colors in `src/style.css` to match your brand.

### API Delay Simulation

Modify the sleep durations in the dummy API functions to simulate different network conditions.

