var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    config = require('../utils/config');

module.exports = {
  keywords: function(req, res) {

    var keywords = req.query.keywords,
    data = {};

    if(keywords) {

      log.info("/radio/keywords/perspectives hit with query: " + keywords + " from ip: " + req.headers['x-forwarded-for']); 

      data = {
        "from" : 0, "size" : 30,
        "query" : {
          "function_score": {
            "query" : {
              "bool": {
                "must_not": { "term": { "tags": "repost" }},
                "should": {
                  "multi_match" : {
                      "fields" : ["title", "author^2", "content^3", "excerpt^2"],
                      "query" : keywords,
                      "type" : "best_fields",
                      "fuzziness": "AUTO",
                      "prefix_length": 3,
                      "max_expansions": 30
                  }
                }
              }
            },
            "gauss": {
              "date": {
                    "scale": "2800d",
                    "decay" : 0.5 
              }
            },
            "score_mode": "multiply"
          }
        }
      };

      requestUtil.getElasticsearch(data, config.siteEndpoints.perspectives + '_search', res);

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

      log.info("/radio/dates/perspectives from date range: " + startDate + " to " + endDate + " for program: " + programName + " from ip: " + req.headers['x-forwarded-for']); 

      data = {
        "from" : 0, "size" : 60,
         "query": {
                     "bool": {
                       "must": [{ "match": { "programs": programName }},{ "range": { "date": { "gte": startDate, "lte": endDate }}}],
                     }
                   },
        "sort": { "date": { "order": "desc" }}
      };
      
      requestUtil.getElasticsearch(data, config.siteEndpoints.perspectives  + '_search', res);

    } else if (startDate) {
    
        log.info("/radio/dates/perspectives from date range: " + startDate + " to " + endDate + " from ip: " + req.headers['x-forwarded-for']); 
       
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

        requestUtil.getElasticsearch(data, config.siteEndpoints.perspectives  + '_search', res);

    } else {

      res.status(401).send('Must add program query string to request.');

    }
  }
}
