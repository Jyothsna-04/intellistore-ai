import React from 'react';
import { Sparkles, Shield, Cloud, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Organization Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage cloud storage connections, AI LangGraph supervisor parameters, and security policies.
          </p>
        </div>
        <button 
          onClick={() => alert("Settings saved successfully across Railway production environment!")}
          className="btn-primary text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-500" /> Storage Topology & Endpoints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Hot NVMe Pool (MinIO / S3)</label>
              <input type="text" readOnly value="s3://intellistore-hot-nvme.railway.internal" className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-slate-500" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Cold Archive (Filebase IPFS/S3)</label>
              <input type="text" readOnly value="s3://intellistore-archive-s3.filebase.com" className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-slate-500" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" /> AI LangGraph Supervisor Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Primary AI Model</label>
              <select className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                <option>Llama-3-70B-Instruct (Local Railway Hub)</option>
                <option>Google Gemini 1.5 Pro</option>
                <option>OpenAI GPT-4o Enterprise</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Qdrant Vector DB Cluster URL</label>
              <input type="text" readOnly value="https://b68c0561-40cb-4713-9289-94e47a76bbd2.us-east-1-1.aws.cloud.qdrant.io" className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-slate-500 truncate" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" /> Zero-Trust Security Policies
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Require AES-256-GCM client-side envelope encryption on all file uploads</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Block file download if ClamAV malware scan is pending or inconclusive</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Auto-revoke Redis session tokens after 15 minutes of inactivity</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
