var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    config = require('../utils/config');

module.exports = {
  chronological: function(req, res) {

      var data = {
        "from" : 0, "size" : 30,
        "query" : {
          "function_score": {
            "query" : {
              "bool": {
                "must_not": { "term": { "tags": "repost" }},
                "should": {
                  "multi_match" : {
                      "fields" : ["title^3", "content", "excerpt^2"],
                      "query" : "election",
                      "type" : "best_fields"
                  }
                }
              }
            }
          }
        },
       "sort": { "date": { "order": "desc" }}
      };

      requestUtil.getElasticsearch(data, '/wp/forum,news,arts/_search', res);

  }
};
