'use strict';

angular.module('discover').filter('displayType', function(){
  return function(typeStr){
    if (typeStr === "podcast-audio" || typeStr === "podcast-video" || typeStr === "resource")
      return "podcast";
    else if (typeStr === "entry")
      return "episode";
    else
      return typeStr;
  };
});
