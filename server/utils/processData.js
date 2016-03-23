var log = require('../logging/bunyan'),
    config = require('./config'),
    extend = require('extend');

//creates array for elasticsearch fields such as tags, categories, etc.
var processDataArray = function(array) {
  
  if(array && array.length > 0){
    var filterNames = array.map(function(arrayItem){
      return arrayItem.name;
    });
    return filterNames;
  } else {
    return [];
  }

};

var audioImageProcessing = function(audio) {
  
  if(Array.isArray(audio)) {
    return audio[0];
  } else {
    return null;
  }

};

var guestAuthorProcessing = function(guestObject) {
  var guestFieldObject = [];
  
  if(!guestObject.guest_fields) {
    return null;
  }
  
  for(var i= 0; i < parseInt(guestObject.guest_fields); i++){
    guestFieldObject.push({});
  }
  for(var key in guestObject) {

    if(key.slice(0,13) === 'guest_fields_') {
      if(key.indexOf('bio') !== -1) {
        var indexBio = key.slice(13,14);
        guestFieldObject[indexBio].bio = guestObject[key][0];
      } else if(key.substr(key.length -5) === 'guest') {
        var indexName = key.slice(13,14);
        guestFieldObject[indexName].name = guestObject[key][0];
      }
    }
  }
  return guestFieldObject;
};

module.exports = {

  //process data differently depending on wordpress source
  processPost: function(wpItem) {
    
    var baseObject = {
      "title": wpItem.title.rendered, "siteId": wpItem.site_id,
      "excerpt": wpItem.excerpt.rendered, "content": wpItem.content.rendered,
      "link": wpItem.link, "date": wpItem.date_gmt,  "id": wpItem.id
    };
   
  if(wpItem.site_id == config.siteIds.perspectives) {
      
      return extend(baseObject, {"author": wpItem.author_full, "audio": wpItem.audio_info.audioSrc,
               "audioImage": audioImageProcessing(wpItem.audio_info.audioMeta), "tags": processDataArray(wpItem.tags),
               "image": wpItem.featured_image_obj, "categories": processDataArray(wpItem.catagories_full)});

    } else if(wpItem.site_id == config.siteIds.forum) {
      return extend(baseObject, {"author": wpItem.author_full, "audio": wpItem.audio_info.audioSrc,
               "audioImage": audioImageProcessing(wpItem.audio_info.audioMeta), "tags": processDataArray(wpItem.tags),
               "image": wpItem.featured_image_obj, "categories": processDataArray(wpItem.catagories_full),
               "guests": guestAuthorProcessing(wpItem.guest_authors)});
    }
  
  },

  processEndpoint: function(wpItem) {
    if(wpItem.site_id == config.siteIds.perspectives) {
      return config.siteEndpoints.perspectives;
    } else if (wpItem.site_id == config.siteIds.forum) {
      return config.siteEndpoints.forum;
    }
  }

};
