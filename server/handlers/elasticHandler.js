var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan');

module.exports = {

  addWordpressDocument: function(req, res) {

    var entry = req.body;

    log.info('Attempting to add entry ' + JSON.stringify(req.body));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + entry.ID, 'PUT', res);
  
  },

  removeWordpressDocument: function(req, res) {

    var entry = req.body;

    log.info('Attempting to remove entry ' + JSON.stringify(req.body));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + entry.ID, 'DELETE', res);

  },
  
  updateWordpressDocument: function(req, res) {

    var entry = {
      "doc": req.body,
      "doc_as_upsert" : true
    };

    log.info('Attempting to update entry ' + JSON.stringify(entry));

    requestUtil.handleElasticEntries(entry, process.env.RADIO_ENTRY + req.body.ID + '/_update', 'POST', res);

  }

};
