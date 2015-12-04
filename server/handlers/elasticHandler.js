var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan');

module.exports = {

  addWordpressDocument: function(req, res) {

    var entry = req.body;

    log.info('Attempting to add entry ' + JSON.stringify(req.body));

    requestUtil.addElasticEntries(entry, process.env.ADD_RADIO_ENTRY + entry.ID, res);
  
  },

  removeWordpressDocument: function(req, res) {

  },
  
  updateWordpressDocument: function(req, res) {

  }

};
