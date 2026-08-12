import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

export default function ApiLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getApiLogs();
      setLogs(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch API logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50';
      case 'POST': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50';
      case 'PUT': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
      case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusColor = (status) => {
    const code = Number(status);
    if (code >= 200 && code < 300) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (code >= 300 && code < 400) return 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300';
    if (code >= 400 && code < 500) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
    return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
  };

  if (loading) {
    return <LoadingState message="Fetching system audit logs..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchLogs} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            API Logs Sandbox
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Real-time server logs captured from express middlewares and stored in MongoDB database.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={fetchLogs}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-850 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 transition-all cursor-pointer"
          >
            Refresh Logs
          </button>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No API logs recorded yet. Send some requests to the server to populate the dashboard!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-850">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Method &amp; Route
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Latency
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client Info
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payload
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {logs.map((log) => (
                  <tr 
                    key={log.requestId} 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </td>

                    {/* Method & Route */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${getMethodColor(log.method)}`}>
                          {log.method}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 block max-w-xs truncate" title={log.endpoint}>
                          {log.endpoint}
                        </span>
                      </div>
                    </td>

                    {/* Status Code */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.statusCode)}`}>
                        {log.statusCode}
                      </span>
                    </td>

                    {/* Response Time */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {log.responseTime} ms
                    </td>

                    {/* IP & User Agent */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      <div className="font-semibold text-gray-700 dark:text-gray-300">{log.ipAddress}</div>
                      <div className="truncate max-w-[150px]" title={log.userAgent}>
                        {log.clientInfo ? `${log.clientInfo.browser || ''} on ${log.clientInfo.os || ''}` : log.userAgent}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Log details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden border border-gray-100 dark:border-gray-800 p-6 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                  Request Inspector
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-1">ID: {selectedLog.requestId}</p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block text-xs">Timestamp</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">HTTP status</span>
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${getStatusColor(selectedLog.statusCode)}`}>
                    {selectedLog.statusCode}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Route pattern</span>
                  <span className="font-mono text-xs text-gray-800 dark:text-gray-200 font-semibold">{selectedLog.route}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Origin IP</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedLog.ipAddress}</span>
                </div>
              </div>

              {selectedLog.pathParameters && Object.keys(selectedLog.pathParameters).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Path Parameters</h4>
                  <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200">
                    {JSON.stringify(selectedLog.pathParameters, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.queryParameters && Object.keys(selectedLog.queryParameters).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Query Parameters</h4>
                  <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200">
                    {JSON.stringify(selectedLog.queryParameters, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.requestBody && Object.keys(selectedLog.requestBody).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Request Body</h4>
                  <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200">
                    {JSON.stringify(selectedLog.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.error && (
                <div className="bg-rose-50 border border-rose-150 p-4 rounded-xl dark:bg-rose-950/20 dark:border-rose-900/50">
                  <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider mb-1">Error Captured</h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-mono break-all">{selectedLog.error}</p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
