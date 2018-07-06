define([
    'base/js/namespace'
], function(
    Jupyter
) {
    var prefix = 'jn-student-toolbar';
    var actionName = 'toggle-student-mode';
    var fullActionName = prefix+':'+actionName;
    var keyboardSequence = 'Ctrl-Alt-U';
    function load_ipython_extension() {
        var action = {
            icon: 'fa-lock',
            help    : 'Switch in/out of student mode',
            help_index : 'zz',
            handler : toggleStudentMode
        };
        
        Jupyter.actions.register(action, actionName, prefix);
        Jupyter.toolbar.add_buttons_group([fullActionName], 'toggle-student-mode');
        
        registerKeyBindings();
        displayStudentMode();
    }
    
    function toggleStudentMode() {
        var studentMode = Jupyter.notebook.metadata.student_mode || false;
        Jupyter.notebook.metadata.student_mode = !studentMode;
        Jupyter.actions.call("jupyter-notebook:save-notebook")
        displayStudentMode();
    }
    
    function displayStudentMode() {
        var studentMode = Jupyter.notebook.metadata.student_mode || false;
        setToolbarVisibility(!studentMode);
        Jupyter.actions.call("jupyter-notebook:show-all-line-numbers");
        makeFinalCellSpecial(!studentMode);
    }
    
    function setToolbarVisibility(state) {
        $("#maintoolbar-container #insert_above_below").toggle(state);
        $("#maintoolbar-container #move_up_down").toggle(state);
        $("#maintoolbar-container #cut_copy_paste").toggle(state);
        $("#maintoolbar-container #cell_type").toggle(state);
        $("#maintoolbar-container #run_int").toggle(state);
        $("#edit_menu").parent().toggle(state);
        $("#insert_menu").parent().toggle(state);
        $("#change_cell_type").toggle(state);
        $("#maintoolbar-container #toggle-student-mode").toggle(state);
    }
    
    function makeFinalCellSpecial(state) {
        var cells = Jupyter.notebook.get_cells();
        if (cells.length) {
            var lastCell = cells[cells.length-1];
            lastCell.metadata.set_deletable = state;
            lastCell.metadata.set_editable = state;
            lastCell.input.toggle(state);
        }
    }
    
    function registerKeyBindings() {
        //Jupyter.keyboard_manager.command_shortcuts.remove_shortcut(keyboardSequence);
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut(keyboardSequence, fullActionName);
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});