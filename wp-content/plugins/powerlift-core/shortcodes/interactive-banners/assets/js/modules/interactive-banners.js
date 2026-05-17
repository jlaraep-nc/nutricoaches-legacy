(function($) {
	'use strict';
	
	var interactiveBanner = {};
	mkdf.modules.interactiveBanner = interactiveBanner;

	interactiveBanner.mkdfInitExpandedGallery = mkdfInitInteractiveBanners;


	interactiveBanner.mkdfOnWindowLoad = mkdfOnWindowLoad;
	
	$(window).on('load', mkdfOnWindowLoad);

	/*
	 All functions to be called on $(window).on('load') should be in this function
	 */
	function mkdfOnWindowLoad() {
		mkdfInitInteractiveBanners();
		mkdfElementorInteractiveBanners();
	}

	/**
	 * Elementor
	 */
	function mkdfElementorInteractiveBanners(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_interactive_banners.default', function() {
				mkdfInitInteractiveBanners();
			} );
		});
	}

	/*
	 **	Init Expanded Gallery shortcode
	 */
	function mkdfInitInteractiveBanners(){
		var holder = $('.mkdf-interactive-banners');

		if(holder.length){
			holder.each(function(){
				var thisHolder = $(this),
					imagesHolder = thisHolder.find('.mkdf-ib-images-holder'),
					imagesHolderItem = imagesHolder.find('.mkdf-ib-image-holder'),
					items = thisHolder.find('.mkdf-ib-item'),
					activeItemIndex = 0;

				imagesHolder.css('background-image', imagesHolder.find('.mkdf-ib-image-holder').first().css('background-image'));

				items.on('mouseenter', function() {
					items.removeClass('mkdf-active');
					$(this).addClass('mkdf-active');
					activeItemIndex = $(this).index();
					imagesHolderItem.removeClass('mkdf-active');
					imagesHolder.find('.mkdf-ib-image-holder').eq(activeItemIndex).addClass('mkdf-active');
				});
			});
		}

	}
	
})(jQuery);