(function($) {
    'use strict';

    var team = {};
    mkdf.modules.team = team;

    team.mkdfInitTeam = mkdfInitTeam;


    team.mkdfOnDocumentReady = mkdfOnDocumentReady;

    $(document).ready(mkdfOnDocumentReady);
    $(window).on('load', mkdfOnWindowLoad);

    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function mkdfOnDocumentReady() {
        mkdfInitTeam();
    }

    /**
     All functions to be called on $(window).on('load') should be in this function
     */
    function mkdfOnWindowLoad() {
        mkdfElementorTeam();
    }

    /**
     * Elementor
     */
    function mkdfElementorTeam(){
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/mkdf_team.default', function() {
                mkdfInitTeam();
            } );
        });
    }

    /*
     **	Init team shortcode
     */
    function mkdfInitTeam(){
        var team = $('.mkdf-team-holder');

        if(team.length){
            team.each(function(){
                var teamItem            = $(this),
                    socialIconsHolder   = teamItem.find('.mkdf-team-social-floating'),
                    socialIcons         = teamItem.find('.mkdf-team-social-holder'),
                    socialIconsWidth    = socialIcons.outerWidth(true),
                    singleIconWidth     = $('.mkdf-team-social-opener').outerWidth(true);

                socialIconsHolder.css('width', socialIconsWidth + singleIconWidth + 90);



                teamItem.on('mouseenter', function(){
                    socialIcons.stop(true,true).animate({
                        left: singleIconWidth,
                    }, 350, function() {
                    });
                });

                teamItem.on('mouseleave',function(){
                    socialIcons.stop(true,true).animate({
                        left: -socialIconsWidth,
                    }, 350, function() {
                    });
                });

            });
        }
    }

})(jQuery);