(function($) {
    "use strict";

    var blogSliderSC = {};
    mkdf.modules.blogSliderSC = blogSliderSC;

    blogSliderSC.mkdfOnWindowLoad = mkdfOnWindowLoad;

    $(window).on('load', mkdfOnWindowLoad);

    /*
     All functions to be called on $(window).on('load') should be in this function
     */
    function mkdfOnWindowLoad() {
        mkdfElementorBlogSlider();
    }

    /**
     * Elementor Blog List
     */
    function mkdfElementorBlogSlider() {
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction('frontend/element_ready/mkdf_blog_slider.default', function () {
                mkdf.modules.common.mkdfOwlSlider();
            });
        });
    }

})(jQuery);