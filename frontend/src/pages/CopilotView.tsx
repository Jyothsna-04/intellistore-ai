import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Terminal, 
  RefreshCw,
  Cpu
} from 'lucide-react';

export const CopilotView: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Jyothis! I am your IntelliStore AI Storage Copilot, orchestrated by the LangGraph Supervisor. How can I assist you with enterprise storage optimization, cost forecasting, or security quarantine today?",
      trace: [
        { agent: 'Supervisor', action: 'Initialized conversation session with RBAC org scope: Admin', status: 'done' }
      ]
    },
    {
      id: 2,
      sender: 'user',
      text: "Can you analyze our storage costs and recommend the fastest way to save $400/month?"
    },
    {
      id: 3,
      sender: 'ai',
      text: "I have completed a multi-agent scan across your 48.5 TB storage footprint. Here is the recommended execution plan to save **$420.00 / month** immediately:\n\n1. **Archive Cold Project Files**: Move 3,800 inactive files (>180 days old) from HOT NVMe storage to MinIO Glacier ARCHIVE tier. *(Est. Savings: $180.50/mo)*\n2. **Deduplicate Shared Folders**: Eliminate 1,420 exact and semantic duplicates between Engineering and QA shares. *(Est. Savings: $145.00/mo)*\n3. **Compress Log Archives**: Apply zstd compression to 840 raw application server logs. *(Est. Savings: $94.50/mo)*\n\nWould you like me to trigger the automated workflow to execute these 3 actions?",
      trace: [
        { agent: 'Supervisor', action: 'Routed query to Cost Optimization Agent & Lifecycle Agent', status: 'done' },
        { agent: 'Cost Agent', action: 'Queried PostgreSQL storage metrics & MinIO tier billing rates', status: 'done' },
        { agent: 'Lifecycle Agent', action: 'Identified 3,800 cold files (>180d inactive) & 1,420 duplicate hashes', status: 'done' },
        { agent: 'Supervisor', action: 'Synthesized savings report: Total $420.00/mo opportunity', status: 'done' }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const samplePrompts = [
    "What is our predicted storage growth for Q4?",
    "Show me all files quarantined by ClamAV heuristic scan",
    "Find semantic duplicates in Engineering architecture folder",
    "Explain our current HOT vs ARCHIVE tier distribution cost"
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I am evaluating that request using the **Storage Optimization Agent** and querying real-time telemetry from PostgreSQL and Qdrant vector embeddings. All systems report nominal zero-trust compliance.",
          trace: [
            { agent: 'Supervisor', action: `Analyzing intent: '${input.slice(0, 30)}...'`, status: 'done' },
            { agent: 'Security Agent', action: 'Verifying user RBAC authorization for requested scope', status: 'done' },
            { agent: 'Knowledge Agent', action: 'Retrieved 4 relevant vector embeddings from Qdrant index', status: 'done' }
          ]
        }
      ]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            AI Storage Copilot <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">LangGraph Supervisor</span>
          </h2>
          <p className="text-xs text-slate-400">Conversational enterprise intelligence powered by specialized LangChain agents</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            LLM: Gemini 1.5 Pro
          </span>
          <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700" title="Reset Session">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split UI: Chat Box (Left 2 cols) & Explainability Trace Panel (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left: Chat Window */}
        <div className="lg:col-span-2 rounded-2xl glass-panel border border-slate-700/60 flex flex-col h-full overflow-hidden shadow-2xl">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3 items-center text-xs text-purple-400 pl-2">
                <Sparkles className="w-4 h-4 animate-bounce" />
                <span>LangGraph Supervisor is delegating tasks to specialist agents...</span>
              </div>
            )}
          </div>

          {/* Sample Prompts Pills */}
          <div className="px-5 py-2 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto shrink-0 bg-slate-900/40">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">Try asking:</span>
            {samplePrompts.map((p, idx) => (
              <button 
                key={idx}
                onClick={() => setInput(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 shrink-0 transition-colors truncate max-w-[200px]"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-800/80 flex items-center gap-3 shrink-0 bg-slate-900/80">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about files, cost savings, duplicates, or security threats..."
              className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Explainability Trace Panel */}
        <div className="rounded-2xl glass-card border border-slate-700/50 p-5 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Agent Execution Trace
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Explainable AI
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <p className="text-xs text-slate-400 leading-relaxed">
              Every response generated by IntelliStore AI is fully explainable. Below is the live execution trace from the LangGraph supervisor for your recent interactions:
            </p>

            {/* Trace Step timeline */}
            <div className="relative pl-5 border-l-2 border-slate-800 space-y-5 my-3">
              <div className="relative">
                <span className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-slate-900"></span>
                <div className="text-xs font-semibold text-purple-300 flex items-center justify-between">
                  <span>Supervisor Agent</span>
                  <span className="text-[10px] text-slate-500">2s ago</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 font-mono">
                  Synthesized multi-agent reports into unified cost saving proposal ($420/mo opportunity).
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900"></span>
                <div className="text-xs font-semibold text-blue-400 flex items-center justify-between">
                  <span>Lifecycle Management Agent</span>
                  <span className="text-[10px] text-slate-500">2s ago</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 font-mono">
                  Executed threshold scan: 3,800 files &gt; 180 days inactive marked for Glacier archive.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900"></span>
                <div className="text-xs font-semibold text-amber-400 flex items-center justify-between">
                  <span>Cost Optimization Agent</span>
                  <span className="text-[10px] text-slate-500">3s ago</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 font-mono">
                  Retrieved billing rates from MinIO & PostgreSQL. Computed $0.023/GB HOT vs $0.004/GB ARCHIVE delta.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-900"></span>
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                  <span>Security & Zero Trust Agent</span>
                  <span className="text-[10px] text-slate-500">4s ago</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 font-mono">
                  Verified JWT session RBAC claims. ClamAV daemon scan status: nominal.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-center shrink-0">
            <span className="text-[11px] text-slate-500">All agent actions audited to PostgreSQL security logs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
