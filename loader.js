function importJS(src, callback)
{
  var s, r, t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  s.onload = s.onreadystatechange = function() {
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      callback();
    }
  };
  var head = document.getElementsByTagName('head')[0];
  if (head) {
    head.appendChild(s);
  } else {
    document.body.appendChild(s);
  }
}

function importCSS(href) {
  var s = document.createElement('link');
  s.setAttribute('rel', 'stylesheet');
  s.setAttribute('type', 'text/css');
  s.setAttribute('media', 'screen');
  s.setAttribute('href', href);
  var head = document.getElementsByTagName('head')[0];
  if (head) {
    head.appendChild(s);
  } else {
    document.body.appendChild(s);
  }
}

var load = function(){
  importCSS('http://localhost:8000/selectorgadget/selectorgadget.css');
  importCSS('http://localhost:8000/sgplus.css');
  importJS('http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js', function() {
    window.jQuerySG = jQuery.noConflict();
    importJS('https://dv0akt2986vzh.cloudfront.net/stable/vendor/diff/diff_match_patch.js', function() {
      importJS('http://localhost:8000/selectorgadget/dom.js', function() {
        importJS('http://localhost:8000/selectorgadget/core.js', function() {
          importJS('http://localhost:8000/sgplus.js', function() {
            window.jQuerySG('.selector_gadget_loading').remove();
            SelectorGadgetPlus.enable();
          }) 
        });
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', function() {
    load();
}, false);
