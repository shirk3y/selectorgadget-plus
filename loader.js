// Copyright (c) 2008, 2009 Andrew Cantino
// Copyright (c) 2008, 2009 Kyle Maxwell

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

function importCSS(href, look_for, onload) {
  var s = document.createElement('link');
  s.setAttribute('rel', 'stylesheet');
  s.setAttribute('type', 'text/css');
  s.setAttribute('media', 'screen');
  s.setAttribute('href', href);
  if (onload) wait_for_script_load(look_for, onload);
  var head = document.getElementsByTagName('head')[0];
  if (head) {
    head.appendChild(s);
  } else {
    document.body.appendChild(s);
  }
}

function wait_for_script_load(look_for, callback) {
  var interval = setInterval(function() {
    if (eval("typeof " + look_for) != 'undefined') {
      clearInterval(interval);
      callback();
    }
  }, 50);
}

var load = function(){
  importCSS('http://localhost:8000/selectorgadget/selectorgadget.css');
  importCSS('http://localhost:8000/selectorgadget-plus.css');
  importJS('http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js', function() { // Load everything else when it is done.
    jQuerySG = jQuery.noConflict();
    var jQuery_ = window.jQuery;
    // remove jQuery from window to let angular use built-int jqLite
    delete window.jQuery;
    importJS('http://ajax.googleapis.com/ajax/libs/angularjs/1.2.0-rc.2/angular.min.js', function() {
        window.jQuery = jQuery_;
        importJS('https://dv0akt2986vzh.cloudfront.net/stable/vendor/diff/diff_match_patch.js', function() {
          importJS('http://localhost:8000/selectorgadget/dom.js', function() {
            importJS('http://localhost:8000/selectorgadget/core.js', function() {
                  importJS('http://localhost:8000/selectorgadget-plus.js', function() {
                      importJS('http://localhost:8000/templates.js', function() {
                          jQuerySG('.selector_gadget_loading').remove();
                          SelectorGadgetPlus.enable();
                      }) 
                  }) 
            });
          });
        });
    });
  });
};

if (typeof(jQuery) != 'undefined') {
    jQuery(load)
} else {
    load()
}
