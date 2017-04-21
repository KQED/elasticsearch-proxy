var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    config = require('../utils/config');

module.exports = {
    /**
     * Function to return the data from elastic search based on the keyword and tag for tcr archive page
     * @param req request from the REST API
     * @param res RESPONSE TO THE REST API
     */
    keywords: function (req, res) {

        var keywords = req.query.keywords,
        data = {};


        if (keywords) {

            log.info("/radio/dates/news hit with query: " + keywords + " from ip: " + req.headers['x-forwarded-for']);

            data = {
                "query": {
                    "bool": {
                        "must": {
                            "multi_match": {
                                "fields": [
                                    "title^5",
                                    "author^2",
                                    "content",
                                    "tags^3",
                                    "excerpt^3"
                                ],
                                "query": keywords,
                                "slop": 10,
                                "type": "phrase_prefix"
                            }
                        },
                        "should" : [
                            { "term" : { "tag" : "tcrarchive" } },
                            { "term" : { "tag" : "tcrsegment" } }
                        ]
                    }
                }
            };

            requestUtil.getElasticsearch(data, config.siteEndpoints.news + '_search', res);

            //if the proper query parameters aren't defined respond with an error
        } else {

            res.status(401).send('Must add keyword query string to request.');

        }

    },
    dates: function(req, res) {
        var startDate = req.query.startDate,
            endDate  = req.query.endDate || startDate,
            programName = req.query.program,
            data = {};
        if (programName && startDate) {

          log.info("/radio/dates/news from date range: " + startDate + " to " + endDate + " for program: " + programName + " from ip: " + req.headers['x-forwarded-for']); 

          data = {
            "from" : 0, "size" : 60,
             "query": {
                         "bool": {
                           "must": [{ "match": { "programs": programName }},{ "range": { "airdate": { "gte": startDate, "lte": endDate }}}],
                         }
                       },
            "sort": { "airdate": { "order": "desc" }}
          };
          
          requestUtil.getElasticsearch(data, config.siteEndpoints.news  + '_search', res);

        } else if (startDate) {
        
            log.info("/radio/dates/news from date range: " + startDate + " to " + endDate + " from ip: " + req.headers['x-forwarded-for']); 
            data = {
              "from" : 0, "size" : 60,
                "query" : {

                  "bool" : {
                    "should" : [
                        { "term" : { "tag" : "tcrarchive" } },
                        { "term" : { "tag" : "tcrsegment" } }
                    ]
                  },

                  "filtered" : {

                    "filter" : {
                      "range" : {
                        "airdate" : {
                            "gte" : startDate,
                            "lte"  : endDate
                        }
                      }
                    }

                }

              },
              "sort": { "airdate": { "order": "desc" }}
            };

            requestUtil.getElasticsearch(data, config.siteEndpoints.news  + '_search', res);

        } else {

          res.status(401).send('Must add program query string to request.');

        }
    }
}