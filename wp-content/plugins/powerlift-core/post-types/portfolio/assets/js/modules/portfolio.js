(function($) {
    'use strict';

    var portfolio = {};
    mkdf.modules.portfolio = portfolio;
	
    portfolio.mkdfOnWindowLoad = mkdfOnWindowLoad;
	
    $(window).on('load', mkdfOnWindowLoad);
	
	/*
	 All functions to be called on $(window).on('load') should be in this function
	 */
	function mkdfOnWindowLoad() {
		mkdfPortfolioSingleFollow().init();
        mkdfInitPortfolioShare();
	}
	
	var mkdfPortfolioSingleFollow = function () {
		var info = $('.mkdf-follow-portfolio-info .mkdf-portfolio-single-holder .mkdf-ps-info-sticky-holder');
		
		if (info.length) {
			var infoHolder = info.parent(),
				infoHolderOffset = infoHolder.offset().top,
				infoHolderHeight = infoHolder.height(),
				mediaHolder = $('.mkdf-ps-image-holder'),
				mediaHolderHeight = mediaHolder.height(),
				header = $('.header-appear, .mkdf-fixed-wrapper'),
				headerHeight = header.length ? header.height() : 0,
				constant = 30; //30 to prevent mispositioned
		}
		
		var infoHolderPosition = function () {
			if (info.length && mediaHolderHeight >= infoHolderHeight) {
				if (mkdf.scroll >= infoHolderOffset - headerHeight - mkdfGlobalVars.vars.mkdfAddForAdminBar - constant) {
					var marginTop = mkdf.scroll - infoHolderOffset + mkdfGlobalVars.vars.mkdfAddForAdminBar + headerHeight + constant;
					// if scroll is initially positioned below mediaHolderHeight
					if (marginTop + infoHolderHeight > mediaHolderHeight) {
						marginTop = mediaHolderHeight - infoHolderHeight + constant;
					}
					info.stop().animate({
						marginTop: marginTop
					});
				}
			}
		};
		
		var recalculateInfoHolderPosition = function () {
            // this is updated after scroll - for ie issue on starting height
            mediaHolderHeight = mediaHolder ? mediaHolder.height() : 0;

			if (info.length && mediaHolderHeight >= infoHolderHeight) {
				//Calculate header height if header appears
				if (mkdf.scroll > 0 && header.length) {
					headerHeight = header.height();
				}
				
				var headerMixin = headerHeight + mkdfGlobalVars.vars.mkdfAddForAdminBar + constant;
				if (mkdf.scroll >= infoHolderOffset - headerMixin) {
					if (mkdf.scroll + infoHolderHeight + headerMixin + 2 * constant < infoHolderOffset + mediaHolderHeight) {
						info.stop().animate({
							marginTop: (mkdf.scroll - infoHolderOffset + headerMixin + 2 * constant)
						});
						//Reset header height
						headerHeight = 0;
					} else {
						info.stop().animate({
							marginTop: mediaHolderHeight - infoHolderHeight
						});
					}
				} else {
					info.stop().animate({
						marginTop: 0
					});
				}
			}
		};
		
		return {
			init: function () {
				infoHolderPosition();
				$(window).scroll(function () {
					recalculateInfoHolderPosition();
				});
			}
		};
	};

    function mkdfInitPortfolioShare(){
        var share = $('.mkdf-ps-info-item.mkdf-ps-social-share');

        if(share.length){
            share.each(function(){
                var shareItem            = $(this),
                    socialIconsHolder   = shareItem.find('.mkdf-ps-social-share-holder'),
                    socialIcons         = shareItem.find('.mkdf-social-share-holder'),
                    socialIconsWidth    = socialIcons.outerWidth(true),
                    singleIconWidth     = $('.mkdf-team-social-opener').outerWidth(true);

                //socialIconsHolder.css('width', socialIconsWidth + singleIconWidth + 90);
                socialIconsHolder.css('width', 200);

                socialIconsHolder.on('mouseenter', function(){
                    socialIcons.stop(true,true).animate({
                        left: singleIconWidth,
                    }, 300, function() {
                    });
                });

                socialIconsHolder.on('mouseleave',function(){
                    socialIcons.stop(true,true).animate({
                        left: -socialIconsWidth,
                    }, 300, function() {
                    });
                });

            });
        }
    }

})(jQuery);