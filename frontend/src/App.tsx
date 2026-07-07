import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './pages/DashboardView';
import { StorageExplorerView } from './pages/StorageExplorerView';
import { SearchView } from './pages/SearchView';
import { CopilotView } from './pages/CopilotView';
import { 
  ShieldAlert, 
  BarChart3, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  Lock, 
  Server, 
  Database,
  RefreshCw
} from 'lucide-react';
import './index.css';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Top Navbar */}
        <Navbar onSearchClick={() => setActiveTab('search')} />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto relative z-0">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'explorer' && <StorageExplorerView />}
          {activeTab === 'search' && <SearchView />}
          {activeTab === 'copilot' && <CopilotView />}
          
          {/* Cost & Analytics Placeholder */}
          {activeTab === 'analytics' && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl glass-card border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    Enterprise Cost & Chargeback Reports
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Real-time MinIO usage billing, departmental chargebacks, and predictive ROI models</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                  Billing Sync Active
                </span>
              </div>
              <div className="p-12 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
                <BarChart3 className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-300">Detailed Analytics Engine</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Cost Optimization Agent is currently continuously forecasting Q4 storage needs across 14 enterprise departments.
                </p>
              </div>
            </div>
          )}

          {/* Security & Malware Placeholder */}
          {activeTab === 'security' && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl glass-card border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-rose-400" />
                    Security, RBAC & ClamAV Quarantine
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Zero-Trust AES-256-GCM encryption monitoring, audit logs, and malware isolation</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  No Active Breaches
                </span>
              </div>
              <div className="p-12 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
                <Lock className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-300">Security Agent Guard Active</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  All uploaded blobs undergo ClamAV heuristic scans and SHA-256 checksum verification before entering storage pools.
                </p>
              </div>
            </div>
          )}

          {/* Settings Placeholder */}
          {activeTab === 'settings' && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl glass-card border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-slate-400" />
                    Platform Infrastructure & AI Configuration
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Manage LangChain providers (Ollama / Gemini / OpenAI), Qdrant indexing, and MinIO endpoints</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync Providers
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Server className="w-4 h-4 text-blue-400" />
                    MinIO Object Store
                  </div>
                  <p className="text-xs text-slate-400">Endpoint: <code className="text-blue-300 bg-slate-900 px-1.5 py-0.5 rounded">localhost:9000</code></p>
                  <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">Connected</span>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Database className="w-4 h-4 text-purple-400" />
                    Qdrant Vector DB
                  </div>
                  <p className="text-xs text-slate-400">Index: <code className="text-purple-300 bg-slate-900 px-1.5 py-0.5 rounded">intellistore_embeddings</code></p>
                  <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">Connected</span>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Lock className="w-4 h-4 text-amber-400" />
                    Redis Cache & JWT
                  </div>
                  <p className="text-xs text-slate-400">Session TTL: <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">86400s</code></p>
                  <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">Connected</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
