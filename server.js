var express = require('express'),
    app = express(),
    cors = require('cors'),
    cors_options = {origin: '*'},
    responseTime = require('response-time'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    filterMiddleware = require('./server/utils/filterMiddleware'),
    PORT = process.env.PORT || 8080,
    log = require('./server/logging/bunyan'),
    wordpressHandler = require('./server/handlers/wordpressRadioHandler'),
    wordpressPerspectivesHandler = require('./server/handlers/wordpressPerspectivesHandler'),
    wordpressForumHandler = require('./server/handlers/wordpressForumHandler'),
    elasticHandler = require('./server/handlers/elasticHandler');

app.use(cors(cors_options));

app.use(helmet());

app.use(helmet.csp({
  defaultSrc: ["'self'", 'kqed.org']
}));

app.use(responseTime());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req,res){res.send('Please use proper endpoint.');});
app.get('/radio/keywords', wordpressHandler.keywords);
app.get('/radio/keywords/perspectives', wordpressPerspectivesHandler.keywords);
app.get('/radio/keywords/forum', wordpressForumHandler.keywords);
app.get('/radio/programs', wordpressHandler.programs);
app.get('/radio/dates', wordpressHandler.dates);
app.get('/radio/dates/perspectives', wordpressPerspectivesHandler.dates);
app.get('/radio/dates/forum', wordpressForumHandler.dates);

app.post('/radio/posts', filterMiddleware.ipFilter, elasticHandler.addWordpressDocument);
app.delete('/radio/posts', filterMiddleware.ipFilter, elasticHandler.removeWordpressDocument);
app.put('/radio/posts', filterMiddleware.ipFilter, elasticHandler.updateWordpressDocument);

var server = app.listen(PORT, function(){
  log.info('Server listening on port ' + PORT);
});
