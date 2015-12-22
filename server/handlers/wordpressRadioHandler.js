var requestUtil = require('../utils/requestUtil');

module.exports = {

  keywords: function(req, res) {

    var keywords = req.query.keywords,
        data = {};

    if (keywords) {

      data = {
        "from" : 0, "size" : 30,
        "query" : {
          "function_score": {
            "query" : {
              "multi_match" : {
                  "fields" : ["title^5", "author^2", "content", "tags^3", "excerpt^3"],
                  "query" : keywords,
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

     requestUtil.getElasticsearch(data, process.env.RADIO_ENDPOINT, res); 
    
    //if the proper query parameters aren't defined respond with an error
    } else {

      res.status(401).send('Must add keyword query string to request.');

    }
  
  },
  
  programs: function(req, res, next) {

    var keywords = req.query.keywords,
        programName = req.query.program,
        data = {};
        
        if (programName && keywords) {
          
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
                            "query" : keywords,
                            "slop":  10,
                            "type" : "phrase_prefix"
                        }

                      }
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

          requestUtil.getElasticsearch(data, process.env.RADIO_ENDPOINT, res);

        } else if (programName) {

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

          requestUtil.getElasticsearch(data, process.env.RADIO_ENDPOINT, res);

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
         "query": {
                     "bool": {
                       "must": [{ "match": { "programs": programName }},{ "range": { "date": { "gte": startDate, "lte": endDate }}}],
                     }
                   },
        "sort": { "date": { "order": "desc" }}
      };
      
      requestUtil.getElasticsearch(data, process.env.RADIO_ENDPOINT, res);

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

        requestUtil.getElasticsearch(data, process.env.RADIO_ENDPOINT, res);

    } else {

      res.status(401).send('Must add program query string to request.');

    }

  },

  perspectives: function(req, res) {

    var keywords = req.query.keywords,
    data = {};

    if(keywords) {
  
      data = {
        "from" : 0, "size" : 30,
        "query" : {
          "function_score": {
            "query" : {
              "bool": {
                "must":     { "match": { "categories": "Perspectives" }},
                "should": {
                  "multi_match" : {
                      "fields" : ["title", "author", "content^5", "excerpt^3"],
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
                    "scale": "2000d",
                    "decay" : 0.5 
              }
            },
            "score_mode": "multiply"
          }
        }
      };

      requestUtil.getElasticsearch(data, process.env.RADIO_ENDPOINT, res);

    } else {

      res.status(401).send('Must add program query string to request.');

    }

  }

};
