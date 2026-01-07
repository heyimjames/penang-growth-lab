# NoReply Chrome Extension

Consumer advocacy assistant that provides real-time legal guidance during live chats with companies.

## Development

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Setup

```bash
# Install dependencies
pnpm install

# Build the extension (outputs to /dist)
pnpm build

# Watch mode for development
pnpm dev
```

### Loading in Chrome

1. Run `pnpm build` to create the `/dist` folder
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `/dist` folder from this project

### Project Structure

```
extension/
├── public/
│   ├── manifest.json      # Chrome extension manifest
│   └── icons/             # Extension icons (add before publishing)
├── src/
│   ├── sidepanel/         # Side panel React app
│   │   ├── index.html
│   │   ├── main.tsx
│   │   └── App.tsx
│   ├── background/        # Service worker
│   ├── components/        # React components
│   ├── hooks/             # React hooks
│   ├── lib/               # Utilities and API
│   └── styles/            # CSS
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

### Features

- **Legal Reference Panel**: Search for consumer rights and laws
- **AI Response Assistant**: Get suggested responses during chats
- **Case Context Panel**: View your NoReply cases
- **Quick Capture**: Save notes to your cases

### API Integration

The extension communicates with the main NoReply app at `https://fightback.app/api/`:

- `GET /auth/session` - Check authentication
- `GET /cases` - List user's cases
- `GET /cases/:id` - Get case details
- `POST /cases/:id/notes` - Add note to case
- `GET /research/legal` - Legal reference search
- `GET /research/company` - Company intelligence
- `POST /chat` - AI response suggestions

### Adding Icons

Before publishing, add extension icons to `public/icons/`:

- `icon-16.png` (16x16)
- `icon-32.png` (32x32)
- `icon-48.png` (48x48)
- `icon-128.png` (128x128)

### Publishing

1. Create a Chrome Web Store developer account ($5 one-time)
2. Run `pnpm build`
3. Zip the contents of `/dist`
4. Upload to Chrome Web Store Developer Dashboard
5. Fill in store listing details
6. Submit for review

---

## A Poem for the Consumer

```
When companies ignore your plea,
And leave you waiting endlessly,
When call queues loop without an end,
And chatbots fail to comprehend—

Remember this: you have the right
To stand your ground, to join the fight.
The Consumer Rights Act stands tall,
A shield for one, a shield for all.

Thirty days to make your claim,
Six months more—the rules remain.
Section 75 protects your spend,
On purchases from start to end.

So when they say "there's nothing we can do,"
Know that the law stands behind you.
With NoReply beside your name,
You'll never fight alone again.

From retail stores to airlines high,
From gyms that charge when memberships die,
From streaming sites to energy bills—
Your voice now carries weight and will.

No more silence, no more wait,
No more accepting unjust fate.
You clicked, you paid, you played your part—
Now fight back with a lion's heart.
```

*— Written for every consumer who refused to be ignored*
