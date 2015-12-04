var express = require('express'),
    cors = require('cors'),
    //this will need to change, of course
    cors_options = {origin: '*'},
    app = express(),
    PORT = process.env.PORT || 8080,
    log = require('./server/logging/bunyan'),
    queryMiddleware = require('./server/middleware/queryMiddleware'),
    authMiddleware = require('./server/middleware/authMiddleware'),
    wordpressHandler = require('./server/handlers/wordpressRadioHandler'),
    elasticHandler = require('./server/handlers/elasticHandler');

app.use(cors(cors_options));

app.get('/radio/keywords', queryMiddleware.queryCheck, wordpressHandler.keywords);
app.get('/radio/programs', queryMiddleware.queryCheck, wordpressHandler.programs);
app.get('/radio/dates', queryMiddleware.queryCheck, wordpressHandler.dates);
// app.post('/wordpress', elasticHandler.wordpress);

var server = app.listen(PORT, function(){
  log.info('Server listening on port ' + PORT);
});

