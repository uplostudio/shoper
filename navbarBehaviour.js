$(document).ready(function () {
    function setupScrollChanges({ navSelector, subnavSelector, distanceThreshold = 75 }) {
        let lastScrollTop = 0;
        let navigation = $(navSelector);
        let subnav = $(subnavSelector);

        let initialNavPosition = navigation.css("position");
        let initialSubnavPadding = subnav.css("padding-top");

        let scrollingDownStyles = {
            "nav": { "position": "static" },
            "subnav": { "padding-top": "0" }
        };

        let scrollingUpStyles = {
            "nav": { "position": initialNavPosition },
            "subnav": { "padding-top": initialSubnavPadding }
        };

        let isScrolling = false;

        $(window).on('scroll', function () {
            let currentScrollTop = $(window).scrollTop();

            // If user has quickly scrolled to top, reset the style regardless of the delay
            if (currentScrollTop === 0) {
                navigation.css(scrollingUpStyles.nav);
                subnav.css(scrollingUpStyles.subnav);
                return;
            }
            
            if (isScrolling || Math.abs(lastScrollTop - currentScrollTop) < distanceThreshold) {
                return;
            }
            
            isScrolling = true;

            if (currentScrollTop > lastScrollTop) {
                navigation.css(scrollingDownStyles.nav);
                subnav.css(scrollingDownStyles.subnav);
            } else if(currentScrollTop < lastScrollTop){
                navigation.css(scrollingUpStyles.nav);
                subnav.css(scrollingUpStyles.subnav);
            }

            lastScrollTop = currentScrollTop;

            setTimeout(function() {
                isScrolling = false;
            }, 500);
        });
    }

    setupScrollChanges({
        navSelector: "[data-item='navigation']",
        subnavSelector: "[data-item='subnav']"
    });
});
