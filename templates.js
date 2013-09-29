SelectorGadgetPlus.templates = {
    sidebar: '\
        <div id="sg_div"></div> \
        <div ng-controller="SelectorGadgetPlusController" id="selectorgadgetplus_sidebar" class="selectorgadget_ignore"> \
            <div id="selectorgadgetplus_header" class="selectorgadget_ignore"> \
                <div id="selectorgadgetplus_title"><span>SELECTOR</span><span>GADGET</span><span>plus</span></div> \
                <input ng-click="addField()" id="selectorgadgetplus_add_field" title="New field" type="button" value="+" class="selectorgadget_ignore"> \
                <input ng-click="togglePosition()" type="button" title="Toggle position" value="&laquo; &raquo;" class="selectorgadget_ignore"> \
                <input ng-click="import()" title="Import JSON" type="button" value="&lt;" class="selectorgadget_ignore"> \
                <input ng-click="export()" title="Export JSON" type="button" value="&gt;" class="selectorgadget_ignore"> \
            </div> \
            <ul class="selectorgadgetplus_fields selectorgadget_ignore"> \
                <li ng-repeat="field in fields" class="selectorgadget_ignore"> \
                    <input type="text" placeholder="Name" ng-model="field.name" class="selectorgadget_ignore"> \
                    <input type="button" title="Delete field" value="X" ng-click="remove()" class="selectorgadgetplus_delete selectorgadget_ignore"> \
                    <input type="text" placeholder="CSS" ng-model="field.css" ng-change="refreshResults()" name="css" class="selectorgadget_ignore"> \
                    <input type="button" title="Select" value="&lowast;" ng-click="select($event, field)" ng-hide="field.selecting" class="selectorgadgetplus_select selectorgadget_ignore"> \
                    <br> \
                    <div class="selectorgadgetplus_results_header selectorgadget_ignore"> \
                        <span class="selectorgadget_ignore"><strong>{{ field.results.length }}</strong> results</span> \
                        <a ng-show="field.resultsShown && field.results.length" ng-click="field.resultsShown=false" class="selectorgadget_ignore">hide</a> \
                        <a ng-show="!field.resultsShown && field.results.length" ng-click="field.resultsShown=true" class="selectorgadget_ignore">show</a> \
                    </div> \
                    <div ng-show="field.resultsShown && field.results.length" class="selectorgadgetplus_results selectorgadget_ignore"> \
                        <select class="selectorgadget_ignore" ng-model="field.leaf" ng-change="refreshResults()"> \
                            <option value="html" class="selectorgadget_ignore">html</option> \
                            <option value="text" class="selectorgadget_ignore">text</option> \
                            <option value="attr" class="selectorgadget_ignore">attr</option> \
                        </select> \
                        <input type="text" name="attr" ng-model="field.attr" ng-show="field.leaf == \'attr\'" ng-change="refreshResults()" class="selectorgadget_ignore"></input> \
                        <ul class="selectorgadget_ignore"> \
                            <li ng-repeat="result in field.results track by $index" class="selectorgadget_ignore">{{ result }}</li> \
                        </ul> \
                    </div> \
                    <br> \
                    <input type="button" value="Accept" ng-click="selectOk($event, field)" ng-show="field.selecting" class="selectorgadget_ignore"> \
                    <input type="button" value="Cancel" ng-click="selectCancel(field)" ng-show="field.selecting" class="selectorgadget_ignore"> \
                </li> \
            </ul> \
        </div> \
    '
}
