const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.cluster0.d37x44t.mongodb.net', (err, records) => {
  if (err) {
    console.error('ERROR:', err);
  } else {
    console.log('SRV Records:');
    console.log(records);
  }
});