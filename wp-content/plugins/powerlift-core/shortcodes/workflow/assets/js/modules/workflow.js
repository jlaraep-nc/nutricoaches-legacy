(function($) {
	'use strict';
	
	var workflow = {};
	mkdf.modules.workflow = workflow;

    workflow.mkdfWorkflow = mkdfWorkflow;


    workflow.mkdfOnDocumentReady = mkdfOnDocumentReady;
	
	$(document).ready(mkdfOnDocumentReady);
    $(window).on('load', mkdfOnWindowLoad);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnDocumentReady() {
        mkdfWorkflow();
	}

    /**
     All functions to be called on $(window).on('load') should be in this function
     */
    function mkdfOnWindowLoad() {
        mkdfElementorWorkflow();
    }

    /**
     * Elementor
     */
    function mkdfElementorWorkflow(){
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_workflow.default', function() {
                mkdfWorkflow();
            } );
        });
    }

    function mkdfWorkflow() {
        var workflowShortcodes = $('.mkdf-workflow');
        if (workflowShortcodes.length) {
            workflowShortcodes.each(function () {
                var workflowShortcode = $(this);
                if (workflowShortcode.hasClass('mkdf-workflow-animate')) {
                    var workflowItems = workflowShortcode.find('.mkdf-workflow-item');

                    workflowShortcode.appear(function () {
                        workflowShortcode.addClass('mkdf-appeared');
                        setTimeout(function () {
                            workflowItems.each(function (i) {
                                var workflowItem = $(this);
                                setTimeout(function () {
                                    workflowItem.addClass('mkdf-appeared');
                                }, 350 * i);
                            });
                        }, 350);
                    }, {accX: 0, accY: mkdfGlobalVars.vars.mkdfElementAppearAmount});

                }
            });
        }
    }
	
})(jQuery);