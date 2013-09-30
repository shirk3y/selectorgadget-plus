var SelectorGadgetPlus;

window.SelectorGadgetPlus = SelectorGadgetPlus = (function(window, $, SelectorGadget) {

    function SelectorGadgetPlus() {}

    SelectorGadgetPlus.selectorGadget = null;

    SelectorGadgetPlus.customCss = null;

    SelectorGadgetPlus.updateCssFieldInterval = null;

    SelectorGadgetPlus.offsetBeforeHighlight = 0;

    SelectorGadgetPlus.enable = function(iframeUrl) {
        var self = this;
        if(!window.selectorGadgetPlus) {
            this.iframe = $('<iframe>')
                .attr('id', 'selectorgadgetplus')
                .attr('class', 'selectorgadget_ignore')
                .attr('src', iframeUrl)
                .appendTo('body');
            this.highlightFrame = $('<div>')
                .attr('class', 'selectorgadgetplus_highlight')
                .hide()
                .appendTo('body');
            this.overlay = $('<div>')
                .attr('class', 'selectorgadgetplus_overlay')
                .appendTo('body');
            this.leaf = 'html';
            this.attr = '';
            this.boundIframeListener = function(e) {
                self.iframeListener.call(self, e);
            } 
            window.addEventListener('message', this.boundIframeListener, false)
            window.selectorGadgetPlus = this;
        }
    }

    SelectorGadgetPlus.disable = function() {
        this.disableSelectorGadget();
        if(window.selectorGadgetPlus) {
            window.removeEventListener('message', this.boundIframeListener, false); 
            this.iframe.remove();
            this.highlightFrame.remove();
            this.overlay.remove();
            window.selectorGadgetPlus = null;
        }
    }

    SelectorGadgetPlus.iframeListener = function(e) {
        var methodParts = e.data[0].split('sgplus_');
        if(methodParts[0] == '') {
            e.data.splice(0, 1);
            this[methodParts[1]].apply(this, e.data);
        }
    }

    SelectorGadgetPlus.enableSelectorGadget = function() {
        var self = this;
        this.disableSelectorGadget();
        if(!this.selectorGadget) {
            this.overlay.show().animate({'opacity': 0}, 1000, function() {
                $(this).hide();
            });
            SelectorGadget.toggle();
            this.selectorGadget = window.selector_gadget;
            this.selectorGadget.sg_div.attr('style', 'display: none !important');
            $('.selectorgadget_iframe_info').hide();
            this.enableUpdatingCssField();
        }
    }

    SelectorGadgetPlus.disableSelectorGadget = function() {
        // remove custom selection
        this.disableUpdatingCssField();
        this.customCss = null;
        $('.selectorgadgetplus_selected')
            .removeClass('selectorgadgetplus_selected');
        if(this.selectorGadget) {
            SelectorGadget.toggle();
            this.selectorGadget = null;
        }
    }

    SelectorGadgetPlus.enableUpdatingCssField = function() {
        var self = this;
        this.disableUpdatingCssField();
        this.updateCssFieldInterval = setInterval(function() {
            self.updateCssAndResults()
        }, 200);
    }

    SelectorGadgetPlus.disableUpdatingCssField = function() {
        if(this.updateCssFieldInterval !== null) {
            clearInterval(this.updateCssFieldInterval);
            this.updateCssFieldInterval = null;
        }
    }

    SelectorGadgetPlus.updateCssAndResults = function() {
        var self = this;
        if((this.selectorGadget === null) && (this.customCss === null)) {
            return;
        }
        var css = this.customCss || $(this.selectorGadget.path_output_field).val();
        var ignored = '.selectorgadget_ignore';
        var results = [];
        var xpaths = [];
        if(css != 'No valid path found.') {
            $(css).not(ignored).each(function() {
                if(self.customCss) {
                    $(this).addClass('selectorgadgetplus_selected');
                }
                var cleaned = self.cleanElement(this);
                switch(self.leaf) {
                    case 'html':
                        results.push(cleaned.get(0).outerHTML || '(empty)');
                        break;
                    case 'text':
                        results.push(cleaned.text() || '(empty)');
                        break;
                    case 'attr':
                        results.push((self.attr
                                      ? cleaned.attr(self.attr)
                                      : null)
                                      || '(empty)');
                }
                // we are using xpaths here, because we can not pass elements
                // to highlight into the iframe
                xpaths.push(self.getXPath(this));
            });
        }
        self.iframe.get(0).contentWindow.postMessage([
            'sgplus_updateCssAndResults', css, results, xpaths
        ], '*');
    }

    SelectorGadgetPlus.cleanElement = function(element) {
        var clone = $(element).clone();
        var elementsToClean = clone.add(clone.find('*'));
        elementsToClean.each(function() {
            $(this).removeClass('selectorgadget_rejected ' +
                'selectorgadget_suggested selectorgadget_selected ' +
                'selectorgadgetplus_highlight selectorgadgetplus_selected');
        });
        return clone;
    }

    SelectorGadgetPlus.selectCustom = function(css) {
        var self = this;
        this.disableSelectorGadget();
        this.customCss = css;
        this.enableUpdatingCssField();
    }

    SelectorGadgetPlus.getXPath = function(element) {
        var xpath = '';
        for (; element && element.nodeType == 1; element = element.parentNode)
        {
            var id = $(element.parentNode)
                .children(element.tagName).index(element) + 1;
            id = '[' + id + ']';
            xpath = '/' + element.tagName.toLowerCase() + id + xpath;
        }
        return xpath;
    }

    SelectorGadgetPlus.highlight = function(xpath) {
        // it won't work in IE, but jQuery not seems to support indexed xpaths
        element = $(document.evaluate(xpath, document, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue);
        offset = element.offset();
        this.highlightFrame
            .show()
            .css({
                left: offset.left - 2,
                top: offset.top - 2,
                width: element.width(),
                height: element.height()
            });
        this.offsetBeforeHighlight = $('body').scrollTop();
        $('body').scrollTop(offset.top - 100);
    }

    SelectorGadgetPlus.unhighlight = function() {
        this.highlightFrame.hide();
        $('body').scrollTop(this.offsetBeforeHighlight);
    }

    SelectorGadgetPlus.togglePosition = function() {
        this.iframe.toggleClass('left');
    }

    SelectorGadgetPlus.updateLeafAndAttr = function(leaf, attr) {
        this.leaf = leaf;
        this.attr = attr;
    }

    return SelectorGadgetPlus;

})(window, jQuerySG, SelectorGadget);
