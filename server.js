var express = require('express'),
    app = express(),
    cors = require('cors'),
    cors_options = {origin: '*'},
    responseTime = require('response-time'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    ipfilter = require('express-ipfilter'),
    ips = ['::ffff:127.0.0.1', '127.0.0.1'],
    filterMiddleware = ipfilter(ips, {mode: 'allow'}),
    PORT = process.env.PORT || 8080,
    log = require('./server/logging/bunyan'),
    wordpressHandler = require('./server/handlers/wordpressRadioHandler'),
    elasticHandler = require('./server/handlers/elasticHandler');

app.use(cors(cors_options));

app.use(helmet());
app.use(responseTime());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/radio/keywords', wordpressHandler.keywords);
app.get('/radio/programs', wordpressHandler.programs);
app.get('/radio/dates', wordpressHandler.dates);

app.post('/radio/posts', filterMiddleware, elasticHandler.addWordpressDocument);
app.delete('/radio/posts', filterMiddleware, elasticHandler.removeWordpressDocument);
app.put('/radio/posts', filterMiddleware, elasticHandler.updateWordpressDocument);

var server = app.listen(PORT, function(){
  log.info('Server listening on port ' + PORT);
});

