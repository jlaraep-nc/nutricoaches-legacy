(function($) {
	'use strict';
	
	var roadmap = {};
	mkdf.modules.roadmap = roadmap;

	roadmap.mkdfInitRoadmap = mkdfInitRoadmap;

	roadmap.mkdfOnDocumentReady = mkdfOnDocumentReady;
	
	$(document).ready(mkdfOnDocumentReady);
	$(window).on('load', mkdfOnWindowLoad);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function mkdfOnDocumentReady() {
		mkdfInitRoadmap();
	}

	/**
	 All functions to be called on $(window).on('load') should be in this function
	 */
	function mkdfOnWindowLoad() {
		mkdfElementorRoadmap();
	}

	/**
	 * Elementor
	 */
	function mkdfElementorRoadmap(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_roadmap.default', function() {
				mkdfInitRoadmap();
			} );
		});
	}

	function mkdfInitRoadmap() {
		var roadmap = $('.mkdf-roadmap');
		
		if (roadmap.length) {
			roadmap.each(function () {
				var thisRoadmap = $(this),
					roadMapHolder = thisRoadmap.find('.mkdf-roadmap-holder'),
					roadmapItemsHolder = thisRoadmap.find('.mkdf-roadmap-inner-holder'),
					roadmapItems = thisRoadmap.find('.mkdf-roadmap-item'),
					visibleItems = 5,
					roadmapInitalWidth = thisRoadmap.width(),
					roadmapHolderWidth = 0,
					itemsWidth,
					itemsHeight = 0,
					itemReached = roadmapItems.filter('.mkdf-roadmap-reached-item').last(),
					prevArrow = thisRoadmap.find('.mkdf-rl-arrow-left'),
					nextArrow = thisRoadmap.find('.mkdf-rl-arrow-right'),
					firstActive,
					lastActive,
					translateCurrent = 0,
					moving = false;

				itemReached.siblings().remove('mkdf-roadmap-reached-item');
				itemReached.prevAll().addClass('mkdf-roadmap-passed-item');

				//set width for items and holder, also set classes and first and last active items
				var setWidths = function(){
					roadmapInitalWidth = thisRoadmap.width();

					if (mkdf.windowWidth > 1024) {
						visibleItems = 5;
					} else if (mkdf.windowWidth > 680) {
						visibleItems = 3;
					} else {
						visibleItems = 1;
					}

					itemsWidth = roadmapInitalWidth/visibleItems;

					roadmapItems.each(function () {
						var thisItem = $(this),
							thisItemHeight;

						thisItem.width(itemsWidth);
						roadmapHolderWidth += itemsWidth;

						//needs to be here in order to calculate height right because of the width
						thisItemHeight = thisItem.find('.mkdf-roadmap-item-content-holder').outerHeight();

						if (itemsHeight < thisItemHeight){
							itemsHeight = thisItemHeight;
						}
					});

					roadmapItemsHolder.width(roadmapHolderWidth);
					thisRoadmap.css({'paddingTop': itemsHeight + 70, 'paddingBottom' : itemsHeight + 70});

					//if firstactive set change them accordingly
					if (typeof firstActive != 'undefined') {
						roadmapItems.removeClass('mkdf-roadmap-active-item');
						firstActive.addClass('mkdf-roadmap-active-item');
						for (var i = 0; i < visibleItems - 1; i++) {
							firstActive.nextAll().eq(i).addClass('mkdf-roadmap-active-item');
						}
						lastActive = roadmapItems.filter('.mkdf-roadmap-active-item').last();
					} else {
						roadmapItems.eq(visibleItems).prevAll().addClass('mkdf-roadmap-active-item');
						firstActive = roadmapItems.filter('.mkdf-roadmap-active-item').first();
						lastActive = roadmapItems.filter('.mkdf-roadmap-active-item').last();
					}
				};

				//movement for provided step (> 0 to the right, < 0 to the left)
				var moveRoadmap = function(step, timeout){
					var nextItem;
					//prevent multiple clicks while animating with moving  var
					if (!moving) {
						//grab item to be moved to
						if (step >= 1) {
							nextItem = lastActive.nextAll().eq(step - 1);
						} else {
							nextItem = firstActive.prevAll().eq(Math.abs(step) - 1);
						}
						if (nextItem.length) {
							moving = true;

							//adjust classes according to currently moved to item
							roadmapItems.removeClass('mkdf-roadmap-active-item');
							nextItem.addClass('mkdf-roadmap-active-item');
							
							var $i = 0;
							if (step >= 1) {
								for ($i; $i < visibleItems - 1; $i++) {
									nextItem.prevAll().eq(i).addClass('mkdf-roadmap-active-item');
								}
							} else {
								for ($i; $i < visibleItems - 1; $i++) {
									nextItem.nextAll().eq(i).addClass('mkdf-roadmap-active-item');
								}
							}

							//set new first and last active items
							firstActive = roadmapItems.filter('.mkdf-roadmap-active-item').first();
							lastActive = roadmapItems.filter('.mkdf-roadmap-active-item').last();

							//move holder and set var moving to false
							translateCurrent -= step*itemsWidth;
							roadmapItemsHolder.css({'transform': 'translateX(' + translateCurrent + 'px)'});
							setTimeout(function () {
								moving = false;
							}, timeout);
						}
					}
				};

				//move holder to provided item
				var moveTo = function(item){
					var firstActiveIndex = firstActive.index(),
						lastActiveIndex = lastActive.index(),
						goToIndex = item.index(),
						moveStep = 0,
						middle;

					middle = (firstActiveIndex + lastActiveIndex) / 2;

					//if first or second item, go to third item
					//else if last or one before, go to third form the back
					//else go to the desired
					if ( goToIndex < Math.floor(visibleItems/2)) {
						moveStep = firstActiveIndex - 2;
					} else if (goToIndex > roadmapItems.length - 1 - Math.floor(visibleItems/2)) {
						moveStep = roadmapItems.length - 1 - lastActiveIndex;
					} else {
						moveStep = goToIndex - middle;
					}
					moveRoadmap(moveStep, 0);
				};

				//adjust translate so it wouldn't be stopped in the middle of items
				var resizeTranslateAdj = function(){
					var adjustment = firstActive.index()*itemsWidth;

					translateCurrent = -adjustment;
					roadmapItemsHolder.css({'transform': 'translateX(' + translateCurrent + 'px)'});
				};

				//inital set of widths and items
				setWidths();

				//move to reached item
				moveTo(itemReached);

				//bind movement for prev and next arrow
				nextArrow.on("click", function () {
					moveRoadmap(1, 200); //init movement to to right
				});
				prevArrow.on("click", function () {
					moveRoadmap(-1, 200); //init movement to to right
				});

				//adjustments on resize
				$(window).resize(function(){
					setWidths();
					resizeTranslateAdj();
				});

                $('.mkdf-roadmap-item-content-holder').css('opacity', 0);
                $('.mkdf-roadmap-item-above .mkdf-roadmap-item-content-holder').css('transform', 'translateY(20px)');
                $('.mkdf-roadmap-item-below .mkdf-roadmap-item-content-holder').css('transform', 'translateY(-20px)');
			});

			roadmap.appear(function () {
				$('.mkdf-roadmap-item-content-holder').each(function(i) {
					var fadeInTime = 0.2 + i/5;

					$(this).css({
						'opacity' : 1,
						'transform': 'translateY(0)',
                        'transition':'transform .25s ease-in-out '+ fadeInTime +'s, opacity .25s ease-in-out '+ fadeInTime +'s '
					});
				});
			});
        }
	}
	
})(jQuery);