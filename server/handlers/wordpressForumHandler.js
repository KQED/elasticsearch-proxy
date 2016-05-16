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
                        "fields" : ["title^3", "author^3", "content^2", "excerpt^3", "guests.name^2", "guests.bio^2", "tags^3"],
                        "query" : keywords,
                        "type" : "most_fields",
                        "boost": 2
                    }
                  },
                  {
                    "multi_match" : {
                        "fields" : ["title^3", "author^3", "content^2", "excerpt^3", "guests.name^2", "guests.bio^2", "tags^3"],
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
                    "decay" : 0.95 
              }
            },
            "score_mode": "multiply"
          }
        }
      };
      if(keywords.indexOf(' ') > -1 || keywords.indexOf('+') > -1) {
        data.query.function_score.query.bool.should.unshift(
            { "multi_match" : {
                  "fields" : ["title^4", "author^3", "content^2", "excerpt^4", "guests.name^2", "guests.bio", "tags^3"],
                  "query" : keywords,
                  "type" : "phrase",
                  "boost": 4
              }
            });  
      }
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
