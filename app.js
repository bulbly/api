const express = require('express');
const request = require('request');
const mcache = require('memory-cache');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const endpoint = 'http://may142020-001-site1.itempurl.com';
//const endpoint = 'http://localhost:6151/';

app.use(express.urlencoded({ limit: '50mb', extended: false }))
app.use(express.json({ limit: '50mb' }));

const cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            res.send(cachedBody)
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
    next();
});

app.get('/Api*', cache(10), (req, res) => {
    req.headers['ip'] = req.ip;
    request.get(`${endpoint}${req.originalUrl}`, { headers: req.header, json: true }, (err, data, body) => {
        res.set({ 'cache-control': data.headers['cache-control'], 'content-type': data.headers['content-type'] });
        res.status(data.statusCode).json(body);
    });
});

app.post('/Api*', (req, res) => {
    req.header['ip'] = req.ip;
    request.post(`${endpoint}${req.originalUrl}`, { headers: req.header, json: req.body }, (err, data, body) => {
        res.set({ 'cache-control': data.headers['cache-control'], 'content-type': data.headers['content-type'] });
        res.status(data.statusCode).json(body);
    });
});

app.get('*', function (req, res) {
    res.send(`this url is not working at the moment ${req.url}`);
});

app.listen(port, () => {
    console.log(`---Server running on ${port}---`);
});