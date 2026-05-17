(function($) {
    "use strict";

    var productList = {};
    mkdf.modules.productList = productList;

    productList.mkdfOnWindowLoad = mkdfOnWindowLoad;

    $(window).on('load', mkdfOnWindowLoad);

    /*
     All functions to be called on $(window).on('load') should be in this function
     */
    function mkdfOnWindowLoad() {
        mkdfElementorProductList();
    }

    /**
     * Elementor Blog List
     */
    function mkdfElementorProductList() {
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction('frontend/element_ready/mkdf_product_list.default', function () {
                mkdf.modules.common.mkdfInitGridMasonryListLayout();
            });
        });
    }

})(jQuery);