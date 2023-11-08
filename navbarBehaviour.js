function setupScrollChanges({navSelector, subnavSelector, distanceThreshold=75}) {
    let subnav = $(subnavSelector);
    if (subnav.length === 0) {
        return;
    }

    let lastScrollTop = 0;
    let scrollingDown = false;
    let navigation = $(navSelector);

    let initialNavPosition = navigation.css("position");
    let initialSubnavPadding = subnav.css("padding-top");

    navigation.css("transition", "all 0.5s ease");
    subnav.css("transition", "all 0.2s ease");

    function scrollLogic() {
        let currentScrollTop = $(window).scrollTop();
        let distanceScrolled = Math.abs(lastScrollTop - currentScrollTop);

        if (distanceScrolled < distanceThreshold) {
            return;
        }

        $(window).off('scroll', scrollLogic);

        setTimeout(function() {
            $(window).scroll(scrollLogic);
        }, 500);

        if (currentScrollTop > lastScrollTop) {
            if (!scrollingDown) {
                navigation.css("position", "static");
                subnav.css("padding-top", "0");
                scrollingDown = true;
            }
        } else {
            if (scrollingDown) {
                navigation.css("position", initialNavPosition);
                subnav.css("padding-top", initialSubnavPadding);
                scrollingDown = false;
            }
        }
        lastScrollTop = currentScrollTop;
    }

    $(window).scroll(scrollLogic);
}
$(document).ready(function() {
    setupScrollChanges({
        navSelector: "[data-item='navigation']",
        subnavSelector: "[data-item='subnav']"
    });
});
