/**
TODO:    
    We'll need to make sure that MatPlotLib is correctly captured
**/

define([
    'base/js/namespace', 'require',
], function(
    Jupyter, requirejs,
) {
    var prefix = 'jn-student-toolbar';
    var toggleActionName = 'toggle-student-mode';
    var runActionName = 'run-all-cells-smartly';
    var keyboardSequence = 'Ctrl-Alt-U';
    function load_ipython_extension() {
        $('<link/>')
			.attr({
				id: 'collapsible_headings_css',
				rel: 'stylesheet',
				type: 'text/css',
				href: requirejs.toUrl('./main.css')
			})
			.appendTo('head');
        
        var action = {
            icon: 'fa-lock',
            help    : 'Switch in/out of student mode',
            help_index : 'zz',
            handler : toggleStudentMode
        };
        
        Jupyter.actions.register(action, toggleActionName, prefix);
        Jupyter.actions.register(action, runActionName, prefix);
        Jupyter.toolbar.add_buttons_group([prefix+':'+toggleActionName], toggleActionName);
        Jupyter.toolbar.add_buttons_group([{
            'action': 'jn-student-toolbar:'+runActionName,
            'callback': runAllCellsSmartly,
            'label': 'Run all',
            'icon': 'fa-step-forward'
        }], runActionName)
        Jupyter.toolbar.add_buttons_group([{
            'callback': downloadIPYNB,
            'label': 'Download Notebook',
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
        var cells = Jupyter.notebook.get_cells();
        cells.forEach(function (cell) { 
            $(cell.element).toggleClass('student-mode-hide-errors', !studentMode) 
        });
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
    
    function runAllCellsSmartly() {
        /**
        Make it so that running will attempt to run all cells but the last one, failing along the way gracefully
            And then ALWAYS run the last cell no matter what
        https://github.com/jupyter/notebook/blob/master/notebook/static/notebook/js/codecell.js#L327
    
        Make it so that the errors are hidden in other cells
            Add/remove class based on StudentMode at the top of cell outputs
            CSS rule that hides error output if that class is present
        **/
        console.log("FIRING PLEASE STOP ME")
        var notebook = Jupyter.notebook;
        notebook.command_mode();
        var cell;
        for (var i = 0; i < notebook.ncells(); i++) {
            cell = notebook.get_cell(i);
            cell.execute(false);
        }
        notebook.set_dirty(true);
        notebook.scroll_to_bottom()
    }
    
    function registerKeyBindings() {
        //Jupyter.keyboard_manager.command_shortcuts.remove_shortcut(keyboardSequence);
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut(keyboardSequence, prefix+':'+toggleActionName);
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});