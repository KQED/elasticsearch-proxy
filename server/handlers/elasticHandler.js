var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData');

module.exports = {

  addWordpressDocument: function(req, res) {
      var endpoint = "";

      log.info('Attempting to add entry: ' + JSON.stringify(req.body));
      
      var entry = processData.processPost(req.body, req);
      if(req.elections) {
        endpoint = process.env.INDEX + 'elections/' + req.body.site_id + '%24' + entry.id;
      } else {
        endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + entry.id;
      }

      log.info('Endpoint: ' + endpoint);

      requestUtil.handleElasticEntries(entry, endpoint, 'PUT', res);
        
  },

  removeWordpressDocument: function(req, res) {
      var endpoint = "";

      log.info('Attempting to remove entry: ' + JSON.stringify(req.body));
        
      if(req.elections) {
        endpoint = process.env.INDEX + 'elections/' + req.body.site_id + '%24' + req.body.id;
      } else {
        endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + req.body.id;
      }
      
      log.info('Endpoint: ' + endpoint);
  
      requestUtil.handleElasticEntries(null, endpoint, 'DELETE', res);

  },
  
  updateWordpressDocument: function(req, res) {
      var endpoint = "";

      log.info('Attempting to update entry: ' + JSON.stringify(entry));
      
      //updates entry or inserts it if it doesn't exist for some reason
      var entry = {
        "doc": processData.processPost(req.body, req),
        "doc_as_upsert" : true
      };
      if(req.elections) {
        endpoint = process.env.INDEX + 'elections/' + req.body.site_id + '%24' + entry.id;
      } else {
        endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + req.body.id + '/_update';
      }

      log.info('Endpoint: ' + endpoint);
      
      requestUtil.handleElasticEntries(entry, endpoint, 'POST', res);
          
  }

};
