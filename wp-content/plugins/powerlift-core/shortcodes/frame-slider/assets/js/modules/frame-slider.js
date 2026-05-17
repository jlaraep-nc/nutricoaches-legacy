(function ($) {
	'use strict';
	
	var frameSlider = {};
	mkdf.modules.frameSlider = frameSlider;


	frameSlider.mkdfOnWindowLoad = mkdfOnWindowLoad;
	
	$(window).on('load', mkdfOnWindowLoad);
	
	/**
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnWindowLoad() {
		mkdfElementorFrameSlider();
	}


    /**
     * Elementor
     */
    function mkdfElementorFrameSlider(){
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_frame_slider.default', function() {
                mkdf.modules.common.mkdfOwlSlider();
            } );
        });
    }
	
})(jQuery);