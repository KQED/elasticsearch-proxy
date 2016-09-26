var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    config = require('../utils/config'),
    rp = require('request-promise');

module.exports = {
  chronological: function(req, res) {
    var data = {};

    if(!req.query.id && !req.query.keywords && !req.query.topics) {
      // var start = 0;
      // if(req.query.page) {
      //   start = (req.query.page - 1)*30;
      // }
      data = {
       "from" : 0, "size" : 50,
       "query": {
        "match_all": {}
       },
       "sort": { "date": { "order": "desc" }}
      };
    } else if(req.query.keywords) {
      data = {
        "from" : 0, "size" : 30,
        "query" : {
          "function_score": {
            "query" : {
              "bool": {
                "must_not": { "term": { "tags": "repost" }},
                "should": {
                  "multi_match" : {
                      "fields" : ["title^3", "content", "excerpt^2", "tags^3"],
                      "query" : req.query.keywords.toLowerCase(),
                      "type" : "best_fields"
                  }
                }
              }
            }
          }
        },
       "sort": { "date": { "order": "desc" }}
      };
    } else if(req.query.topics) {

      data = {
        "from" : 0, "size" : 30,
        "query" : {
          "bool" : {
            "must" : {
              "term" : { "tags" : req.query.topics }
            }
          }
        },
        "sort": { "date": { "order": "desc" }}
      };
    } else if (req.query.id) {
      data = {
      "query" :{
        "bool": {
          "must": {"term": {"id": req.query.id}}
        }
      }        
    };      
  }

      requestUtil.getElasticsearch(data, '/wp/elections/_search', res);

  },
  featuredPost: function(req, res) {
    //will change this when tags analyzed properly and add chronological sorting
    var data = {
        "query" : {
          "bool" : {
            "must": [
              { "match": { "tags": "election-2016-featured" }}
            ]
          }
        },
        "sort": { "date": { "order": "desc" }}
      };

    requestUtil.getElasticsearch(data, '/wp/elections/_search', res);
  }
};
