var rp = require('request-promise'),
    log = require('../logging/bunyan');

module.exports = {

  //handles retrieving elasticsearch entries
  getElasticsearch: function(query, endpoint, res) {

    var options = {
      method: 'POST',
      uri: process.env.ELASTIC + endpoint,
      body: JSON.stringify(query)
    };

    rp(options)
      .then(function(body){

        body = JSON.parse(body);
        var entries = body.hits.hits.map(function(item){
          item._source.id = item._id;
          return item._source;
        
        });
        
        return entries;
      
      }).then(function(entries){
      
        res.status(200).send(entries);
      
      }).catch(function (err) {

        log.info(err);
        res.status(501).send('There was an error communicating with Elasticsearch.');

      });

  },

  //handles adding/updating/deleting elasticseach entries
  handleElasticEntries: function(data, endpoint, method, res) {

    var options = {
      method: method,
      uri: process.env.ELASTIC + endpoint,
      body: JSON.stringify(data)
    };

  rp(options)
    .then(function(){
      
      res.status(201).send('Document successfully handled');
    
    }).catch(function (err) {

      log.info(err);
      res.status(501).send('There was an error communicating with Elasticsearch.');

    });

  }
};
