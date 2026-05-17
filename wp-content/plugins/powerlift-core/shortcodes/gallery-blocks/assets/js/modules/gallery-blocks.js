(function ($) {
	'use strict';
	
	var galleryBlocks = {};
	mkdf.modules.galleryBlocks = galleryBlocks;


    galleryBlocks.mkdfOnWindowLoad = mkdfOnWindowLoad;
	
	$(window).on('load', mkdfOnWindowLoad);
	
	/**
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnWindowLoad() {
        mkdfElementorGlleryBlocks();
	}


    /**
     * Elementor Team Carousel
     */
    function mkdfElementorGlleryBlocks() {
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction('frontend/element_ready/mkdf_gallery_blocks.default', function () {
                mkdf.modules.common.mkdfPrettyPhoto();
            });
        });
    }
	
})(jQuery);