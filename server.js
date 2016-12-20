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
    wordpressRadioHandler = require('./server/handlers/wordpressRadioHandler'),
    wordpressPostsHandler = require('./server/handlers/wordpressPostsHandler'),
    wordpressPerspectivesHandler = require('./server/handlers/wordpressPerspectivesHandler'),
    wordpressElectionHandler = require('./server/handlers/wordpressElectionHandler'),
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
app.get('/radio/keywords', wordpressRadioHandler.keywords);
app.get('/radio/keywords/perspectives', wordpressPerspectivesHandler.keywords);
app.get('/radio/keywords/forum', wordpressForumHandler.keywords);
app.get('/radio/programs', wordpressRadioHandler.programs);
app.get('/radio/dates', wordpressRadioHandler.dates);
app.get('/radio/dates/perspectives', wordpressPerspectivesHandler.dates);
app.get('/radio/dates/forum', wordpressForumHandler.dates);

// app.get('/wordpress', wordpressElectionHandler.chronological);
app.get('/wordpress/:site', wordpressPostsHandler.chronological);
app.get('/wordpress/keywords/:site', wordpressPostsHandler.keywords);
app.get('/wordpress/dates/:site', wordpressPostsHandler.dates);

app.post('/radio/posts', filterMiddleware.ipFilter, filterMiddleware.postFilter, elasticHandler.addWordpressDocument);
app.delete('/radio/posts', filterMiddleware.ipFilter, filterMiddleware.postFilter, elasticHandler.removeWordpressDocument);
app.put('/radio/posts', filterMiddleware.ipFilter, filterMiddleware.postFilter, elasticHandler.updateWordpressDocument);

app.post('/wordpress/posts', filterMiddleware.ipFilter, filterMiddleware.postFilter, elasticHandler.addWordpressDocument);
app.delete('/wordpress/posts', filterMiddleware.ipFilter, filterMiddleware.postFilter, elasticHandler.removeWordpressDocument);
app.put('/wordpress/posts', filterMiddleware.ipFilter, filterMiddleware.postFilter, elasticHandler.updateWordpressDocument);

var server = app.listen(PORT, function(){
  log.info('Server listening on port ' + PORT);
});
