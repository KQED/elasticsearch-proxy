var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData');

module.exports = {

  addWordpressDocument: function(req, res) {
    console.log(req);
    var link = req.body.link;
    
    //Prevent posts from staging to be added to elasticsearch
    if(link.match('ww2.staging.wpengine') === null) {
  
      log.info('Attempting to add entry: ' + JSON.stringify(req.body));
      
      var entry = processData.processPost(req.body);
      
      var endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + entry.id;

      requestUtil.handleElasticEntries(entry, endpoint, 'PUT', res);
      
    } else {
      
      log.info('Entry is from staging');

      res.status(200).send('Cannot add entry from staging');

    }
  
  },

  removeWordpressDocument: function(req, res) {

    var link = req.body.link;
    
    if(link.match('ww2.staging.wpengine') === null) {

      log.info('Attempting to remove entry: ' + JSON.stringify(req.body));
        
        var entry = processData.processPost(req.body);
  
        var endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + entry.id;
  
      requestUtil.handleElasticEntries(entry, endpoint, 'DELETE', res);

    } else {

      log.info('Entry is from staging');

      res.status(200).send('Cannot add entry from staging');
    
    }

  },
  
  updateWordpressDocument: function(req, res) {

    var link = req.body.link;
    
    if(link.match('ww2.staging.wpengine') === null) {

      log.info('Attempting to update entry: ' + JSON.stringify(entry));
      
      //updates entry or inserts it if it doesn't exist for some reason
      var entry = {
        "doc": processData.processPost(req.body),
        "doc_as_upsert" : true
      };
  
        var endpoint = processData.processEndpoint(req.body) + req.body.site_id + '%24' + req.body.id + '/_update';
  
        requestUtil.handleElasticEntries(entry, endpoint, 'POST', res);
    } else {
      log.info('Entry is from staging');

      res.status(200).send('Cannot add entry from staging');
    }
  
  }

};
