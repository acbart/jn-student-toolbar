define([
    'base/js/namespace',
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
        Jupyter.toolbar.add_buttons_group([{
            'action': 'jupyter-notebook:run-all-cells',
            'label': 'Run all',
            'icon': 'fa-step-forward'
        }], 'run-all-cells')
        Jupyter.toolbar.add_buttons_group([{
            'callback': downloadIPYNB,
            'label': 'Download IPYNB file',
            'icon': 'fa-download'
        }], 'download-ipynb');
        
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
        $("#maintoolbar-container #save-notbook").toggle(state);
        $("#maintoolbar-container #download-ipynb").toggle(!state);
        $("#maintoolbar-container #run-all-cells").toggle(!state);
        $(".btn.validate").parent().toggle(state);
        $("[data-jupyter-action='jupyter-notebook:show-command-palette']").parent().toggle(state)
        $("#edit_menu").parent().toggle(state);
        $("#insert_menu").parent().toggle(state);
        $("#change_cell_type").toggle(state);
        $("#maintoolbar-container #toggle-student-mode").toggle(state);
    }
    
    function makeFinalCellSpecial(state) {
        var cells = Jupyter.notebook.get_cells();
        if (cells.length) {
            var lastCell = cells[cells.length-1];
            lastCell.metadata.editable = state;
            lastCell.input.toggle(state);
        }
        cells.forEach(function (cell) {
            cell.metadata.deletable = state;
        });
    }
    
    /**
     * Trigger the IPYNB file to be downloaded.
     * Note: You might think you could just call $('#download_ipynb').click()
     *       But if you do that, it is no longer a "user click" and some
     *       browsers will get offended and block the popup.
     * 
     * Stolen from: https://github.com/jupyter/notebook/blob/master/notebook/static/notebook/js/menubar.js#L177
     */
    function downloadIPYNB() {
        var that = Jupyter.menubar;
        var base_url = that.notebook.base_url;
        var notebook_path = Jupyter.utils.encode_uri_components(that.notebook.notebook_path);
        var url = Jupyter.utils.url_path_join(
            base_url, 'files', notebook_path
        ) + '?download=1';
        if (that.notebook.dirty && that.notebook.writable) {
            that.notebook.save_notebook().then(function() {
                that._new_window(url);
            });
        } else {
            that._new_window(url);
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