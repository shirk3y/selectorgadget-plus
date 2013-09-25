// Copyright (c) 2008, 2009 Andrew Cantino
// Copyright (c) 2008, 2009 Kyle Maxwell

function importJS(src, look_for, onload) {
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', src);
  if (onload) wait_for_script_load(look_for, onload);
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

(function(){
  importCSS('https://dv0akt2986vzh.cloudfront.net/stable/lib/selectorgadget.css');
  importCSS('http://localhost:8000/selectorgadget-plus.css');
  importJS('http://code.jquery.com/jquery-2.0.3.min.js', 'jQuery', function() { // Load everything else when it is done.
    jQuerySG = jQuery.noConflict();
    importJS('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js', '_', function() {
        importJS('https://dv0akt2986vzh.cloudfront.net/stable/vendor/diff/diff_match_patch.js', 'diff_match_patch', function() {
          importJS('http://localhost:8000/selectorgadget/dom.js', 'DomPredictionHelper', function() {
            importJS('http://localhost:8000/selectorgadget/core.js', 'SelectorGadget', function() {
                  importJS('http://localhost:8000/selectorgadget-plus.js', 'SelectorGadgetPlus', function() {
                      importJS('http://localhost:8000/templates.js', 'SelectorGadgetPlus.templates', function() {
                          SelectorGadgetPlus.toggle();
                      }) 
                  }) 
            });
          });
        });
    });
  });
})();
