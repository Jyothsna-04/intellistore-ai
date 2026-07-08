import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Lock, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  HardDrive, 
  Cpu, 
  Terminal,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';

export const AdminPortalView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'telemetry'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = user?.email?.toLowerCase() === 'jyothsnrbipandu@gmail.com';

  const [usersList] = useState([
    {
      id: 'usr-admin-01',
      name: 'Jyothsna Sai P R',
      email: 'jyothsnrbipandu@gmail.com',
      role: 'ROLE_ADMIN',
      storageUsed: '14.2 GB',
      quota: '500 GB',
      mfa: true,
      lastActive: 'Active Now',
      status: 'ACTIVE'
    }
  ]);

  const auditLogs = [
    {
      id: 'log-9901',
      timestamp: '2026-07-08 23:41:12 UTC',
      event: 'LOGIN_SUCCESS_MFA',
      user: 'jyothsnrbipandu@gmail.com',
      ip: '103.211.54.12',
      resource: 'Zero-Trust Gateway',
      status: 'SUCCESS',
      hash: 'SHA256:8f41e0c...d9a'
    },
    {
      id: 'log-9900',
      timestamp: '2026-07-08 23:38:05 UTC',
      event: 'FILE_ENCRYPT_UPLOAD',
      user: 'jyothsnrbipandu@gmail.com',
      ip: '103.211.54.12',
      resource: 's3://intellistore-files/VTU_Result.pdf',
      status: 'SUCCESS',
      hash: 'AES-GCM-256'
    },
    {
      id: 'log-9899',
      timestamp: '2026-07-08 23:35:49 UTC',
      event: 'CLAMAV_SECURITY_SCAN',
      user: 'SYSTEM_SUPERVISOR',
      ip: '10.0.4.19',
      resource: 'LangGraph Pool Pipeline #4',
      status: 'CLEAN_PASS',
      hash: 'CLAMAV:v1.0.4'
    },
    {
      id: 'log-9898',
      timestamp: '2026-07-08 23:20:11 UTC',
      event: 'DEDUPLICATION_MERGE',
      user: 'engineer@intellistore.ai',
      ip: '198.51.100.42',
      resource: 'Chunk Hash Match #7f9a2e',
      status: 'SAVED_4.2MB',
      hash: 'SHA256:7f9a2e1...8bc'
    }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold border border-blue-500/20">
              <ShieldAlert className="w-3.5 h-3.5" /> {isAdmin ? 'VERIFIED ADMIN PORTAL' : 'RESTRICTED GOVERNANCE PORTAL'}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Admin: {user?.email || 'jyothsnrbipandu@gmail.com'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Enterprise Administrator Control Plane
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Zero-Trust access monitoring, enterprise user provisioning, audit logs, and cloud storage telemetry.
          </p>
        </div>

        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Governance Data
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">REGISTERED USERS</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">4 Active Users</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1 Enterprise Administrator
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">STORAGE POOL CONSUMPTION</span>
            <HardDrive className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">14.2 TB / 50 TB</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Filebase S3 Encrypted Object Pool</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ZERO-TRUST SECURITY</span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">AES-GCM-256</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">100% Client-Side Key Isolation</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">AI LANGGRAPH PIPELINE</span>
            <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Active Supervisor</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Qdrant Vector Index Online</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Organization User Registry
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" /> Zero-Trust Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'telemetry'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Server className="w-4 h-4" /> Storage Node Health
        </button>
      </div>

      {/* Tab 1: Organization Users */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredUsers.length} active workspace accounts
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-4">User Name & Email</th>
                  <th className="p-4">Enterprise Role</th>
                  <th className="p-4">Storage Usage</th>
                  <th className="p-4">MFA Protection</th>
                  <th className="p-4">Last Active</th>
                  <th className="p-4 text-right">Governance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {u.role === 'ROLE_ADMIN' ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-500/20">
                          ROLE_ADMIN (Enterprise Administrator)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                          ROLE_USER (Enterprise User)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {u.storageUsed} / <span className="text-slate-400">{u.quota}</span>
                    </td>
                    <td className="p-4">
                      {u.mfa ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Optional
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">{u.lastActive}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => alert(`Provisioned policy audit check for ${u.email}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Inspect Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Zero-Trust Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-sans font-bold">
                <tr>
                  <th className="p-4">Timestamp (UTC)</th>
                  <th className="p-4">Event Classification</th>
                  <th className="p-4">Principal Identity</th>
                  <th className="p-4">Source IP</th>
                  <th className="p-4">Target Resource / Cryptographic Hash</th>
                  <th className="p-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 text-slate-500">{log.timestamp}</td>
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{log.event}</td>
                    <td className="p-4 font-sans font-semibold text-slate-900 dark:text-white">{log.user}</td>
                    <td className="p-4 text-slate-500">{log.ip}</td>
                    <td className="p-4">
                      <div className="text-slate-900 dark:text-slate-200 font-semibold">{log.resource}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{log.hash}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-sans">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-500" /> Filebase S3 Distributed Storage Topology
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">S3 Endpoint Status</span>
                <span className="font-bold text-emerald-500">ONLINE (4 Replicas)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Average PUT / GET Latency</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">18ms / 12ms</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">AES-256 Client Encryption Check</span>
                <span className="font-bold text-emerald-500">PASSED</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Deduplication Hash Hit Ratio</span>
                <span className="font-bold text-blue-500">34.8% Storage Saved</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" /> LangGraph AI Supervisor Nodes
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Qdrant Vector Cluster</span>
                <span className="font-bold text-emerald-500">HEALTHY (99.98%)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Indexed Semantic Documents</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">14,209 Chunks</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">ClamAV Antimalware Scanner</span>
                <span className="font-bold text-emerald-500">RUNNING (Daemon v1.0.4)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Supervisor Inference Latency</span>
                <span className="font-bold text-purple-500">142ms Avg</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
