var log = require('../logging/bunyan');

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

module.exports = {

  //process data differently depending on wordpress source
  processPost: function(wpItem) {

  log.info(wpItem);
  
  if(process.env.SOURCE ==='PERSPECTIVES') {
    return {
            "title": wpItem.title.rendered, "author": wpItem.author_full, "siteId": wpItem.site_id,
            "excerpt": wpItem.excerpt.rendered, "content": wpItem.content.rendered, "audio": wpItem.audio_info.audioSrc,
            "link": wpItem.link, "date": wpItem.date_gmt,  "id": wpItem.id, "tags": wpItem.tags,
            "image": wpItem.featured_image_obj, "categories": processDataArray(wpItem.catagories_full)
          };
    }
  
  }

};
