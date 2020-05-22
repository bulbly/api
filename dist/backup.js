const express = require('express');
const request = require('request');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 5000;
const endpoint = 'http://may142020-001-site1.itempurl.com';
//const endpoint = 'http://localhost:6151/';

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];

// app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
app.set('views', __dirname + '');
app.engine('html', ejs.renderFile);

// app.configure(function(){
//     app.use(express.bodyParser());
//     app.use(express.methodOverride());
//     app.use(app.router);
//     app.use(express.static(path.join(__dirname, 'public')));
//     app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
//     app.set('views', __dirname + '/views');
//     app.engine('html', require('ejs').renderFile);
// });

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
//     next();
// });

// app.get('/', (req, res) => {
//     res.send("Hi there!!");
// });

app.get('/Api*', (req, res) => {
    request.get(`${endpoint}${req.originalUrl}`, { headers: req.header, json: true }, (err, data, body) => {
        res.status(data.statusCode).json(body);
    });
});

app.post('/Api*', (req, res) => {
    request.post(`${endpoint}${req.originalUrl}`, { headers: req.header, json: req.body, form: req.form, formData: req.formData }, (err, data, body) => {
        res.status(data.statusCode).json(body);
    });
});

app.get('*', function(req, res){
    res.render('dist/app/index.html');
});

// app.get('*', (req, res) => {
//     if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
//         res.sendFile(path.resolve(`${req.url}`));
//     } else {
//         res.sendFile(path.resolve('index.html'));
//     }
// });

app.listen(port, () => {
    console.log(`---Server running on ${port}---`);
});