(function($) {
    'use strict';

    var portfolioSlider = {};
    mkdf.modules.portfolioSlider = portfolioSlider;

	portfolioSlider.mkdfOnWindowLoad = mkdfOnWindowLoad;

    $(window).on('load', mkdfOnWindowLoad);


    /*
     All functions to be called on $(window).on('load') should be in this function
     */
    function mkdfOnWindowLoad() {
		mkdfElementorPortfolioSlider();
    }

	/**
	 * Elementor
	 */
	function mkdfElementorPortfolioSlider(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_portfolio_slider.default', function() {
				mkdf.modules.common.mkdfOwlSlider();
				mkdf.modules.common.mkdfPrettyPhoto();
			} );
		});
	}

})(jQuery);