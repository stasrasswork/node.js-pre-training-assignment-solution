const metrics = {
  totalRequests: 0,
  totalResponseTimeMs: 0,
  byMethod: {},
  byStatus: {},
};

function recordRequest(method, statusCode, durationMs) {
  metrics.totalRequests += 1;
  metrics.totalResponseTimeMs += durationMs;
  metrics.byMethod[method] = (metrics.byMethod[method] || 0) + 1;
  metrics.byStatus[statusCode] = (metrics.byStatus[statusCode] || 0) + 1;
}

function getSnapshot() {
  const avgResponseTimeMs =
    metrics.totalRequests === 0 ? 
    0 : Number((metrics.totalResponseTimeMs / metrics.totalRequests).toFixed(2));
  
  return {
    totalRequests: metrics.totalRequests,
    avgResponseTimeMs,
    byMethod: metrics.byMethod,
    byStatus: metrics.byStatus,
    uptimeSec: Number(process.uptime().toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}

module.exports = { recordRequest, getSnapshot };