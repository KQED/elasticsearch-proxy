var express = require('express'),
    app = express(),
    cors = require('cors'),
    cors_options = {origin: '*'},
    responseTime = require('response-time'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    httpProxy = require('http-proxy'),
    filterMiddleware = require('./server/utils/filterMiddleware'),
    PORT = process.env.PORT || 8080,
    PROXY_PORT = process.env.PROXY_PORT || 3000,
    log = require('./server/logging/bunyan'),
    wordpressHandler = require('./server/handlers/wordpressRadioHandler'),
    elasticHandler = require('./server/handlers/elasticHandler');

app.use(cors(cors_options));

app.use(helmet());
app.use(responseTime());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req,res){res.send('Please use proper endpoint.');});
app.get('/radio/keywords', wordpressHandler.keywords);
app.get('/radio/keywords/perspectives', wordpressHandler.perspectives);
app.get('/radio/programs', wordpressHandler.programs);
app.get('/radio/dates', wordpressHandler.dates);

app.post('/radio/posts', filterMiddleware.ipFilter, elasticHandler.addWordpressDocument);
app.delete('/radio/posts', filterMiddleware.ipFilter, elasticHandler.removeWordpressDocument);
app.put('/radio/posts', filterMiddleware.ipFilter, elasticHandler.updateWordpressDocument);

var server = app.listen(PORT, function(){
  log.info('Server listening on port ' + PORT);
});

var elasticProxy = httpProxy.createProxyServer({target: process.env.ELASTIC}).listen(PROXY_PORT);

elasticProxy.on('error', function (err, req, res) {
  log.info(err);

  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('There was an error processing your request');
});
