var express = require('express'),
    cors = require('cors'),
    //this will need to change, of course
    cors_options = {origin: '*'},
    log = require('./server/logging/bunyan'),
    wordpressHandler = require('./server/handlers/wordPressHandler'),
    app = express(),
    PORT = process.env.PORT || 8080;

app.use(cors(cors_options));

app.get('/keywords', wordpressHandler.keywords);
app.get('/programs', wordpressHandler.programs);
app.get('/dates', wordpressHandler.dates);


var server = app.listen(PORT, function(){
  log.info('Server listening on port ' + PORT);
});

