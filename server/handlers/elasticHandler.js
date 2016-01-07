var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData');

module.exports = {

  addWordpressDocument: function(req, res) {
    
    var entry = processData.processPost(req.body);
    
    log.info('Attempting to add entry: ' + JSON.stringify(req.body));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + req.body.site_id + '$' + entry.id, 'PUT', res);
  
  },

  removeWordpressDocument: function(req, res) {
    
    var entry = processData.processPost(req.body);

    log.info('Attempting to remove entry: ' + JSON.stringify(req.body));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + req.body.site_id + '$' + entry.id, 'DELETE', res);

  },
  
  updateWordpressDocument: function(req, res) {
    
    //updates entry or inserts it if it doesn't exist for some reason
    var entry = {
      "doc": processData.processPost(req.body),
      "doc_as_upsert" : true
    };

    log.info('Attempting to update entry: ' + JSON.stringify(entry));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + req.body.site_id + '$' + req.body.id + '/_update', 'POST', res);

  }

};
