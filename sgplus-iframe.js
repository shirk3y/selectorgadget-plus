
var SelectorGadgetPlusController = function($scope) {

    $scope.fields = [];

    $scope.fieldSeq = 1;

    $scope.selectingFieldIndex = null;

    $scope.addField = function(values) {
        values = values || {};
        this.fields.push({
            name: values.name || 'Field' + this.fieldSeq++,
            css: values.css || '',
            oldCss: values.oldCss || '',
            leaf: values.leaf || 'html',
            results: values.results || [],
            resultsShown: false,
            xpaths: []
        });
    }

    $scope.removeField = function(field) {
        $scope._selectDone(field);
        this.$parent.fields.splice(this.$index, 1);
    }

    $scope.select = function(field) {
        if($scope.selectingFieldIndex !== null) {
            $scope.selectCancel($scope.fields[$scope.selectingFieldIndex]);
        }
        $scope.selectingFieldIndex = this.$index;
        field.selecting = true;
        field.selectingCustom = false;
        field.oldCss = field.css;
        field.oldResults = field.results;
        this.enableSelectorGadget();
    }

    $scope.selectOk = function(field) {
        field.resultsShown = false;
        this._selectDone(field);
    }

    $scope.selectCancel = function(field) {
        field.css = field.oldCss;
        field.results = field.oldResults; 
        this._selectDone(field);
    }

    $scope._selectDone = function(field) {
        $scope.selectingFieldIndex = null;
        field.selecting = false;
        field.selectingCustom = false;
        this.disableSelectorGadget();
    }

    $scope.import = function() {
        var imported = JSON.parse(prompt('Paste your JSON').replace(/\n/g, ''));

        $scope.fields = [];

        angular.forEach(imported.selectors, function(values, name) {
            $scope.addField({
                name: name,
                css: values.css,
                leaf: values.leaf,
                attr: values.attr
            });
        })
    }

    $scope.export = function() {
        var json = {
            selectors: {}
        };

        angular.forEach($scope.fields, function(value) {
            json.selectors[value.name] = {
                css: value.css,
                leaf: value.leaf,
                attr: value.attr
            }
        });

        prompt('Copy this JSON', JSON.stringify(json, undefined, 2));
    }

    // wrappers for communicating with parent window

    $scope.togglePosition = function() {
        parent.postMessage(['sgplus_togglePosition'], '*');
    }

    $scope.disable = function() {
        parent.postMessage(['sgplus_disable'], '*');
    }

    $scope.enableSelectorGadget = function() {
        parent.postMessage(['sgplus_enableSelectorGadget'], '*');
    }

    $scope.disableSelectorGadget = function() {
        parent.postMessage(['sgplus_disableSelectorGadget'], '*');
    }

    $scope.updateLeafAndAttr = function(field) {
        parent.postMessage(['sgplus_updateLeafAndAttr', field.leaf, field.attr], '*');
    }

    $scope.selectCustom = function(field) {
        $scope.selectingFieldIndex = this.$index;
        field.selectingCustom = true;
        parent.postMessage(['sgplus_selectCustom', field.css], '*');
    }

    $scope.highlightResult = function(field, index) {
        parent.postMessage(['sgplus_highlight', field.xpaths[index]], '*');
    }

    $scope.unhighlightResult = function() {
        parent.postMessage(['sgplus_unhighlight'], '*');
    }

    // listen for events from parent window

    window.addEventListener('message', function(e) {
        if((e.data[0] == 'sgplus_updateCssAndResults')
                && ($scope.selectingFieldIndex !== null)) {
            var field = $scope.fields[$scope.selectingFieldIndex];
            // prevent to modify field when typing
            if(!field.selectingCustom) {
                field.css = e.data[1];
            }
            field.results = e.data[2];
            field.xpaths = e.data[3];
            $scope.$digest();
        }
    });
}

