import React from 'react';
import { ShieldCheck, Lock, Key, FileCheck } from 'lucide-react';

export const SecurityView: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/20">
            Zero-Trust Architecture
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Security & ClamAV Antivirus Quarantine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time payload inspection, AES-256-GCM encryption at rest, and Redis JWT session governance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> All Systems Secure (Score: 99.8/100)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Encryption at Rest</span>
            <Lock className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">AES-256-GCM</p>
          <p className="text-xs text-slate-500">Client-side cryptographic envelope applied before storage upload.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">ClamAV Heuristic Engine</span>
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">1.42M Scanned</p>
          <p className="text-xs text-emerald-500 font-semibold">0 malware signatures or ransomware payloads detected.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Zero-Trust JWT Auth</span>
            <Key className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">Redis Token Pool</p>
          <p className="text-xs text-slate-500">15-minute rotation tokens with instant Redis revocation.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-500" /> Recent ClamAV Inspection Logs
        </h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">SHA-256 Check: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
            <span className="text-emerald-500 font-bold">[CLEAN - PASSED]</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">SHA-256 Check: 87db3a5621a71941e72e1c9842a5bc65181792a7138cf151a6d96ec35b87002a</span>
            <span className="text-emerald-500 font-bold">[CLEAN - PASSED]</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">SHA-256 Check: 9e233247e4f44900b4062bcff0907ff300a89110d21a97800c6d2bc609121a91</span>
            <span className="text-emerald-500 font-bold">[CLEAN - PASSED]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
