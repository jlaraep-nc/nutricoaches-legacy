(function ($) {
	'use strict';
	
	var timeline = {};
	mkdf.modules.timeline = timeline;
	
	timeline.mkdfInitHorizontalTimeline = mkdfInitHorizontalTimeline;
	
	
	timeline.mkdfOnDocumentReady = mkdfOnDocumentReady;
	
	$(document).ready(mkdfOnDocumentReady);
	$(window).on('load', mkdfOnWindowLoad);
	
	/*
	 ** All functions to be called on $(window).on('load') should be in this function
	 */
	function mkdfOnDocumentReady() {
		mkdfInitHorizontalTimeline().init();
	}

	/**
	 All functions to be called on $(window).on('load') should be in this function
	 */
	function mkdfOnWindowLoad() {
		mkdfElementorHorizontalTimeline();
	}

	/**
	 * Elementor
	 */
	function mkdfElementorHorizontalTimeline(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_horizontal_timeline.default', function() {
				mkdfInitHorizontalTimeline().init();
			} );
		});
	}
	
	function mkdfInitHorizontalTimeline() {
		var timelines = $('.mkdf-horizontal-timeline'),
			eventsMinDistance;
		
		function initTimeline(timelines) {
			timelines.each(function () {
				var timeline = $(this),
					timelineComponents = {};
				
				eventsMinDistance = timeline.data('distance');
				
				//cache timeline components
				timelineComponents.timelineNavWrapper = timeline.find('.mkdf-ht-nav-wrapper');
				timelineComponents.timelineNavWrapperWidth = timelineComponents.timelineNavWrapper.width();
				timelineComponents.timelineNavInner = timelineComponents.timelineNavWrapper.find('.mkdf-ht-nav-inner');
				timelineComponents.fillingLine = timelineComponents.timelineNavInner.find('.mkdf-ht-nav-filling-line');
				timelineComponents.timelineEvents = timelineComponents.timelineNavInner.find('a');
				timelineComponents.timelineDates = parseDate(timelineComponents.timelineEvents);
				timelineComponents.eventsMinLapse = minLapse(timelineComponents.timelineDates);
				timelineComponents.timelineNavigation = timeline.find('.mkdf-ht-nav-navigation');
				timelineComponents.timelineEventContent = timeline.find('.mkdf-ht-content');
				
				//select initial event
				timelineComponents.timelineEvents.first().addClass('mkdf-selected');
				timelineComponents.timelineEventContent.find('li').first().addClass('mkdf-selected');
				
				//assign a left postion to the single events along the timeline
				setDatePosition(timelineComponents, eventsMinDistance);
				
				//assign a width to the timeline
				var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
				
				//the timeline has been initialize - show it
				timeline.addClass('mkdf-loaded');
				
				//detect click on the next arrow
				timelineComponents.timelineNavigation.on('click', '.mkdf-next', function (e) {
					e.preventDefault();
					updateSlide(timelineComponents, timelineTotWidth, 'next');
				});
				
				//detect click on the prev arrow
				timelineComponents.timelineNavigation.on('click', '.mkdf-prev', function (e) {
					e.preventDefault();
					updateSlide(timelineComponents, timelineTotWidth, 'prev');
				});
				
				//detect click on the a single event - show new event content
				timelineComponents.timelineNavInner.on('click', 'a', function (e) {
					e.preventDefault();
					
					var thisItem = $(this);
					
					timelineComponents.timelineEvents.removeClass('mkdf-selected');
					thisItem.addClass('mkdf-selected');
					
					updateOlderEvents(thisItem);
					updateFilling(thisItem, timelineComponents.fillingLine, timelineTotWidth);
					updateVisibleContent(thisItem, timelineComponents.timelineEventContent);
				});
				
				var mq = checkMQ();
				
				//on swipe, show next/prev event content
				timelineComponents.timelineEventContent.on('swipeleft', function(){
					( mq === 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');
				});
				timelineComponents.timelineEventContent.on('swiperight', function(){
					( mq === 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
				});
				
				//keyboard navigation
				$(document).keyup(function (event) {
					if (event.which === '37' && elementInViewport(timeline.get(0))) {
						showNewContent(timelineComponents, timelineTotWidth, 'prev');
					} else if (event.which === '39' && elementInViewport(timeline.get(0))) {
						showNewContent(timelineComponents, timelineTotWidth, 'next');
					}
				});
			});
		}
		
		function updateSlide(timelineComponents, timelineTotWidth, string) {
			//retrieve translateX value of timelineComponents.timelineNavInner
			var translateValue = getTranslateValue(timelineComponents.timelineNavInner),
				wrapperWidth = Number(timelineComponents.timelineNavWrapper.css('width').replace('px', ''));
			//translate the timeline to the left('next')/right('prev')
			if(string === 'next') {
				translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth);
			} else {
				translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
			}
		}
		
		function showNewContent(timelineComponents, timelineTotWidth, string) {
			//go from one event to the next/previous one
			var visibleContent = timelineComponents.timelineEventContent.find('.mkdf-selected'),
				newContent = (string === 'next') ? visibleContent.next() : visibleContent.prev();
			
			if (newContent.length > 0) { //if there's a next/prev event - show it
				var selectedDate = timelineComponents.timelineNavInner.find('.mkdf-selected'),
					newEvent = (string === 'next') ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');
				
				updateFilling(newEvent, timelineComponents.fillingLine, timelineTotWidth);
				updateVisibleContent(newEvent, timelineComponents.timelineEventContent);
				
				newEvent.addClass('mkdf-selected');
				selectedDate.removeClass('mkdf-selected');
				
				updateOlderEvents(newEvent);
				updateTimelinePosition(string, newEvent, timelineComponents);
			}
		}
		
		function updateTimelinePosition(string, event, timelineComponents) {
			//translate timeline to the left/right according to the position of the mkdf-selected event
			var eventStyle = window.getComputedStyle(event.get(0), null),
				eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
				timelineWidth = Number(timelineComponents.timelineNavWrapper.css('width').replace('px', '')),
				timelineTotWidth = Number(timelineComponents.timelineNavInner.css('width').replace('px', '')),
				timelineTranslate = getTranslateValue(timelineComponents.timelineNavInner);
			
			if ((string === 'next' && eventLeft > timelineWidth - timelineTranslate) || (string === 'prev' && eventLeft < -timelineTranslate)) {
				translateTimeline(timelineComponents, -eventLeft + timelineWidth / 2, timelineWidth - timelineTotWidth);
			}
		}
		
		function translateTimeline(timelineComponents, value, totWidth) {
			var timelineNavInner = timelineComponents.timelineNavInner.get(0);
			
			value = (value > 0) ? 0 : value; //only negative translate value
			value = (typeof totWidth !== 'undefined' && value < totWidth) ? totWidth : value; //do not translate more than timeline width
			
			setTransformValue(timelineNavInner, 'translateX', value + 'px');
			
			//update navigation arrows visibility
			(value === 0) ? timelineComponents.timelineNavigation.find('.mkdf-prev').addClass('mkdf-inactive') : timelineComponents.timelineNavigation.find('.mkdf-prev').removeClass('mkdf-inactive');
			(value === totWidth) ? timelineComponents.timelineNavigation.find('.mkdf-next').addClass('mkdf-inactive') : timelineComponents.timelineNavigation.find('.mkdf-next').removeClass('mkdf-inactive');
		}
		
		function updateFilling(selectedEvent, filling, totWidth) {
			//change .mkdf-ht-nav-filling-line length according to the mkdf-selected event
			var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
				eventLeft = eventStyle.getPropertyValue("left"),
				eventWidth = eventStyle.getPropertyValue("width");
			
			eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', '')) / 2;
			
			var scaleValue = eventLeft / totWidth;
			
			setTransformValue(filling.get(0), 'scaleX', scaleValue);
		}
		
		function setDatePosition(timelineComponents, min) {
			for (var i = 0; i < timelineComponents.timelineDates.length; i++) {
				var distance = daydiff(timelineComponents.timelineDates[0], timelineComponents.timelineDates[i]),
					distanceNorm = Math.round(distance / timelineComponents.eventsMinLapse) + 2;
				
				timelineComponents.timelineEvents.eq(i).css('left', distanceNorm * min + 'px');
			}
		}
		
		function setTimelineWidth(timelineComponents, width) {
			var timeSpan = daydiff(timelineComponents.timelineDates[0], timelineComponents.timelineDates[timelineComponents.timelineDates.length - 1]),
				timeSpanNorm = Math.round(timeSpan / timelineComponents.eventsMinLapse) + 4,
				totalWidth = timeSpanNorm * width;
			
			if (totalWidth < timelineComponents.timelineNavWrapperWidth) {
				totalWidth = timelineComponents.timelineNavWrapperWidth;
			}
			
			timelineComponents.timelineNavInner.css('width', totalWidth + 'px');
			
			updateFilling(timelineComponents.timelineNavInner.find('a.mkdf-selected'), timelineComponents.fillingLine, totalWidth);
			updateTimelinePosition('next', timelineComponents.timelineNavInner.find('a.mkdf-selected'), timelineComponents);
			
			return totalWidth;
		}
		
		function updateVisibleContent(event, timelineEventContent) {
			var eventDate = event.data('date'),
				visibleContent = timelineEventContent.find('.mkdf-selected'),
				selectedContent = timelineEventContent.find('[data-date="' + eventDate + '"]'),
				selectedContentHeight = selectedContent.height(),
				classEnetering = 'mkdf-selected mkdf-enter-left',
				classLeaving = 'mkdf-leave-right';
		
			if (selectedContent.index() > visibleContent.index()) {
				classEnetering = 'mkdf-selected mkdf-enter-right';
				classLeaving = 'mkdf-leave-left';
			}
			
			selectedContent.attr('class', classEnetering);
			
			visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
				visibleContent.removeClass('mkdf-leave-right mkdf-leave-left');
				selectedContent.removeClass('mkdf-enter-left mkdf-enter-right');
			});
			
			timelineEventContent.css('height', selectedContentHeight + 'px');
		}
		
		function updateOlderEvents(event) {
			event.parent('li').prevAll('li').children('a').addClass('mkdf-older-event').end().end().nextAll('li').children('a').removeClass('mkdf-older-event');
		}
		
		function getTranslateValue(timeline) {
			var timelineStyle = window.getComputedStyle(timeline.get(0), null),
				timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") || timelineStyle.getPropertyValue("-moz-transform") || timelineStyle.getPropertyValue("-ms-transform") || timelineStyle.getPropertyValue("-o-transform") || timelineStyle.getPropertyValue("transform"),
				translateValue = 0;
			
			if (timelineTranslate.indexOf('(') >= 0) {
				timelineTranslate = timelineTranslate.split('(')[1];
				timelineTranslate = timelineTranslate.split(')')[0];
				timelineTranslate = timelineTranslate.split(',');
				
				translateValue = timelineTranslate[4];
			}
			
			return Number(translateValue);
		}
		
		function setTransformValue(element, property, value) {
			element.style["-webkit-transform"] = property + "(" + value + ")";
			element.style["-moz-transform"] = property + "(" + value + ")";
			element.style["-ms-transform"] = property + "(" + value + ")";
			element.style["-o-transform"] = property + "(" + value + ")";
			element.style["transform"] = property + "(" + value + ")";
		}
		
		//based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
		function parseDate(events) {
			var dateArrays = [];
			
			events.each(function () {
				var singleDate = $(this),
					dateCompStr = new String(singleDate.data('date')),
					dayComp = ['2000', '0', '0'],
					timeComp = ['0', '0'];
				
				if ( dateCompStr.length === 4 ) { //only year
					dayComp = [dateCompStr, '0', '0'];
				} else {
					var dateComp = dateCompStr.split('T');
					
					dayComp = dateComp[0].split('/'); //only DD/MM/YEAR
					
					if (dateComp.length > 1) { //both DD/MM/YEAR and time are provided
						dayComp = dateComp[0].split('/');
						timeComp = dateComp[1].split(':');
					} else if (dateComp[0].indexOf(':') >= 0) { //only time is provide
						timeComp = dateComp[0].split(':');
					}
				}
				
				var newDate = new Date(dayComp[2], dayComp[1] - 1, dayComp[0], timeComp[0], timeComp[1]);
				
				dateArrays.push(newDate);
			});
			
			return dateArrays;
		}
		
		function daydiff(first, second) {
			return Math.round((second - first));
		}
		
		function minLapse(dates) {
			//determine the minimum distance among events
			var dateDistances = [];
			
			for (var i = 1; i < dates.length; i++) {
				var distance = daydiff(dates[i - 1], dates[i]);
				dateDistances.push(distance);
			}
			
			return Math.min.apply(null, dateDistances);
		}
		
		/*
		 How to tell if a DOM element is visible in the current viewport?
		 http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		 */
		function elementInViewport(el) {
			var top = el.offsetTop;
			var left = el.offsetLeft;
			var width = el.offsetWidth;
			var height = el.offsetHeight;
			
			while (el.offsetParent) {
				el = el.offsetParent;
				top += el.offsetTop;
				left += el.offsetLeft;
			}
			
			return (
				top < (window.pageYOffset + window.innerHeight) &&
				left < (window.pageXOffset + window.innerWidth) &&
				(top + height) > window.pageYOffset &&
				(left + width) > window.pageXOffset
			);
		}
		
		function checkMQ() {
			//check if mobile or desktop device
			return window.getComputedStyle(document.querySelector('.mkdf-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
		}
		
		return {
			init: function () {
				(timelines.length > 0) && initTimeline(timelines);
			}
		};
	}
	
})(jQuery);