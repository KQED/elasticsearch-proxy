var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan');

module.exports = {

  addWordpressDocument: function(req, res) {
    console.log(req.body);
    var entry = req.body;
    log.info('Attempting to add entry ' + JSON.stringify(req.body));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + entry.siteId + '$' + entry.Id, 'PUT', res);
  
  },

  removeWordpressDocument: function(req, res) {
    console.log(req.body);
    var entry = req.body;

    log.info('Attempting to remove entry ' + JSON.stringify(req.body));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + entry.siteId + '$' + entry.Id, 'DELETE', res);

  },
  
  updateWordpressDocument: function(req, res) {
    console.log(req.body);
    //updates entry or inserts it if it doesn't exist for some reason
    var entry = {
      "doc": req.body,
      "doc_as_upsert" : true
    };

    log.info('Attempting to update entry ' + JSON.stringify(entry));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + req.body.siteId + '$' + req.body.Id + '/_update', 'POST', res);

  }

};
