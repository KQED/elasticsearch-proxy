var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    config = require('../utils/config')
    rp = require('request-promise');

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
                      "query" : "elections",
                      "type" : "best_fields"
                  }
                }
              }
            }
          }
        }
      };

      requestUtil.getElasticsearch(data, '/wp/forum,news,arts/_search', res);

  },
  featuredPost: function(req, res) {
    rp('http://ww2.kqed.org/forum/wp-json/wp/v2/posts')
      .then(function(posts){
        posts = JSON.parse(posts);
        res.status(200).send(posts[0]);
      });
  }
};
