var config = require('./config'),
    bcrypt = require('bcryptjs'),
    validate = require("validate.js"),
    log = require('../logging/bunyan');

module.exports = {


    /**
     * This was fixed based don DIG-208, bcrypt is checked between two php and node and authorized Request is allowed
     * earlier the authorization was based on the ip address but as we moved to the pantheon which don't have the static ip address
     * we need to change this
     * TODO This is not overall a best solution but good for go, need to implement some better
     * @param req request params
     * @param res response to give
     * @param next
     */
    hashFilter: function(req, res, next) {

        var hash = req.headers['token'];
        if(validate.isDefined(hash)) {
            var bcryptAttempt = bcrypt.compareSync(config.hashKey, hash)
            if (bcryptAttempt) {//if true then allow the request
                next();
            } else {//if false then send unauthorized user
                res.status(401).send('Unauthorized');
            }
        }else{
            res.status(401).send('Please provide the authorized token');
        }

    },

    postFilter: function(req, res, next) {
        var link = req.body.link;
        var shouldBeIndexed = false;

        for(var key in config.siteIds) {
            if(config.siteIds[key] == req.body.site_id) {
                shouldBeIndexed = true;
            }
        }

        //Prevent posts from dev and sites not indexed to be added to elasticsearch
        if( (link.match('ww2.kqed.org') !== null || link.match('test-ww2.kqed.org') !== null) && shouldBeIndexed) {
            log.info('Entry is proper type, will be indexed');

            next();

        } else {

            log.info('Entry is from dev site or post should not be indexed');

            res.status(200).send('Cannot add entry, invalid type');

        }
    },

    electionsFilter: function(req, res, next) {
        req.elections = true;
        next();
    },

    newsFilter: function(req, res, next) {
        req.news = true;
        next();
    },

    forumFilter: function(req, res, next) {
        req.forum = true;
        next();
    },

    perspectivesFilter: function(req, res, next) {
        req.perspectives = true;
        next();
    }

};
