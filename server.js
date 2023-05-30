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

// ------------------ App ------------------
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World 11123s33s4');
});

app.get('/metrics', async (req, res) => { 
  const end = httpRequestDurationMicroseconds.startTimer();
  try {
		res.set('Content-Type', register.contentType);
		res.end(await register.metrics());
	} catch (ex) {
		res.status(500).end(ex);
	}
  end({ route: req.baseUrl + req.path, code: res.statusCode, method: req.method })
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
