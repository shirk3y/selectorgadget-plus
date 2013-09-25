SelectorGadgetPlus.templates = {
    sidebar: _.template('\
        <div id="selectorgadgetplus_sidebar" class="selectorgadget_ignore"> \
            <div id="selectorgadgetplus_header"> \
                <input id="selectorgadgetplus_toggle_position" type="button" value="Toggle position"> \
                <input id="selectorgadgetplus_add_field" type="button" value="Add field"> \
            </div> \
            <div id="selectorgadgetplus_fields"> \
            </div> \
        </div> \
    '),

    field: _.template('\
        <div class="selectorgadgetplus_field"> \
            <input name="name" type="text" placeholder="Name"> \
            <input name="css" type="text" placeholder="Name"> \
        </div> \
    ')
}
