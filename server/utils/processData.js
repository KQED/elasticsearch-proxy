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

var audioImageProcessing = function(array) {
  
  array.forEach(function(audioUrl){
    if (typeof audioUrl === 'string' && audioUrl.indexOf('default.png') > -1) {
      return null;
    }     
  });
  
    return array;

};

module.exports = {

  processPost: function(wpItem) {
  
    return {
            "title": wpItem.title.rendered, "author": wpItem.author_full, "siteId": wpItem.site_id,
            "excerpt": wpItem.excerpt.rendered, "content": wpItem.content.rendered, "audio": wpItem.audio_info === null ? null : audioImageProcessing(wpItem.audio_info),
            "link": wpItem.link, "date": wpItem.date_gmt,  "id": wpItem.id, "tags": wpItem.tags,
            "image": wpItem.featured_image_obj, "categories": processDataArray(wpItem.catagories_full)
          };
  
  }

};
