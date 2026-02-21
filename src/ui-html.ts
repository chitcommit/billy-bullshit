// This file contains the web UI HTML
export const uiHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Billy Bullshit - Brutally Honest Code Reviews</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .code-font {
      font-family: 'Fira Code', monospace;
    }
    
    .bs-meter {
      background: linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%);
    }
    
    .fade-in {
      animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .typing-indicator::after {
      content: '...';
      animation: typing 1.5s infinite;
    }
    
    @keyframes typing {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
    
    pre code.hljs {
      border-radius: 0.5rem;
      padding: 1rem;
    }
    
    .glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    // API Configuration
    const API_BASE = window.location.origin;
    
    // Main App Component
    function App() {
      const [activeTab, setActiveTab] = useState('review');
      
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="text-center mb-8 fade-in">
              <h1 className="text-5xl font-bold text-white mb-2">
                💩 Billy Bullshit
              </h1>
              <p className="text-xl text-white/90">
                Brutally Honest AI Code Reviews
              </p>
              <p className="text-sm text-white/70 mt-2">
                No sugarcoating. No BS. Just the truth you need to hear.
              </p>
            </header>
            
            {/* Navigation Tabs */}
            <nav className="flex justify-center mb-8 gap-2">
              <TabButton 
                active={activeTab === 'review'} 
                onClick={() => setActiveTab('review')}
              >
                🔍 Code Review
              </TabButton>
              <TabButton 
                active={activeTab === 'chat'} 
                onClick={() => setActiveTab('chat')}
              >
                💬 Chat
              </TabButton>
              <TabButton 
                active={activeTab === 'gallery'} 
                onClick={() => setActiveTab('gallery')}
              >
                🏆 Gallery
              </TabButton>
            </nav>
            
            {/* Content Area */}
            <div className="fade-in">
              {activeTab === 'review' && <CodeReviewInterface />}
              {activeTab === 'chat' && <ChatInterface />}
              {activeTab === 'gallery' && <GalleryInterface />}
            </div>
            
            {/* Footer */}
            <footer className="text-center mt-12 text-white/70 text-sm">
              <p>Powered by Cloudflare Workers AI • API available at /review, /chat, /roast, /analyze</p>
            </footer>
          </div>
        </div>
      );
    }
    
    // Tab Button Component
    function TabButton({ active, onClick, children }) {
      return (
        <button
          onClick={onClick}
          className={\`px-6 py-3 rounded-lg font-semibold transition-all \${
            active 
              ? 'bg-white text-purple-600 shadow-lg' 
              : 'glass text-white hover:bg-white/20'
          }\`}
        >
          {children}
        </button>
      );
    }
    
    // Code Review Interface
    function CodeReviewInterface() {
      const [code, setCode] = useState('');
      const [language, setLanguage] = useState('javascript');
      const [context, setContext] = useState('');
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      
      const languages = [
        'javascript', 'typescript', 'python', 'java', 'go', 'rust',
        'c', 'cpp', 'csharp', 'php', 'ruby', 'swift', 'kotlin',
        'html', 'css', 'sql', 'shell', 'other'
      ];
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code.trim()) {
          setError('Please enter some code to review');
          return;
        }
        
        setLoading(true);
        setError(null);
        setResult(null);
        
        try {
          const response = await fetch(\`\${API_BASE}/review\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language, context })
          });
          
          if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          setResult(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      const loadExample = () => {
        setCode(\`function validateUser(user) {
  if (user.password == user.confirmPassword) {
    if (user.email.indexOf('@') > -1) {
      if (user.age > 18) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}\`);
        setLanguage('javascript');
        setContext('User registration validation');
      };
      
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="glass rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Submit Your Code
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang} className="text-gray-900">
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">
                  Context (Optional)
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., Authentication logic, API endpoint"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">
                  Your Code
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  rows="12"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 code-font text-sm resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-purple-600 font-bold py-3 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="typing-indicator">Reviewing</span>
                  ) : (
                    '🔍 Get Roasted'
                  )}
                </button>
                <button
                  type="button"
                  onClick={loadExample}
                  className="px-6 bg-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/30 transition-all border border-white/30"
                >
                  📝 Load Example
                </button>
              </div>
            </form>
          </div>
          
          {/* Results Panel */}
          <div className="glass rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Billy's Verdict
            </h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-white font-semibold">❌ Error</p>
                <p className="text-white/80 text-sm mt-1">{error}</p>
              </div>
            )}
            
            {result && <ReviewResult result={result} />}
            
            {!loading && !result && !error && (
              <div className="text-center py-12 text-white/60">
                <p className="text-4xl mb-3">💩</p>
                <p className="text-lg">Submit your code to receive Billy's brutally honest review</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Review Result Component
    function ReviewResult({ result }) {
      const reviewRef = useRef(null);
      
      useEffect(() => {
        if (reviewRef.current) {
          reviewRef.current.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
          });
        }
      }, [result]);
      
      const review = result.review || '';
      const bsScore = extractBSScore(review);
      const sections = parseReview(review);
      
      return (
        <div ref={reviewRef} className="space-y-4">
          {bsScore !== null && <BSScoreMeter score={bsScore} />}
          
          <div className="bg-white/10 rounded-lg p-4 max-h-96 overflow-y-auto">
            {sections.map((section, idx) => (
              <ReviewSection key={idx} section={section} />
            ))}
          </div>
          
          {result.billy_says && (
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
              <p className="text-white font-semibold text-sm">
                {result.billy_says}
              </p>
            </div>
          )}
        </div>
      );
    }
    
    // BS Score Meter
    function BSScoreMeter({ score }) {
      const percentage = (score / 10) * 100;
      const color = score <= 3 ? 'text-green-400' : score <= 6 ? 'text-yellow-400' : 'text-red-400';
      
      return (
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">BS Score</span>
            <span className={\`text-3xl font-bold \${color}\`}>{score}/10</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="bs-meter h-full transition-all duration-500"
              style={{ width: \`\${percentage}%\` }}
            />
          </div>
          <p className="text-white/70 text-xs mt-2">
            {score <= 3 && '✅ Clean code! Billy approves.'}
            {score > 3 && score <= 6 && '⚠️ Room for improvement'}
            {score > 6 && score <= 8 && '🚩 Major issues detected'}
            {score > 8 && '💩 This is a disaster'}
          </p>
        </div>
      );
    }
    
    // Review Section Component
    function ReviewSection({ section }) {
      const getIcon = (type) => {
        if (type.includes('CRITICAL')) return '🚩';
        if (type.includes('MAJOR')) return '⚠️';
        if (type.includes('BS')) return '💩';
        if (type.includes('WTAF')) return '🤦';
        if (type.includes('FIX')) return '✅';
        return '📝';
      };
      
      const getBgColor = (type) => {
        if (type.includes('CRITICAL')) return 'bg-red-500/20 border-red-500/50';
        if (type.includes('MAJOR')) return 'bg-orange-500/20 border-orange-500/50';
        if (type.includes('BS')) return 'bg-yellow-500/20 border-yellow-500/50';
        if (type.includes('FIX')) return 'bg-green-500/20 border-green-500/50';
        return 'bg-white/10 border-white/20';
      };
      
      return (
        <div className={\`rounded-lg p-4 mb-3 border \${getBgColor(section.type)}\`}>
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>{getIcon(section.type)}</span>
            <span>{section.type}</span>
          </h3>
          <div className="text-white/90 text-sm whitespace-pre-wrap code-font">
            {section.content}
          </div>
        </div>
      );
    }
    
    // Chat Interface
    function ChatInterface() {
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const [loading, setLoading] = useState(false);
      const [sessionId] = useState(() => \`session_\${Date.now()}\`);
      const messagesEndRef = useRef(null);
      
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };
      
      useEffect(() => {
        scrollToBottom();
      }, [messages]);
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        
        try {
          const response = await fetch(\`\${API_BASE}/chat\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input, sessionId })
          });
          
          if (!response.ok) {
            throw new Error(\`HTTP \${response.status}\`);
          }
          
          const data = await response.json();
          const billyMessage = { role: 'assistant', content: data.response };
          setMessages(prev => [...prev, billyMessage]);
        } catch (err) {
          const errorMessage = { role: 'error', content: \`Error: \${err.message}\` };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setLoading(false);
        }
      };
      
      return (
        <div className="glass rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="bg-white/10 p-4 border-b border-white/20">
            <h2 className="text-xl font-bold text-white">
              💬 Chat with Billy
            </h2>
            <p className="text-white/70 text-sm">Ask anything. Get brutal honesty.</p>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-white/5">
            {messages.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <p className="text-4xl mb-3">💬</p>
                <p>Start a conversation with Billy</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-white typing-indicator">Thinking</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 bg-white/10 border-t border-white/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Billy anything..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 bg-white text-purple-600 font-bold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      );
    }
    
    // Chat Message Component
    function ChatMessage({ message }) {
      const isUser = message.role === 'user';
      const isError = message.role === 'error';
      
      return (
        <div className={\`flex items-start gap-3 \${isUser ? 'flex-row-reverse' : ''}\`}>
          <div className={\`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold \${
            isUser ? 'bg-blue-500' : isError ? 'bg-red-500' : 'bg-purple-500'
          }\`}>
            {isUser ? 'U' : isError ? '!' : 'B'}
          </div>
          <div className={\`max-w-md rounded-lg px-4 py-2 \${
            isUser ? 'bg-blue-500/20' : isError ? 'bg-red-500/20' : 'bg-white/10'
          }\`}>
            <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      );
    }
    
    // Gallery Interface
    function GalleryInterface() {
      const examples = [
        {
          title: 'The Boolean Disaster',
          code: 'if (x == true) { return true; } else { return false; }',
          language: 'javascript',
          bsScore: 9,
          category: 'shame'
        },
        {
          title: 'Callback Hell',
          code: 'getData(function(a) {\n  getMoreData(a, function(b) {\n    getMoreData(b, function(c) {\n      getMoreData(c, function(d) {\n        console.log(d);\n      });\n    });\n  });\n});',
          language: 'javascript',
          bsScore: 8,
          category: 'shame'
        },
        {
          title: 'Clean Validation',
          code: 'const isValidEmail = (email) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$/.test(email);',
          language: 'javascript',
          bsScore: 2,
          category: 'fame'
        },
        {
          title: 'God Class Syndrome',
          code: 'class UserManagerServiceFactoryImpl {\n  // 2000 lines of code\n}',
          language: 'java',
          bsScore: 10,
          category: 'shame'
        }
      ];
      
      const hallOfShame = examples.filter(e => e.category === 'shame');
      const hallOfFame = examples.filter(e => e.category === 'fame');
      
      return (
        <div className="space-y-8">
          {/* Hall of Shame */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💩</span>
              <span>Hall of Shame</span>
            </h2>
            <p className="text-white/70 mb-6">
              The worst offenders. Learn from these mistakes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hallOfShame.map((example, idx) => (
                <ExampleCard key={idx} example={example} />
              ))}
            </div>
          </section>
          
          {/* Hall of Fame */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🏆</span>
              <span>Hall of Fame</span>
            </h2>
            <p className="text-white/70 mb-6">
              Clean, maintainable code. This is what you should aim for.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hallOfFame.map((example, idx) => (
                <ExampleCard key={idx} example={example} />
              ))}
            </div>
          </section>
        </div>
      );
    }
    
    // Example Card Component
    function ExampleCard({ example }) {
      const isShame = example.category === 'shame';
      
      return (
        <div className={\`glass rounded-lg p-4 border \${
          isShame ? 'border-red-500/50' : 'border-green-500/50'
        }\`}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white font-bold">{example.title}</h3>
            <div className={\`px-3 py-1 rounded-full text-sm font-bold \${
              isShame ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
            }\`}>
              {example.bsScore}/10
            </div>
          </div>
          <pre className="bg-gray-900 rounded p-3 overflow-x-auto">
            <code className={\`text-xs text-gray-100 code-font language-\${example.language}\`}>
              {example.code}
            </code>
          </pre>
        </div>
      );
    }
    
    // Helper Functions
    function extractBSScore(review) {
      const match = review.match(/BS\s+(?:SCORE|Level):\s*(\d+)(?:\/10)?/i);
      return match ? parseInt(match[1]) : null;
    }
    
    function parseReview(review) {
      const sections = [];
      const lines = review.split('\n');
      let currentSection = null;
      
      for (const line of lines) {
        const headerMatch = line.match(/^(🚩|⚠️|💩|🤦|✅)?\s*([A-Z\s]+):/);
        if (headerMatch) {
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = {
            type: headerMatch[2].trim(),
            content: ''
          };
        } else if (currentSection) {
          currentSection.content += line + '\n';
        }
      }
      
      if (currentSection) {
        sections.push(currentSection);
      }
      
      return sections;
    }
    
    // Render App
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
`;
