var SelectorGadgetPlus;

window.SelectorGadgetPlus = SelectorGadgetPlus = (function(window, $, SelectorGadget) {

    function SelectorGadgetPlus() {}

    SelectorGadgetPlus.enable = function() {
        var this_ = this;
        if(!window.selectorGadgetPlus) {
            this_.root = $(this_.templates.sidebar).appendTo('body');
            window.SelectorGadgetPlusController = this_.controller;
            window.selectorGadgetPlus = this_;
            angular.bootstrap(this_.root);
        }
    }

    SelectorGadgetPlus.disable = function() {
        self.destroySelectorGadget();
        if(!window.selectorGadgetPlus) {
            this.sidebarContainer.remove();
            window.selectorGadgetPlus = null;
        }
    }

    SelectorGadgetPlus.initSelectorGadget = function(pathOutputField) {
        this.selectorGadget = new SelectorGadget();
        this.selectorGadget.sg_div = $('#sg_div', this.root).get(0)
        this.selectorGadget.path_output_field = pathOutputField;
        this.selectorGadget.clearEverything();
        this.selectorGadget.setMode('interactive');
    }

    SelectorGadgetPlus.destroySelectorGadget = function() {
        if(this.selectorGadget) {
            this.selectorGadget.unbindAndRemoveInterface();
            this.selectorGadget = null;
        }
    }

    SelectorGadgetPlus.controller = function($scope) {
        var self = SelectorGadgetPlus;

        $scope.fields = [];

        $scope.fieldSeq = 1;

        $scope.addField = function() {
            this.fields.push({
                name: 'Field' + (this.fieldSeq++),
                css: '',
                leaf: 'html',
                results: [],
                resultsShown: false,
            });
        }

        $scope.togglePosition = function() {
            $('#selectorgadgetplus_sidebar').toggleClass('left');
        }

        $scope.remove = function() {
            this.$parent.fields.splice(this.$index, 1);
        }

        $scope.select = function(event, field) {
            var this_ = this;
            field.selecting = true;
            field.cssInput = $(event.target).closest('li').find('input[name="css"]')
            field.oldCss = field.cssInput.val();
            field.refreshInterval = setInterval(function() {
                this_.refreshResults(field);
                $scope.$digest();
            }, 50);
            self.initSelectorGadget(field.cssInput.get(0));
            return false;
        }

        $scope.selectOk = function(event, field) {
            field.selecting = false;
            field.resultsShown = false;
            this.refreshResults(field);
            clearInterval(field.refreshInterval);
            self.destroySelectorGadget();
        }

        $scope.selectCancel = function(field) {
            field.selecting = false;
            field.css = field.oldCss;
            field.cssInput.val(field.oldCss);
            clearInterval(field.refreshInterval);
            self.destroySelectorGadget();
        }

        $scope.refreshResults = function(field) {
            var field = this.field || field;
            field.results = [];
            var css = field.cssInput.val();
            var sgCss = '.selectorgadget_ignore';

            if(css != 'No valid path found.') {
                $(css).not(sgCss).each(function() {
                    if(field.leaf == 'html') {
                        field.results.push(this.outerHTML || '(empty)');
                    } else if (field.leaf == 'text') {
                        field.results.push($(this).html() || '(empty)');
                    } else if (field.leaf == 'attr') {
                        field.results.push((field.attr ? $(this).attr(field.attr) : null) || '(empty)');
                    }
                });
            }
        }

        $scope.import = function() {
            var imported = prompt('Paste your JSON');

        }

        $scope.export = function() {
            var json = {
                selectors: []
            };

            $.each($scope.fields, function(index, value) {
                json.selectors.push({
                    css: value.css,
                    leaf: value.leaf,
                    attr: value.attr
                })
            });

            prompt('Copy this JSON', json);
        }
    }
    
    return SelectorGadgetPlus;

})(window, jQuerySG, SelectorGadget);

