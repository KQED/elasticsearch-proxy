var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan');

module.exports = {

  wordpress: function(req, res) {

    var entry = req.body;

    log.info('Attempting to add entry' + entry);

    requestUtil.addElasticEntries(entry, process.env.ADD_RADIO_ENTRY + entry.ID, res);
  }

};
