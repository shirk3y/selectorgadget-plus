var SelectorGadgetPlus;

window.SelectorGadgetPlus = SelectorGadgetPlus = (function(window, $, SelectorGadget) {

    function SelectorGadgetPlus() {}

    SelectorGadgetPlus.toggle = function() {
        if(!window.selectorGadgetPlus) {
            this.sidebarRoot = $('<div>')
                .addClass(SelectorGadget.ignore_class)
                .appendTo('body')
                .html(this.templates.sidebar({}));
            this.bindTogglePosition();
            this.bindAddField();
            window.sg_options = {
                remote_interface: 'http://localhost:8000/interface.js'
            }
            //SelectorGadget.toggle();
            window.selectorGadgetPlus = this;
        } else {
            this.sidebarContainer.remove();
            //SelectorGadget.toggle();
            window.selectorGadgetPlus = undefined;
        }
    }
    
    SelectorGadgetPlus.bindTogglePosition = function() {
        $('#selectorgadgetplus_toggle_position').click(function() {
            $('#selectorgadgetplus_sidebar').toggleClass('left');
        })
    }

    SelectorGadgetPlus.bindAddField = function() {
        var self = this;
        $('#selectorgadgetplus_add_field').click(function() {
            self.addField();
        })
    }

    SelectorGadgetPlus.addField = function() {
        var field = this.templates.field({})
            .appendTo('#selectorgadgetplus_fields')
        $('input[name="select"]', field).click(function() {
            SelectorGadget.toggle(); 
            $(this).hide()
        });
    }

    return SelectorGadgetPlus;

})(window, jQuerySG, SelectorGadget);

