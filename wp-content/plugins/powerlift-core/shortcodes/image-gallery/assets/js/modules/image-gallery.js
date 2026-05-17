(function ($) {
	'use strict';
	
	var imageGallery = {};
	mkdf.modules.imageGallery = imageGallery;


	imageGallery.mkdfOnWindowLoad = mkdfOnWindowLoad;
	
	$(window).on('load', mkdfOnWindowLoad);
	
	/**
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnWindowLoad() {
		mkdfElementorImageGallery();
	}

    /**
     * Elementor
     */
	function mkdfElementorImageGallery() {
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction('frontend/element_ready/mkdf_image_gallery.default', function () {
				mkdf.modules.common.mkdfOwlSlider();
				mkdf.modules.common.mkdfInitGridMasonryListLayout();
			});
		});
	}
	
})(jQuery);