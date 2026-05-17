(function($) {
	'use strict';
	
	var stamp = {};
	mkdf.modules.stamp = stamp;
	
	stamp.mkdfInitProcess = mkdfInitStamp;
	
	
	stamp.mkdfOnDocumentReady = mkdfOnDocumentReady;
	
	$(document).ready(mkdfOnDocumentReady);
	$(window).on('load', mkdfOnWindowLoad);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnDocumentReady() {
		mkdfInitStamp();
	}

	/**
	 All functions to be called on $(window).on('load') should be in this function
	 */
	function mkdfOnWindowLoad() {
		mkdfElementorStamp();
	}

	/**
	 * Elementor
	 */
	function mkdfElementorStamp(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_stamp.default', function() {
				mkdfInitStamp();
			} );
		});
	}
	
	/**
	 * Inti stamp shortcode on appear
	 */
	function mkdfInitStamp() {
		var holder = $('.mkdf-stamp-holder');
		
		if(holder.length) {
			holder.each(function(){
				var thisHolder = $(this),
					appearingDelay = thisHolder.data('appearing-delay'),
					stamp = thisHolder.children('.mkdf-s-text'),
					count = parseInt(stamp.data('count'), 10);
				
				stamp.children().each(function(i){
					var transform = -90 + i * 360 / count,
						transitionDelay = i * 60 / count * 10;
					
					$(this).css({'transform': 'rotate(' + transform + 'deg)', 'transition-delay': transitionDelay + 'ms'});
				});
				
				if (thisHolder.hasClass('mkdf-nested')) {
					setTimeout(function(){
						thisHolder.addClass('mkdf-appear');
						
						setTimeout(function(){
							thisHolder.addClass('mkdf-init');
						}, 300);
					}, appearingDelay);
				} else {
					thisHolder.appear(function(){
						setTimeout(function(){
							thisHolder.addClass('mkdf-appear');
							
							setTimeout(function(){
								thisHolder.addClass('mkdf-init');
							}, 300);
						}, appearingDelay);
					},{accX: 0, accY: mkdfGlobalVars.vars.mkdfElementAppearAmount});
				}
			});
		}
	}
	
})(jQuery);