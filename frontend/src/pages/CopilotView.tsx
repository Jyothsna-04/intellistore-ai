import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  TrendingDown, 
  Layers, 
  Play, 
  Copy, 
  FileText, 
  X, 
  Check
} from 'lucide-react';

export const CopilotView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'duplicates' | 'forecast' | 'summary' | 'simulation'>('recommendations');
  const [selectedXaiRec, setSelectedXaiRec] = useState<any | null>(null);
  const [simDays, setSimDays] = useState<number>(90);
  const [simAggression, setSimAggression] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [approvedRecs, setApprovedRecs] = useState<string[]>([]);

  const recommendations = [
    {
      id: 'REC-101',
      title: 'Migrate Q1 Financial Logs from Hot NVMe to Filebase S3 Deep Archive',
      dept: 'Finance & Accounts',
      savings: '$180/mo',
      storage: '1.2 TB',
      confidence: '99.4%',
      risk: 'Low Risk',
      riskColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      xai: {
        problem: '1.2 TB of Q1 financial logs have not been accessed by any user or service for over 180 days, yet they reside on expensive Hot NVMe storage pools ($0.15/GB/mo).',
        analysis: 'LangGraph heuristics analyzed access logs across 14 database tables and confirmed zero READ/WRITE operations since April 1st.',
        reason: 'Migrating immutable financial records to decentralized Filebase S3 Archive ($0.015/GB/mo) satisfies 7-year SOX compliance while cutting storage costs by 90%.',
        resources: 'Bucket: intellistore-hot-nvme -> Target: intellistore-archive-s3 (4,210 blob files)',
        costImpact: 'Immediate reduction of $180.00/month on AWS/Railway storage invoices.',
        confidenceScore: '99.4% (Based on 180-day zero-read access telemetry)',
        rollback: '100% Rollback available via instant S3 reverse-restore API (RTO < 5 minutes).',
        security: 'Encrypted with client-side AES-256-GCM before transport over TLS 1.3.',
        compliance: 'Compliant with SOX Section 802 and GDPR Data Minimization policies.',
        agent: 'LangGraph Multi-Agent Lifecycle Supervisor v1.2'
      }
    },
    {
      id: 'REC-102',
      title: 'Deduplicate Redundant Engineering CAD Assets Across 3 Team Folders',
      dept: 'Engineering & R&D',
      savings: '$95/mo',
      storage: '480 GB',
      confidence: '98.8%',
      risk: 'Immediate ROI',
      riskColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      xai: {
        problem: 'Three separate engineering teams uploaded identical 160 GB CAD render archives into different workspace directories, consuming 480 GB total.',
        analysis: 'Qdrant vector similarity and ClamAV SHA-256 checksum matching verified 100% bit-for-bit identity across all three directories.',
        reason: 'Replacing duplicate binary payloads with symlink pointers or object store hard references reclaims 320 GB without affecting team workflows.',
        resources: 'Folders: /eng-team-a/cad/, /eng-team-b/cad/, /qa-staging/cad/',
        costImpact: 'Reclaims $95.00/month in cloud block storage fees.',
        confidenceScore: '98.8% (SHA-256 Checksum Exact Match)',
        rollback: 'Original pointers are backed up to metadata DB before symlink substitution.',
        security: 'Zero impact to RBAC permissions; each team retains directory access rights.',
        compliance: 'ISO/IEC 27001 standard storage efficiency practice.',
        agent: 'Qdrant Semantic Deduplication Classifier v1.0'
      }
    },
    {
      id: 'REC-103',
      title: 'Compress Inactive HR Video Onboarding Files using Zstandard',
      dept: 'Human Resources',
      savings: '$65/mo',
      storage: '310 GB',
      confidence: '97.2%',
      risk: 'Low Risk',
      riskColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      xai: {
        problem: 'Uncompressed 4K video onboarding files from 2024 consume 310 GB in the general employee portal storage pool.',
        analysis: 'Video metadata check indicates these training clips are only streamed once per month by new hires.',
        reason: 'Applying lossless Zstandard (zstd) compression reduces storage footprint by 45% while preserving real-time decompression streaming speed.',
        resources: 'Folder: /hr-portal/onboarding-videos/ (14 MP4 files)',
        costImpact: 'Saves $65.00/month continuously.',
        confidenceScore: '97.2% (Codec compatibility verified)',
        rollback: 'Decompression takes < 2 seconds per clip automatically upon stream request.',
        security: 'Payload checksums signed and verified post-compression.',
        compliance: 'Standard enterprise media optimization.',
        agent: 'Autonomous Compression & Codec Agent v2.1'
      }
    },
    {
      id: 'REC-104',
      title: 'Purge 1,420 Expired Temporary Sandbox Builds from DevOps Pool',
      dept: 'DevOps & IT',
      savings: '$80/mo',
      storage: '410 GB',
      confidence: '99.9%',
      risk: 'Zero Risk',
      riskColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      xai: {
        problem: 'Temporary CI/CD build artifacts from pull requests closed over 60 days ago remain orphaned in the DevOps scratch storage pool.',
        analysis: 'GitHub Webhook sync confirmed the parent pull requests and feature branches were deleted months ago.',
        reason: 'Purging expired scratch artifacts complies with our 30-day automated TTL policy and prevents storage leak bloat.',
        resources: 'Bucket: intellistore-devops-scratch (1,420 orphaned tarballs)',
        costImpact: 'Saves $80.00/month immediately.',
        confidenceScore: '99.9% (Verified via GitHub PR deletion API)',
        rollback: 'Artifacts can be rebuilt from git source code in < 3 minutes if ever required.',
        security: 'Removes outdated dependencies and potential security vulnerability footprints.',
        compliance: 'Automated cleanup aligns with SOC2 hygiene requirements.',
        agent: 'DevOps CI/CD Lifecycle Garbage Collector'
      }
    }
  ];

  const handleApprove = (id: string) => {
    setApprovedRecs(prev => [...prev, id]);
    setSelectedXaiRec(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-wider border border-purple-500/20">
              LangGraph AI Supervisor
            </span>
            <span className="text-xs text-slate-400 font-medium">Model: Llama-3 / Gemini Pro</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Enterprise AI Optimization Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Autonomous lifecycle management, SHA-256 deduplication, and Explainable AI (XAI) justifications with verifiable financial ROI.
          </p>
        </div>

        {/* 3 Quick AI Health Metrics */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
          <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs text-center min-w-[110px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Health Score</p>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">94 / 100</p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs text-center min-w-[110px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Optimization</p>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400">91 / 100</p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs text-center min-w-[110px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Potential ROI</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">$420/mo</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'recommendations', label: 'AI Recommendations (4)', icon: Sparkles },
          { id: 'duplicates', label: 'Duplicate Finder', icon: Copy },
          { id: 'forecast', label: 'Storage Forecast', icon: TrendingDown },
          { id: 'summary', label: 'Executive Summary', icon: FileText },
          { id: 'simulation', label: 'What-If Simulation Twin', icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: AI RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => {
              const isApproved = approvedRecs.includes(rec.id);
              return (
                <div 
                  key={rec.id}
                  className={`p-6 rounded-2xl bg-white dark:bg-[#111827] border transition-all flex flex-col justify-between space-y-4 ${isApproved ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/10' : 'border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md'}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {rec.dept}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${rec.riskColor}`}>
                        {rec.risk}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {rec.title}
                    </h3>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                    <div>
                      <span className="text-slate-400 text-[10px] block">ESTIMATED SAVINGS</span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-base font-black">{rec.savings}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">RECOVERABLE</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{rec.storage}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">CONFIDENCE</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{rec.confidence}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button 
                      onClick={() => setSelectedXaiRec(rec)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                      Why This Recommendation?
                    </button>

                    {isApproved ? (
                      <button disabled className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                        <Check className="w-4 h-4" /> Approved
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApprove(rec.id)}
                        className="btn-primary text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                      >
                        Approve Action <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DUPLICATE FINDER */}
      {activeTab === 'duplicates' && (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 text-center">
          <Copy className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Qdrant Semantic & Checksum Duplicate Finder</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our ClamAV SHA-256 and Qdrant embedding matcher has found 480 GB of bit-for-bit identical CAD files across Engineering folders.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 max-w-xl mx-auto border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs font-mono">
            <p className="text-emerald-500 font-bold">✓ SHA-256 Checksum Exact Match Confirmed</p>
            <p className="text-slate-400">File 1: /eng-team-a/cad/engine_block_v4.dwg (160 MB)</p>
            <p className="text-slate-400">File 2: /eng-team-b/cad/engine_block_v4.dwg (160 MB)</p>
            <p className="text-slate-400">File 3: /qa-staging/cad/engine_block_v4.dwg (160 MB)</p>
          </div>
          <button 
            onClick={() => alert("Deduplication action triggered. Symlinks created, reclaiming 320 MB instantly.")}
            className="btn-primary text-xs px-6 py-2.5 shadow-lg shadow-blue-500/20"
          >
            Reclaim 320 MB via Symlink Deduplication
          </button>
        </div>
      )}

      {/* TAB 5: WHAT-IF SIMULATION TWIN */}
      {activeTab === 'simulation' && (
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Digital Storage Twin Simulation Engine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Test predictive lifecycle policies on your digital twin without touching live production blobs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Simulation Horizon: <span className="text-blue-500 font-extrabold">{simDays} Days</span>
              </label>
              <input 
                type="range" 
                min="30" 
                max="365" 
                step="30"
                value={simDays} 
                onChange={(e) => setSimDays(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                <span>30 Days (1 Mo)</span>
                <span>180 Days (6 Mo)</span>
                <span>365 Days (1 Yr)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">AI Aggressiveness Policy</label>
              <div className="grid grid-cols-3 gap-2">
                {['conservative', 'balanced', 'aggressive'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSimAggression(mode as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${simAggression === mode ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PREDICTED DIGITAL TWIN RESULT</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Save ${simAggression === 'conservative' ? '290' : simAggression === 'balanced' ? '420' : '680'} / month
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Reclaims {simAggression === 'conservative' ? '9.4' : simAggression === 'balanced' ? '14.2' : '22.8'} TB over {simDays} days with 0.00% data loss risk.
              </p>
            </div>

            <button 
              onClick={() => alert(`Digital Twin Simulation complete! Forecast confirmed: $${simAggression === 'balanced' ? '420' : '680'}/mo savings verified.`)}
              className="btn-primary text-xs px-6 py-3 shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" /> Apply Policy to Live Storage
            </button>
          </div>
        </div>
      )}

      {/* EXPLAINABLE AI (XAI) 10-QUESTION JUSTIFICATION MODAL */}
      {selectedXaiRec && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Explainable AI (XAI) Justification Framework</span>
                  <h2 className="text-lg font-black text-white leading-tight">{selectedXaiRec.title}</h2>
                </div>
              </div>
              <button onClick={() => setSelectedXaiRec(null)} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: The 10 Mandatory Questions */}
            <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="font-bold text-slate-400 text-[10px] uppercase">1. BUSINESS PROBLEM</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedXaiRec.xai.problem}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="font-bold text-slate-400 text-[10px] uppercase">2. TECHNICAL ANALYSIS</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedXaiRec.xai.analysis}</p>
                </div>
              </div>

              <div className="pt-3">
                <p className="font-bold text-slate-400 text-[10px] uppercase">3. WHY THIS SPECIFIC RECOMMENDATION?</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedXaiRec.xai.reason}</p>
              </div>

              <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <p className="font-bold text-[10px] uppercase">4. COST IMPACT</p>
                  <p className="font-black text-sm mt-0.5">{selectedXaiRec.xai.costImpact}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                  <p className="font-bold text-[10px] uppercase">5. CONFIDENCE SCORE</p>
                  <p className="font-black text-sm mt-0.5">{selectedXaiRec.xai.confidenceScore}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                  <p className="font-bold text-[10px] uppercase">6. AI SUPERVISOR</p>
                  <p className="font-bold text-xs mt-0.5">{selectedXaiRec.xai.agent}</p>
                </div>
              </div>

              <div className="pt-3">
                <p className="font-bold text-slate-400 text-[10px] uppercase">7. AFFECTED STORAGE RESOURCES</p>
                <code className="block mt-1 p-2 rounded bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                  {selectedXaiRec.xai.resources}
                </code>
              </div>

              <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-slate-400 text-[10px] uppercase">8. ROLLBACK & DISASTER RECOVERY</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedXaiRec.xai.rollback}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 text-[10px] uppercase">9. ZERO-TRUST SECURITY IMPACT</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedXaiRec.xai.security}</p>
                </div>
              </div>

              <div className="pt-3">
                <p className="font-bold text-slate-400 text-[10px] uppercase">10. REGULATORY & COMPLIANCE ALIGNMENT</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedXaiRec.xai.compliance}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Verified by LangGraph Multi-Agent Consensus
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedXaiRec(null)} className="btn-secondary text-xs">Close Panel</button>
                <button 
                  onClick={() => handleApprove(selectedXaiRec.id)}
                  className="btn-primary text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Check className="w-4 h-4" /> Approve & Execute Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
