(function ($) {
	'use strict';
	
	var anchorMenu = {};
	mkdf.modules.anchorMenu = anchorMenu;
	
	anchorMenu.mkdfAnchorMenu = mkdfAnchorMenu;
	
	
	anchorMenu.mkdfOnDocumentReady = mkdfOnDocumentReady;
	
	$(document).ready(mkdfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnDocumentReady() {
		mkdfAnchorMenu();
	}
	
	/*
	 *  Anchor Menu relocation
	 */
	function mkdfAnchorMenu() {
		var anchorMenu = $('.mkdf-anchor-menu');
		
		if (anchorMenu.length && mkdf.windowWidth > 1024) {
			anchorMenu.remove();
			$('.mkdf-content-inner').append(anchorMenu.addClass('mkdf-init'));
			
			//scroll active item logic
			var anchorSections = $('div[data-mkdf-anchor]'),
				anchorMenuItems = anchorMenu.find('.mkdf-anchor');
			
			if (anchorSections.length && anchorMenuItems.length) {
				anchorMenuItems.first().addClass('mkdf-active');
				
				$(window).scroll(function () {
					anchorSections.each(function (i) {
						var anchorSection = $(this),
							anchorSectionTop = anchorSection.offset().top,
							anchorSectionHeight = anchorSection.outerHeight(),
							offset = mkdf.windowHeight / 5,
							currentItemIndex = 0;
						
						if ( mkdf.scroll === 0 ) {
							anchorMenuItems.removeClass('mkdf-active').first().addClass('mkdf-active');
						} else if (anchorSectionTop <= mkdf.scroll + offset && anchorSectionTop + anchorSectionHeight >= mkdf.scroll + offset) {
							if (currentItemIndex !== i) {
								currentItemIndex = i;
								anchorMenuItems.removeClass('mkdf-active').eq(i).addClass('mkdf-active');
							}
						} else if (mkdf.scroll + mkdf.windowHeight == mkdf.document.height()) {
							anchorMenuItems.removeClass('mkdf-active').last().addClass('mkdf-active');
						}
					});
				});
			}
		}
	}
	
})(jQuery);



