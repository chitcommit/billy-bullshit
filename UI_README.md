# Billy Bullshit Web UI

A modern, responsive web interface for interacting with Billy's brutally honest code reviews.

## Overview

The Billy web UI is a single-page React application that provides an intuitive interface for:
- 🔍 Code reviews with BS score visualization
- 💬 Conversational chat with Billy
- 🏆 Gallery of code examples (Hall of Shame & Hall of Fame)

## Features

### 1. Code Review Interface
The primary function of Billy - submit your code for a brutal but honest review.

**Features:**
- Multi-line code input textarea
- Language selector (18+ languages supported)
- Optional context field
- Real-time BS Score meter (1-10 scale)
- Color-coded issue categories:
  - 🚩 **CRITICAL** - Security issues, crashes
  - ⚠️ **MAJOR** - Performance, maintainability
  - 💩 **BS** - Over-engineering, unnecessary complexity
  - 🤦 **WTAF** - Code that makes you question humanity
  - ✅ **THE FIX** - How to fix it properly
- "Load Example" button for quick testing
- Syntax highlighting for code blocks

### 2. Chat Interface
Have a conversation with Billy about anything code-related.

**Features:**
- Persistent message history
- Session management
- Typing indicator
- User and Billy message bubbles
- Error handling

### 3. Gallery
Browse examples of terrible and excellent code.

**Features:**
- **Hall of Shame** - Learn from the worst offenders
- **Hall of Fame** - See what good code looks like
- BS Score badges on each example
- Syntax-highlighted code snippets

## Tech Stack

- **React 18** - UI framework (loaded via CDN)
- **Tailwind CSS** - Styling (loaded via CDN)
- **Highlight.js** - Syntax highlighting (loaded via CDN)
- **Hono** - Server framework (Cloudflare Workers)

## Architecture

The UI is served directly from the Cloudflare Worker:
```
GET / → Serves the web UI (HTML)
GET /api → API information (JSON)
POST /review → Code review endpoint
POST /chat → Chat endpoint
POST /roast → Roast endpoint
POST /analyze → Analysis endpoint
POST /debate → Debate endpoint
GET /health → Health check
```

## Development

### Local Development
```bash
npm run dev
```
Visit http://localhost:8787 to see the UI.

### Building
The UI HTML is embedded in the Worker at build time via `src/ui-html.ts`.

To regenerate the UI HTML file after changes:
```bash
node << 'EOF'
const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const escaped = html.replace(/`/g, '\\`').replace(/\$/g, '\\$');
const content = `// This file contains the web UI HTML
export const uiHtml = \`${escaped}\`;
`;
fs.writeFileSync('src/ui-html.ts', content);
console.log('HTML file converted successfully');
EOF
```

### Deployment
```bash
npm run deploy
# or for production
npm run deploy:production
```

## Design

The UI uses a **glass morphism** design with:
- Purple gradient background (#667eea → #764ba2)
- Frosted glass panels with backdrop blur
- Smooth animations and transitions
- Mobile-responsive grid layouts
- Inter font for UI text
- Fira Code font for code blocks

## API Integration

The UI communicates with Billy's API using fetch:

```javascript
// Code Review
const response = await fetch('/review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code, language, context })
});

// Chat
const response = await fetch('/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, sessionId })
});
```

## Mobile Responsive

The UI is fully responsive with breakpoints:
- Mobile: Single column layout
- Tablet: 768px+ (md:) - 2 column grid where appropriate
- Desktop: 1024px+ (lg:) - Full 2 column layout

## Browser Support

Works on all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- Fetch API
- React 18

## Future Enhancements

- [ ] Server-Sent Events (SSE) streaming support
- [ ] Code editor with line numbers (Monaco/CodeMirror)
- [ ] Dark/light theme toggle
- [ ] Shareable review links
- [ ] Review history persistence
- [ ] Copy code to clipboard
- [ ] Download review as markdown
- [ ] Keyboard shortcuts
- [ ] More gallery examples

## Troubleshooting

### UI not loading
- Check that the Worker is running: `npm run dev`
- Verify http://localhost:8787 is accessible
- Check browser console for errors

### API errors
- Ensure KV namespace is configured in `wrangler.toml`
- Check that AI binding is available
- Verify API keys are set (for Anthropic/OpenAI fallback)

### Styling issues
- Ensure Tailwind CSS CDN is loading
- Check for CSP (Content Security Policy) restrictions

## Contributing

To modify the UI:
1. Edit `public/index.html`
2. Regenerate `src/ui-html.ts` (see Building section)
3. Test locally with `npm run dev`
4. Deploy with `npm run deploy`

## License

MIT
