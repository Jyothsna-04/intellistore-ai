import React, { useState } from 'react';
import { 
  Search as SearchIcon, 
  Sparkles, 
  Filter, 
  FileText, 
  Download, 
  Share2, 
  Database,
  ArrowRight
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const [query, setQuery] = useState('how to optimize cold storage tiers and reduce monthly cloud costs');
  const [searchMode, setSearchMode] = useState<'semantic' | 'keyword'>('semantic');

  const results = [
    {
      id: 1,
      title: 'Q3_Enterprise_Storage_Cost_Models.xlsx',
      path: '/Enterprise Share / Finance / 2025',
      similarity: '98.4%',
      tier: 'HOT',
      snippet: '...analysis of data lifecycle policies shows transitioning inactive files (>180 days) from standard SSDs to HDD cold tiers yields an estimated 65% cost reduction over 12 months...',
      matchedBy: 'Vector Embedding (Qdrant Cosine Similarity)',
      date: '2 hours ago'
    },
    {
      id: 2,
      title: 'IntelliStore_System_Architecture_v3.pdf',
      path: '/Enterprise Share / Engineering / Architecture',
      similarity: '94.1%',
      tier: 'HOT',
      snippet: '...the Storage Optimization Agent periodically evaluates file access frequencies. If access count drops below threshold, automated archival workflows trigger compression and transfer to MinIO Glacier...',
      matchedBy: 'Vector Embedding (Qdrant Cosine Similarity)',
      date: '10 mins ago'
    },
    {
      id: 3,
      title: 'Cost_Reduction_Proposal_DevOps_2024.docx',
      path: '/Enterprise Share / DevOps / Reports',
      similarity: '89.7%',
      tier: 'COLD',
      snippet: '...recommend implementing automated duplicate file cleanup across all Kubernetes build artifact folders. Eliminating redundant container image tars saved 12.4 TB in Q2...',
      matchedBy: 'Vector Embedding (Qdrant Cosine Similarity)',
      date: '3 weeks ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Powered by Qdrant Vector Database & Sentence Transformers
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          AI Semantic Knowledge Search
        </h2>
        <p className="text-sm text-slate-400">
          Search enterprise documents using natural language concepts, intent, and semantic meaning rather than just exact file names.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-3 rounded-2xl glass-card border border-slate-700/60 shadow-2xl max-w-3xl mx-auto space-y-3">
        <div className="flex items-center gap-3 px-3 py-1 bg-slate-900/60 rounded-xl border border-slate-800">
          <SearchIcon className="w-5 h-5 text-purple-400 shrink-0" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question or describe the document you're looking for..."
            className="w-full bg-transparent py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shrink-0 flex items-center gap-1.5 transition-all">
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setSearchMode('semantic')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                searchMode === 'semantic' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Semantic AI
            </button>
            <button 
              onClick={() => setSearchMode('keyword')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                searchMode === 'keyword' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exact Keyword
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter by:</span>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none">
              <option>All Storage Tiers</option>
              <option>HOT Only</option>
              <option>COLD Only</option>
            </select>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none">
              <option>All Document Types</option>
              <option>PDF & Docs</option>
              <option>Spreadsheets</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4 max-w-4xl mx-auto pt-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Found <strong className="text-white">3 semantic matches</strong> in 140ms</span>
          <span>Vector embedding dimension: <strong className="text-slate-300">384 (all-MiniLM-L6-v2)</strong></span>
        </div>

        <div className="space-y-3">
          {results.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl glass-panel border border-slate-700/60 hover:border-purple-500/40 transition-all space-y-3 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                      {item.title}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.similarity} Match
                      </span>
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Database className="w-3 h-3 text-slate-500" />
                      {item.path} • {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Highlighted Snippet */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-mono">
                {item.snippet}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Matched via: <strong className="text-slate-400">{item.matchedBy}</strong></span>
                <span className="text-purple-400 font-medium">View full document embeddings →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
