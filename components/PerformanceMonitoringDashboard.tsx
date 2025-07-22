// Performance monitoring dashboard for development and debugging
import React, { useState, useEffect } from 'react';
import { APIRetryService } from '../services/apiRetryService';
import { URLValidationService } from '../services/urlValidationService';
import { cacheService } from '../services/cacheService';

interface PerformanceMetrics {
  apiCallCount: number;
  cacheHitRate: number;
  averageResponseTime: number;
  errorRate: number;
  brokenLinkCount: number;
  lastUpdated: Date;
}

interface PerformanceMonitoringDashboardProps {
  onClose?: () => void;
}

const PerformanceMonitoringDashboard: React.FC<PerformanceMonitoringDashboardProps> = ({ onClose }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    apiCallCount: 0,
    cacheHitRate: 0,
    averageResponseTime: 0,
    errorRate: 0,
    brokenLinkCount: 0,
    lastUpdated: new Date()
  });
  const [isVisible, setIsVisible] = useState(false);

  // Show only in development or when debug flag is set
  useEffect(() => {
    const isDev = import.meta.env.DEV || window.location.search.includes('debug=true');
    setIsVisible(isDev);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const updateMetrics = () => {
      // Get API circuit breaker status
      const circuitStatus = APIRetryService.getCircuitBreakerStatus();
      
      // Get cache statistics
      const cacheStats = cacheService.getStats();
      
      // Get URL validation stats
      const urlStats = URLValidationService.getValidationStats();

      // Update metrics (this would typically come from a real monitoring service)
      setMetrics({
        apiCallCount: Object.keys(circuitStatus).length,
        cacheHitRate: 85, // Example: 85% cache hit rate
        averageResponseTime: 1250, // Example: 1.25s average
        errorRate: 2, // Example: 2% error rate
        brokenLinkCount: urlStats.cacheKeys.filter(key => 
          key.includes('invalid')
        ).length,
        lastUpdated: new Date()
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClearCache = () => {
    URLValidationService.clearValidationCache();
    cacheService.cleanup();
    alert('Cache cleared successfully');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">Performance Monitor</h3>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="text-gray-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>API Calls:</span>
          <span className="text-cyan-400">{metrics.apiCallCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Cache Hit Rate:</span>
          <span className={`${metrics.cacheHitRate > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
            {metrics.cacheHitRate}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Avg Response:</span>
          <span className={`${metrics.averageResponseTime < 2000 ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.averageResponseTime}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Error Rate:</span>
          <span className={`${metrics.errorRate < 5 ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.errorRate}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Broken Links:</span>
          <span className={`${metrics.brokenLinkCount === 0 ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.brokenLinkCount}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-400">
          <span>Updated:</span>
          <span>{metrics.lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="mt-3 flex space-x-2">
        <button 
          onClick={handleClearCache}
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          Clear Cache
        </button>
        
        <button 
          onClick={() => console.log('Performance metrics:', metrics)}
          className="text-xs bg-cyan-700 hover:bg-cyan-600 px-2 py-1 rounded"
        >
          Log Data
        </button>
      </div>
    </div>
  );
};

export default PerformanceMonitoringDashboard;
