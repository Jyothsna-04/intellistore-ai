import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Archive, 
  Tag, 
  User, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Database,
  Download,
  Eye,
  X
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'semantic' | 'filename' | 'natural'>('semantic');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const recentSearches = [
    'Q3 audit reports 2026',
    'CONFIDENTIAL employee tax filing',
    'CAD render duplicate files',
    'AES-256 encryption logs'
  ];

  const searchResults = [
    {
      id: 'res-1',
      name: 'Q3_Financial_Balance_Sheet_Final.xlsx',
      type: 'spreadsheet',
      size: '14.2 MB',
      tier: 'Hot NVMe',
      owner: 'Jyothis Admin',
      modified: '2 hours ago',
      similarity: '98.8% Match',
      snippet: '...audited fiscal balance sheet for Q3 2026 confirming $420/mo cloud storage cost reductions across Finance department pools...',
      tags: ['Confidential', 'Audit 2026', 'Finance']
    },
    {
      id: 'res-2',
      name: 'Executive_AI_Strategy_Presentation.pdf',
      type: 'document',
      size: '8.4 MB',
      tier: 'Cool Pool',
      owner: 'Sarah Jenkins (VP)',
      modified: 'Yesterday',
      similarity: '94.2% Match',
      snippet: '...strategic presentation outlining LangGraph multi-agent architecture and Qdrant vector embedding intelligence for enterprise adoption...',
      tags: ['Board Deck', 'AI Strategy']
    },
    {
      id: 'res-3',
      name: 'Employee_Payroll_Tax_Filing_Q2.docx',
      type: 'document',
      size: '2.8 MB',
      tier: 'Cool Pool',
      owner: 'HR Operations',
      modified: '2 weeks ago',
      similarity: '89.5% Match',
      snippet: '...employee tax records and payroll filings protected under 256-bit AES encryption with ClamAV malware screening...',
      tags: ['HR', 'Tax Records']
    },
    {
      id: 'res-4',
      name: 'Enterprise_Architecture_Topology_Diagram.png',
      type: 'image',
      size: '4.1 MB',
      tier: 'Hot NVMe',
      owner: 'DevOps Lead',
      modified: '3 days ago',
      similarity: '84.1% Match',
      snippet: '...system network diagram showing Railway Account 1 (Spring Boot), Account 2 (AI Service + PostgreSQL), and Account 3 (Redis)...',
      tags: ['Infrastructure', 'AWS Qdrant']
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'spreadsheet': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'document': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-purple-500" />;
      case 'archive': return <Archive className="w-5 h-5 text-amber-500" />;
      default: return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredResults = searchResults.filter(res => {
    if (selectedTag !== 'all' && !res.tags.includes(selectedTag)) return false;
    if (selectedOwner !== 'all' && res.owner !== selectedOwner) return false;
    if (searchQuery && !res.name.toLowerCase().includes(searchQuery.toLowerCase()) && !res.snippet.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Main Search Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Qdrant 384-Dimensional Vector Intelligence</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Enterprise Semantic Search Portal
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Search across millions of files by exact filename, conceptual meaning, or natural language prompts.
        </p>

        {/* Central Search Input Box */}
        <div className="relative mt-4">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-blue-500" />
          <input 
            type="text" 
            autoFocus
            placeholder="Ask AI or search: e.g., 'Find all confidential Q3 financial balance sheets...'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white shadow-xl focus:outline-hidden focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-14 top-3.5 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="absolute right-4 top-3.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Search Mode Toggle Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
          {[
            { id: 'semantic', label: 'Semantic Vector Search', icon: Sparkles },
            { id: 'filename', label: 'Exact Filename', icon: Search },
            { id: 'natural', label: 'Natural Language AI', icon: Database },
          ].map(mode => {
            const Icon = mode.icon;
            const isActive = searchMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSearchMode(mode.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-slate-400 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Tag Filter:</span>
          {['all', 'Confidential', 'Audit 2026', 'Finance', 'AI Strategy'].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${selectedTag === tag ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-400 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Owner:</span>
          <select 
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Owners</option>
            <option value="Jyothis Admin">Jyothis Admin</option>
            <option value="Sarah Jenkins (VP)">Sarah Jenkins (VP)</option>
            <option value="HR Operations">HR Operations</option>
          </select>
        </div>
      </div>

      {/* Recent Searches / Suggestions when box is empty */}
      {!searchQuery && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111827]/50 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Recent Enterprise Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-slate-700 hover:border-blue-500/40 transition-all flex items-center gap-2 shadow-2xs"
              >
                <Search className="w-3 h-3 text-slate-400" />
                <span>{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>{filteredResults.length} Vector Results Found in Qdrant Cluster</span>
          <span>Response Time: 4.2ms</span>
        </div>

        {filteredResults.map((res) => (
          <div 
            key={res.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all space-y-3 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  {getIcon(res.type)}
                </div>
                <div>
                  <h3 
                    onClick={() => setPreviewItem(res)}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {res.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {res.size} • {res.tier} • Uploaded by {res.owner} • {res.modified}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {res.similarity}
                </span>
                <button 
                  onClick={() => setPreviewItem(res)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Snippet highlighted by vector matcher */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
              {res.snippet}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {res.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5 text-slate-400" /> {tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Indexed in Qdrant Vector Cluster
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{previewItem.name}</h3>
              <button onClick={() => setPreviewItem(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-500 font-mono">{previewItem.snippet}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setPreviewItem(null)} className="btn-secondary text-xs">Close</button>
              <button className="btn-primary text-xs flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
