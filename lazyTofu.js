window.addEventListener("DOMContentLoaded", getImages);
window.addEventListener("load", throttle(lazyTofuLoad, 333));
window.addEventListener("scroll", throttle(lazyTofuLoad, 333));

var count = 0; 
function isElementInViewport (item) {
    count++; 
    console.log('this is count: ' + count); 
    return (
        item.getBoundingClientRect().top <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

var imageData = {};

function getImages() {
  var nodeList = document.querySelectorAll('img[data-src]') 
  for(var i = 0; i < nodeList.length; i++)
    imageData[i] = nodeList[i];
  window.removeEventListener("DOMContentLoaded", getImages);
  window.addEventListener("DOMContentLoaded", throttle(lazyTofuLoad, 250));
}

var propCount = 0; 
function lazyTofuLoad() {
  console.log('lazyTofuLoad called'); 
  for (key in imageData) {
      var item = imageData[key]; 
      propCount ++; 
    if (isElementInViewport(item)) {
      console.log('rect passed'); 
      item.setAttribute("src", item.getAttribute("data-src"));
      item.removeAttribute("data-src");
      item.className += ' lazy-tofu-loaded'
      item.className.replace('lazy-tofu-hidden','');
      delete imageData[key]
    }
  };

  console.log('object prop ' + propCount); 
  propCount = 0; 
  
  window.removeEventListener("load", lazyTofuLoad);
  if (imageData.length == 0) {
    window.removeEventListener("DOMContentLoaded", lazyTofuLoad);
    window.removeEventListener("scroll", lazyTofuLoad);
  }
}

function throttle (callback, limit) {
  var wait = false;                  
  return function () {               
    if (!wait) {                   
        callback.call();           
        wait = true;               
        setTimeout(function () {   
            wait = false;          
        }, limit);
    }
  }
}