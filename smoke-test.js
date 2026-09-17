const http = require('http');

const req = http.request({ host: 'localhost', port: 3000, path: '/', method: 'GET' }, (res) => {
  console.log('STATUS', res.statusCode);
  res.resume();
  res.on('end', () => process.exit(0));
});

req.on('error', (err) => {
  console.error('ERROR', err.message);
  process.exit(1);
});

req.end();
