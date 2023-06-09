'use strict';

const express = require('express');
const client = require('prom-client')

// ------------------ Prometheus ------------------
// Create a Registry which registers the metrics
const register = new client.Registry()
// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'example-nodejs-app'
})
// Enable the collection of default metrics
client.collectDefaultMetrics({ register })
// Histogram metric to track the duration in seconds of the requests
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
})
register.registerMetric(httpRequestDurationMicroseconds)

// Gauge metric to track max duration in seconds of the requests
const httpRequestDurationMaxMicroseconds = new client.Gauge({
  name: 'http_request_duration_max_seconds',
  help: 'Max duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code']
})
register.registerMetric(httpRequestDurationMaxMicroseconds)

// ------------------ App ------------------
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

// Metrics route
app.get('/metrics', async (req, res) => { 
  try {
		res.set('Content-Type', register.contentType);
		res.end(await register.metrics());
	} catch (ex) {
		res.status(500).end(ex);
	}
})

// Metrics middleware to track the duration of the requests
const profilerMiddleware = (req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer()
  res.once('finish', () => {
    const duration = end({ route: req.baseUrl + req.path, method: req.method, code: res.statusCode });

    // Update max duration metric
    httpRequestDurationMaxMicroseconds
      .labels(req.method, req.baseUrl + req.path, res.statusCode)
      .set(duration);

    console.log('Request to %s Duration  %d', req.baseUrl + req.path, duration);
  });
  next();
};
app.use(profilerMiddleware);

// Delay middleware to simulate a long running process
const delayMiddleware = (req, res, next) => {
  setTimeout(() => {
    next();
  }, Math.random() * 1000);
};
app.use(delayMiddleware);

// Main route
app.get('/', (req, res) => {
  // Set status code
  res.status(200);
  res.send('Hello World !');
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
