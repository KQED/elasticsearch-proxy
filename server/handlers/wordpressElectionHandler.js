var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    config = require('../utils/config'),
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

  },
  featuredPost: function(req, res) {
    rp('http://ww2.kqed.org/forum/wp-json/wp/v2/posts')
      .then(function(posts){
        posts = JSON.parse(posts);
        res.status(200).send(posts[0]);
      });
  },
  pbs: function(req, res) {
    rp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/pbs/qMdg&num=5')
      .then(function(posts){
        res.status(200).send(posts);
      });
  }
};
