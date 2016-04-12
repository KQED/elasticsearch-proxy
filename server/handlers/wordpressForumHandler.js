var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    config = require('../utils/config');

module.exports = {
  keywords: function(req, res) {

    var keywords = req.query.keywords,
    data = {};

    if(keywords) {

      log.info("/radio/keywords/forum hit with query: " + keywords + " from ip: " + req.headers['x-forwarded-for']); 

      data = {
        "from" : 0, "size" : 30,
        "query" : {
          "function_score": {
            "query" : {
              "bool": {
                "must_not": { "term": { "tags": "repost" }},
                "should": [
                  {
                    "multi_match" : {
                        "fields" : ["title^3", "author^3", "content^2", "excerpt^3", "guests.name^2", "guests.bio^2"],
                        "query" : keywords,
                        "type" : "most_fields",
                        "boost": 5
                    }
                  },
                  {
                    "multi_match" : {
                        "fields" : ["title^3", "author^3", "content^2", "excerpt^3", "guests.name^2", "guests.bio^2"],
                        "query" : keywords,
                        "type" : "most_fields",
                        "fuzziness": "AUTO",
                        "prefix_length": 3,
                        "max_expansions": 30
                    }
                  }
                ]
              }
            },
            "gauss": {
              "date": {
                    "scale": "365d",
                    "decay" : 0.75 
              }
            },
            "score_mode": "multiply"
          }
        }
      };

      requestUtil.getElasticsearch(data, config.siteEndpoints.forum + '_search', res);

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

      log.info("/radio/dates/forum from date range: " + startDate + " to " + endDate + " for program: " + programName + " from ip: " + req.headers['x-forwarded-for']); 

      data = {
        "from" : 0, "size" : 60,
         "query": {
                     "bool": {
                       "must": [{ "match": { "programs": programName }},{ "range": { "date": { "gte": startDate, "lte": endDate }}}],
                     }
                   },
        "sort": { "date": { "order": "desc" }}
      };
      
      requestUtil.getElasticsearch(data, config.siteEndpoints.forum  + '_search', res);

    } else if (startDate) {
    
        log.info("/radio/dates/forum from date range: " + startDate + " to " + endDate + " from ip: " + req.headers['x-forwarded-for']); 
       
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

        requestUtil.getElasticsearch(data, config.siteEndpoints.forum  + '_search', res);

    } else {

      res.status(401).send('Must add program query string to request.');

    }
  }
};
