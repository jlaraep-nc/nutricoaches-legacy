(function ($) {
	'use strict';
	
	var teamCarousel = {};
	mkdf.modules.teamCarousel = teamCarousel;


    teamCarousel.mkdfOnWindowLoad = mkdfOnWindowLoad;
	
	$(window).on('load', mkdfOnWindowLoad);
	
	/**
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnWindowLoad() {
        mkdfElementorTeamCarousel();
	}


    /**
     * Elementor Team Carousel
     */
    function mkdfElementorTeamCarousel() {
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction('frontend/element_ready/mkdf_team_carousel.default', function () {
                mkdf.modules.common.mkdfOwlSlider();
            });
        });
    }
	
})(jQuery);