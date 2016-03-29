var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData');

module.exports = {

  addWordpressDocument: function(req, res) {

    log.info('Attempting to add entry: ' + JSON.stringify(req.body));
    
    var entry = processData.processPost(req.body);
    
    var endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + entry.id;

    requestUtil.handleElasticEntries(entry, endpoint, 'PUT', res);
  
  },

  removeWordpressDocument: function(req, res) {

    log.info('Attempting to remove entry: ' + JSON.stringify(req.body));
    
    var entry = processData.processPost(req.body);

    var endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + entry.id;

    requestUtil.handleElasticEntries(entry, endpoint, 'DELETE', res);

  },
  
  updateWordpressDocument: function(req, res) {

    log.info('Attempting to update entry: ' + JSON.stringify(entry));
    
    //updates entry or inserts it if it doesn't exist for some reason
    var entry = {
      "doc": processData.processPost(req.body),
      "doc_as_upsert" : true
    };

    var endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + req.body.id + '/_update';

    requestUtil.handleElasticEntries(entry, endpoint, 'POST', res);

  }

};
