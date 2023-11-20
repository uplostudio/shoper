// Encapsulate code within a Utility Object to prevent clashes with global namespace
var myPage = (function ($) {
  // Variables
  var elements = {
    home: $('[data-origin="home"]'),
    heroSection: $('[data-section="hero"]'),
    promoBar: $(".promo_bar").first(),
    homeNavLinks: $('[data-origin="home"]').find(".nav__link"),
    logoSVGPath: $('[data-origin="home"]').find(".nav__logo svg path"),
    arrowSVGPath: $(".nav__arrow-wrapper svg path"),
    navButton: $("#navbar-button"), // Assuming the button's id is 'navbar-button'
    navButtonBg: $("#navbar-button").css("background-color"),
    navButtonBorder: $("#navbar-button").css("border")
  };

  elements.navButton.css({
    "background-color": "#FFFFFF1A",
    border: "none"
  });

  var params = {
    promoBarHeight: null,
    heroOffset: null,
    minWidth: 991 // minWidth is set to 992
  };

  // Functions
  function updateVariables() {
    // Bail out early for small screens
    if ($(window).width() >= params.minWidth) {
      params.initialPaddingTop = parseInt(
        $(".container.custom").css("paddingTop"),
        10
      );
    }

    params.promoBarHeight = elements.promoBar.outerHeight();
    params.heroOffset =
      elements.heroSection.offset().top + elements.heroSection.outerHeight();
  }

  function adjustStyles() {
    // Bail out early for small screens
    if (window.innerWidth < params.minWidth) return;

    var homeHeight = elements.home.outerHeight();
    var newPaddingTop = params.initialPaddingTop - homeHeight;

    var scrollTop = $(window).scrollTop();
    var homeBgColor =
      scrollTop >= params.promoBarHeight
        ? scrollTop >= params.heroOffset
          ? "white"
          : "#030820"
        : "transparent";

    if (scrollTop >= params.promoBarHeight) {
      elements.home.css({
        position: "sticky",
        top: "0",
        "background-color": homeBgColor
        // transition: "top 0.2s, background-color 0.2s"
      });

      $(".container.custom").css("padding-top", `${newPaddingTop}px`);
    } else {
      elements.home.css({
        position: "fixed",
        "background-color": homeBgColor
        // transition: "top 0.2s, background-color 0.2s"
      });

      $(".container.custom").css(
        "padding-top",
        `${params.initialPaddingTop}px`
      );
    }

    elements.logoSVGPath.css({
      fill: homeBgColor === "white" ? "#002fff" : "",
      transition: "fill 0.2s"
    });

    elements.arrowSVGPath.css({
      fill: homeBgColor === "white" ? "#000" : "",
      transition: "fill 0.2s"
    });

    elements.homeNavLinks.css({
      color: scrollTop >= params.heroOffset ? "black" : "",
      transition: "color 0.2s"
    });

    // Changes for #navbar-button
    if (homeBgColor === "white") {
      elements.navButton.css({
        "background-color": elements.navButtonBg,
        border: elements.navButtonBorder
      });
    } else {
      elements.navButton.css({
        "background-color": "#FFFFFF1A",
        border: "none"
      });
    }
  }

  // Debounce Function
  function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  // Observer setup
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var homeBgColor = elements.home.css("background-color");
      if (homeBgColor === "rgb(255, 255, 255)" || homeBgColor === "white") {
        // Will run when color is white
        mutation.target.style.color = "black";
      } else {
        mutation.target.style.color = "white";
      }
    });
  });

  var config = { attributes: true, subtree: false, attributeFilter: ["style"] };

  // Initialization on document ready
  $(document).ready(function () {
    if ($(window).width() < params.minWidth) return;

    updateVariables();
    $(window).on("scroll", adjustStyles);
    $(window).on(
      "resize",
      debounce(function () {
        updateVariables();
      }, 10)
    );

    elements.homeNavLinks.each(function () {
      observer.observe(this, config);
    });
  });

  // Publicly Accessible Methods
  return {
    updateVariables: updateVariables,
    adjustStyles: adjustStyles
  };
})(jQuery);
