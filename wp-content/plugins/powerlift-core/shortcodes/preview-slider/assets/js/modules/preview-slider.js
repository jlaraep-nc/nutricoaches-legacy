(function($) {
	'use strict';
	
	var previewSlider = {};
	mkdf.modules.previewSlider = previewSlider;
	
	previewSlider.mkdfInitPreviewSlider = mkdfInitPreviewSlider;
	
	
	previewSlider.mkdfOnDocumentReady = mkdfOnDocumentReady;
	
	$(document).ready(mkdfOnDocumentReady);
    $(window).on('load', mkdfOnWindowLoad);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnDocumentReady() {
        mkdfInitPreviewSlider();
	}

    /*
     All functions to be called on $(window).on('load') should be in this function
     */
    function mkdfOnWindowLoad() {
        mkdfElementorPreviewSlider();
    }

    /**
     * Elementor
     */
    function mkdfElementorPreviewSlider(){
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_preview_slider.default', function() {
                mkdfInitPreviewSlider();
            } );
        });
    }

    /*
     **	Init Preview Slider - Start
     */

    function mkdfInitPreviewSlider() {

        var sliders = $('.mkdf-preview-slider');
        sliders.each(function() {

            var slider = $(this);

            var autoplay = false,
                autoPlaySpeed = 2000;

            if(typeof slider.data('autoplay') !== 'undefined' && slider.data('autoplay') == 'yes'){
                autoplay = true;
            }

            if(typeof slider.data('autoplay-speed') !== 'undefined' && slider.data('autoplay-speed') !== ''){
                autoPlaySpeed = slider.data('autoplay-speed');
            }

            var slickImages = {
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: autoplay,
                autoplaySpeed: autoPlaySpeed,
                arrows: false,
                fade: true,
                draggable: false,
                infinite: true,
                pauseOnHover: false
            };

            var tabletSlider = slider.find('.mkdf-ps-tablet-images').slick(slickImages);
	        var laptopSlider = slider.find('.mkdf-ps-laptop-images').slick(slickImages);
	        var mobileSlider = slider.find('.mkdf-ps-mac-images').slick(slickImages);

            slider.addClass('mkdf-preview-slider-loaded');



        });
    }
	
	
	
})(jQuery);