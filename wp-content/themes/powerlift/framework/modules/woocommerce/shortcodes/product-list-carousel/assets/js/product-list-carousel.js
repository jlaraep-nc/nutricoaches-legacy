(function($) {
    "use strict";

    var productListCarousel = {};
    mkdf.modules.productListCarousel = productListCarousel;

    productListCarousel.mkdfOnWindowLoad = mkdfOnWindowLoad;

    $(window).on('load', mkdfOnWindowLoad);

    /*
     All functions to be called on $(window).on('load') should be in this function
     */
    function mkdfOnWindowLoad() {
        mkdfElementorProductListCarousel();
    }

    /**
     * Elementor Blog List
     */
    function mkdfElementorProductListCarousel() {
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction('frontend/element_ready/mkdf_product_list_carousel.default', function () {
                mkdf.modules.common.mkdfOwlSlider();
            });
        });
    }

})(jQuery);