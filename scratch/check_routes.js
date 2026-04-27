const http = require('http');

const routes = ['/', '/privacy', '/dmca', '/dnc', '/terms'];

routes.forEach(route => {
    http.get(`http://localhost:3000${route}`, (res) => {
        console.log(`${route}: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`${route}: Error - ${err.message}`);
    });
});
