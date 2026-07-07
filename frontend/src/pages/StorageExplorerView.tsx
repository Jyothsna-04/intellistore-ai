import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  FileCode, 
  FileArchive, 
  Upload, 
  FolderPlus, 
  ShieldCheck, 
  Lock, 
  MoreVertical, 
  Download, 
  Share2, 
  Trash2, 
  ChevronRight, 
  Home, 
  Search, 
  Filter,
  Database
} from 'lucide-react';

export const StorageExplorerView: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState('Engineering / Architecture');
  
  const files = [
    {
      id: 1,
      name: 'IntelliStore_System_Architecture_v3.pdf',
      type: 'pdf',
      size: '14.8 MB',
      tier: 'HOT',
      security: 'Clean',
      encrypted: true,
      modified: '10 mins ago',
      owner: 'Jyothis Admin'
    },
    {
      id: 2,
      name: 'Q3_Enterprise_Storage_Cost_Models.xlsx',
      type: 'excel',
      size: '4.2 MB',
      tier: 'HOT',
      security: 'Clean',
      encrypted: true,
      modified: '2 hours ago',
      owner: 'Finance Team'
    },
    {
      id: 3,
      name: 'Production_Database_Dump_20251120.sql.gz',
      type: 'archive',
      size: '2.4 GB',
      tier: 'COLD',
      security: 'Clean',
      encrypted: true,
      modified: '3 days ago',
      owner: 'DevOps Automated'
    },
    {
      id: 4,
      name: 'ClamAV_Heuristics_Test_Binary_Suspicious.bin',
      type: 'binary',
      size: '412 KB',
      tier: 'QUARANTINE',
      security: 'Threat Detected',
      encrypted: false,
      modified: 'Yesterday',
      owner: 'Security Agent'
    },
    {
      id: 5,
      name: 'Agentic_AI_Workflow_Supervisor_LangGraph.py',
      type: 'code',
      size: '34 KB',
      tier: 'WARM',
      security: 'Clean',
      encrypted: true,
      modified: '5 days ago',
      owner: 'AI Engineering'
    }
  ];

  const folders = [
    { name: '01_Cloud_Infrastructure_Terraform', items: '42 files', size: '1.2 GB' },
    { name: '02_AI_Agent_Training_Datasets', items: '18,400 files', size: '24.8 TB' },
    { name: '03_Security_Audit_Logs_2025', items: '3,120 files', size: '840 MB' },
    { name: '04_Archived_Customer_Contracts', items: '512 files', size: '4.5 GB' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Enterprise Storage Explorer
          </h2>
          <p className="text-xs text-slate-400">Manage encrypted files, permissions, and MinIO object storage tiers</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors">
            <FolderPlus className="w-4 h-4 text-blue-400" />
            New Folder
          </button>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Breadcrumbs & Search Toolbar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium overflow-x-auto pb-1 md:pb-0">
          <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Root</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-slate-400">Enterprise Share</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-blue-400 font-semibold">{currentFolder}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Filter current folder..." 
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-48"
            />
          </div>
          <button className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {folders.map((f, idx) => (
          <div 
            key={idx}
            onClick={() => setCurrentFolder(f.name)}
            className="p-4 rounded-2xl glass-card border border-slate-700/50 hover:border-blue-500/40 transition-all cursor-pointer group flex items-start justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <Folder className="w-5 h-5 fill-blue-500/20" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-slate-200 group-hover:text-blue-300 transition-colors line-clamp-1">{f.name}</h4>
                <span className="text-[11px] text-slate-400">{f.items} • {f.size}</span>
              </div>
            </div>
            <button className="text-slate-500 hover:text-slate-300 p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Files Table */}
      <div className="rounded-2xl glass-panel border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Files in Folder (5 items)</span>
          <span className="text-[11px] text-slate-400">All uploads protected by AES-256-GCM & ClamAV</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold bg-slate-900/40">
                <th className="py-3 px-5">File Name</th>
                <th className="py-3 px-4">Storage Tier</th>
                <th className="py-3 px-4">Security / Scan</th>
                <th className="py-3 px-4">Encryption</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Modified</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-5 font-medium text-slate-200 flex items-center gap-3">
                    {file.type === 'pdf' ? <FileText className="w-4 h-4 text-rose-400 shrink-0" /> :
                     file.type === 'archive' ? <FileArchive className="w-4 h-4 text-amber-400 shrink-0" /> :
                     file.type === 'code' ? <FileCode className="w-4 h-4 text-blue-400 shrink-0" /> :
                     <FileText className="w-4 h-4 text-purple-400 shrink-0" />}
                    <span className="truncate max-w-md group-hover:text-blue-300 transition-colors">{file.name}</span>
                  </td>
                  
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      file.tier === 'HOT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      file.tier === 'WARM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      file.tier === 'COLD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {file.tier}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {file.security === 'Clean' ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Clean
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-400 font-bold animate-pulse">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Threat Quarantined
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {file.encrypted ? (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Lock className="w-3 h-3 text-indigo-400" />
                        AES-256
                      </span>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-300">{file.size}</td>
                  
                  <td className="py-3.5 px-4 text-slate-400">{file.modified}</td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button title="Download" className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button title="Secure Share Link" className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button title="Delete" className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
