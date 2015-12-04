var rp = require('request-promise'),
    log = require('../logging/bunyan');


var getElasticsearch = function(query) {

  var options = {
    method: 'POST',
    uri: process.env.ELASTIC + process.env.RADIO_ENDPOINT,
    body: JSON.stringify(query)
  };

  rp(options)
  .then(function(body){
    
    body = JSON.parse(body);
    var articles = body.hits.hits.map(function(item){
      item._source.id = item._id;
      return item._source;
    });
    return articles;
  
  }).then(function(articles){
  
    res.status(200).send(articles);
  
  }).catch(function (err) {
  
    log.info(err);
    res.status(501).send('There was an error communicating with Elasticsearch.');

  });

};

module.exports = {

  keywords: function(req, res) {

    var queryTerm = req.query.keywords,
        data = {};

    if (queryTerm) {

      data = {
        "from" : 0, "size" : 30,
        "query" : {
          "function_score": {
            "query" : {
              "multi_match" : {
                  "fields" : ["title^5", "author^2", "content", "tags^3", "excerpt^3"],
                  "query" : queryTerm,
                  "slop":  10,
                  "type" : "phrase_prefix"
              }
            },
            "gauss": {
              "date": {
                    "scale": "10d",
                    "decay" : 0.5 
              }
            },
            "score_mode": "multiply"
          }
        }
      };
       
     getElasticsearch(data); 

    } else {

      res.status(401).send('Must add keyword query string to request.');

    }
  
  },
  
  programs: function(req, res) {
    var queryTerm = req.query.keywords,
        programName = req.query.program,
        data = {};
        if (programName) {

          data = {
            "from" : 0, "size" : 30,
            "query" : {
              "filtered": {
                "filter": {
                  "term": {
                    "programs": programName
                  }
                }
              }
            },
            "sort": { "date": { "order": "desc" }}
          };

          getElasticsearch(data);

        } else if (programName && queryTerm) {
            data = {
              "from" : 0, "size" : 30,
              "query" : {
                "function_score": {
                  "query" : {
                    "bool": {
                          "must":     { "match": { "programs": programName }},
                          "should": {
                          "multi_match" : {
                              "fields" : ["title^5", "author^2", "content", "tags^3", "excerpt^3"],
                              "query" : queryTerm,
                              "slop":  10,
                              "type" : "phrase_prefix"
                          }

                        }
                    },
                    "minimum_should_match" : "75%"
                  },
                  "gauss": {
                    "date": {
                          "scale": "10d",
                          "decay" : 0.5 
                    }
                  },
                  "score_mode": "multiply"
                }
              }
            };

          getElasticsearch(data);

        } else {

          res.status(401).send('Must add program query string to request.');

        }

  },

  dates: function(req, res) {

    var startDate = req.query.startDate,
        endDate  = req.query.endDate || startDate,
        programName = req.query.program,
        data = {};
    
    if (programName && startDate) {

      data = {
        "from" : 0, "size" : 60,
          "query" : {
            "filtered" : {
              "filter" : {
                "term": {
                  "programs": programName
                },
                "range" : {
                  "date" : {
                      "gte" : startDate,
                      "lte"  : endDate
                  }
                }
              }
          }
        },
        "sort": { "date": { "order": "desc" }}
      };
      
      getElasticsearch(data);

    } else if (startDate) {
    
        data = {
          "from" : 0, "size" : 60,
            "query" : {
              "filtered" : {
                "filter" : {
                  "range" : {
                    "date" : {
                        "gte" : startDate,
                        "lte"  : endDate
                    }
                  }
                }
            }
          },
          "sort": { "date": { "order": "desc" }}
        };

        getElasticsearch(data);

    } else {

      res.status(401).send('Must add program query string to request.');

    }

  }

};
