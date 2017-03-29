var requestUtil = require('../utils/requestUtil'),
    log = require('../logging/bunyan'),
    config = require('../utils/config');

module.exports = {
    /**
     * Function to return the data from elastic search based on the keyword and tag for the tcr archieve page
     * @param req request from the REST API
     * @param res RESPONSE TO THE REST API
     */
    keywords: function (req, res) {

        var keywords = req.query.keywords,
        data = {};


        if (keywords) {

            log.info("/tcr/keywords hit with query: " + keywords + " from ip: " + req.headers['x-forwarded-for']);

            data = {
                "query" : {
                    "multi_match" :{
                        "query" : keywords,
                        "fields" : [
                            "title^5",
                            "author^2",
                            "content",
                            "tags^3",
                            "excerpt^3"
                        ]
                    }
                },
                "filter" : {
                    "term" : {"tags":"tcrarchive"}
                }
            } ;
            console.log("end point are", process.env.NEWS_ENDPOINT);

            requestUtil.getElasticsearch(data, process.env.NEWS_ENDPOINT, res);

            //if the proper query parameters aren't defined respond with an error
        } else {

            res.status(401).send('Must add keyword query string to request.');

        }

    }
}

    ,
    "filter": {
    "terms": {
        "tags": [
            "news"
        ]
    }
}