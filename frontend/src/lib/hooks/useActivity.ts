import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient, { extractData } from '../apiClient';
import { API_URL } from '../config';

export interface ActivityEvent {
  id: string;
  action: string;
  category: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  email: string;
  resource: string;
  resourceType: string;
  status: string;
  timestamp: string;
}

export interface SystemStatus {
  backend: ServiceStatus;
  database: ServiceStatus;
  cache: ServiceStatus;
  objectStore: ServiceStatus;
  aiService: ServiceStatus;
  vectorDb: ServiceStatus;
  virusScanner: ServiceStatus;
  checkedAt: string;
}

export interface ServiceStatus {
  status: 'healthy' | 'warning' | 'offline' | 'unknown';
  label: string;
}

/**
 * useActivityFeed — connects to the SSE /api/events/stream endpoint.
 * Automatically reconnects on disconnect. Returns live events array
 * (most recent first, capped at 100 items).
 */
export const useActivityFeed = (global = true) => {
  const [liveEvents, setLiveEvents] = useState<ActivityEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('intellistore_token');
    if (!token) return;

    const url = `${API_URL}/api/events/stream?global=${global}&token=${encodeURIComponent(token)}`;
    
    const connect = () => {
      const es = new EventSource(url);
      esRef.current = es;

      es.addEventListener('connected', () => {
        setConnected(true);
      });

      // Listen to all named event types that AuditLogService publishes
      const categories = ['Authentication', 'Storage', 'Sharing', 'Administration', 'System'];
      categories.forEach(cat => {
        es.addEventListener(cat, (e: MessageEvent) => {
          try {
            const event: ActivityEvent = JSON.parse(e.data);
            setLiveEvents(prev => [event, ...prev].slice(0, 100));
          } catch {
            // ignore malformed events
          }
        });
      });

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Auto-reconnect after 5s
        setTimeout(connect, 5000);
      };
    };

    connect();
    return () => {
      esRef.current?.close();
    };
  }, [global]);

  return { liveEvents, connected };
};

/**
 * useActivityHistory — paginated audit log history from PostgreSQL via REST.
 */
export const useActivityHistory = (page = 0, size = 50) =>
  useQuery({
    queryKey: ['activity', 'history', page, size],
    queryFn: async () => {
      const res = await apiClient.get('/api/activity', { params: { page, size } });
      return extractData<ActivityEvent[]>(res);
    },
    staleTime: 1000 * 30,
  });

/**
 * useSystemStatus — fetches live service health from backend.
 */
export const useSystemStatus = () =>
  useQuery({
    queryKey: ['activity', 'system-status'],
    queryFn: async () => {
      const res = await apiClient.get('/api/activity/system-status');
      return extractData<SystemStatus>(res);
    },
    refetchInterval: 1000 * 30, // refresh every 30s
    staleTime: 1000 * 20,
  });
