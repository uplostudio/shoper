function setupScrollChanges({ navSelector, subnavSelector, distanceThreshold = 75 }) {
    let subnav = $(subnavSelector);

    // Return if subnav is not found
    if (subnav.length === 0) {
        return;
    }

    let lastScrollTop = 0;
    let scrollingDown = false;
    let navigation = $(navSelector);

    let initialNavPosition = navigation.css("position");
    let initialSubnavPadding = subnav.css("padding-top");

    // Apply transitions
    navigation.css("transition", "all 0.5s ease");
    subnav.css("transition", "all 0.2s ease");

    $(window).scroll(function() {
        let currentScrollTop = $(window).scrollTop();
        let distanceScrolled = Math.abs(lastScrollTop - currentScrollTop);

        // Check if scroll distance is less than the set threshold
        if (distanceScrolled < distanceThreshold) {
            return;
        }

        if (currentScrollTop > lastScrollTop) {
            // Scroll Down
            if (!scrollingDown) {
                navigation.css("position", "static");
                subnav.css("padding-top", "0");
                scrollingDown = true;
            }
        } else {
            // Scroll Up
            if (scrollingDown) {
                navigation.css("position", initialNavPosition);
                subnav.css("padding-top", initialSubnavPadding);
                scrollingDown = false;
            }
        }
        lastScrollTop = currentScrollTop;
    });
}

$(document).ready(function() {
    setupScrollChanges({
        navSelector: "[data-item='navigation']",
        subnavSelector: "[data-item='subnav']"
    });
});
