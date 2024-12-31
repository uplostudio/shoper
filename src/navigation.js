(function () {
  const $nav = $(".nav");
  const $nav_menu = $nav.find(".nav__menu");
  const dropdownDirective = "dropdown--open";
  const tabDirective = "tab--open";
  const navDirective = "nav--open";

  let dropdownState = false;
  let tabState = false;
  let tabLevel = 1;
  let navState = false;
  let activeTab = "";
  let originViewport = "";
  let currentViewport = "";

  const isMobile = () => {
    return $("#userAgent").is(":hidden");
  };

  const checkIfMobile = () => {
    let state = isMobile();

    if (state) {
      currentViewport = "Mobile";
      return true;
    } else {
      currentViewport = "Desktop";
      return false;
    }
  };

  $("body").append($("<div>").attr("id", "userAgent"));

  checkIfMobile();
  originViewport = currentViewport;

  // $(window).resize(function () {
  //   checkIfMobile();
  //   if (currentViewport != originViewport) {
  //     location.reload();
  //   }
  // });

  function initNav() {
    /** Set data */
    $(".nav__dropdown").each(function (i, e) {
      $(this).attr("data-sh-index", i);
    });

    $(".nav__dropdown-tab").each(function (i, e) {
      $(this).attr("data-sh-dropdown-nested", i);
    });

    $(".nav__dropdown-tab-link").each(function (i, e) {
      $(this).attr("data-sh-index", i);
    });

    jQuery.event.special.touchstart = {
      setup: function (_, ns, handle) {
        this.addEventListener("touchstart", handle, {
          passive: !ns.includes("noPreventDefault"),
        });
      },
    };

    jQuery.event.special.touchend = {
      setup: function (_, ns, handle) {
        this.addEventListener("touchend", handle, {
          passive: !ns.includes("noPreventDefault"),
        });
      },
    };
    /** -end Set data */

    /** Events */
    $(".nav__link").on("click", function () {
      const target = $(this).closest(".nav__dropdown");
      $('[data-sh-state="current"]').each(function () {
        $(this).removeAttr("data-sh-state");
      });
      toggleNavDropdown(target);
    });

    $(".nav__dropdown-tab-link").on("click", function () {
      if (checkIfMobile() === false) {
        return;
      }
      const target = $(this);
      dropdownState = true;
      toggleNavTab(target);
    });

    $(".nav__dropdown-tab").on("touchstart", function (event) {
      swipeRight(event, toggleNavTab);
    });

    $(".nav__menu").on("touchstart", function (event) {
      if (tabLevel === 2) return;
      swipeRight(event, closeAllDropdowns);
    });

    $(".nav__tab-back").on("click", function () {
      const target = $(this);
      if (tabLevel === 2) {
        toggleNavTab(target);
        return;
      }
      if (dropdownState) {
        closeAllDropdowns();
        return;
      }
    });

    $('[data-sh-action="trigger-nav"]').on("click", toggleNav);

    $(".nav__dropdown-tab-link").hover(function (event) {
      if (checkIfMobile()) {
        return;
      }

      let group = $(this).attr("data-tab-group");

      if (activeTab === group) {
        return;
      }

      toggleNavTab($(this));
      activeTab = $(this).attr("data-tab-group");

      $(this)
        .children()
        .each(function () {
          $(this).toggleClass(tabDirective);
        });
    });

    $(".nav__dropdown").hover(
      function() {
        if (checkIfMobile()) {
          return;
        }

        if (!checkIfMobile()) {  // Only add hover handlers if NOT mobile
          $(".nav__dropdown").hover(
              function() {
                  if (dropdownState) return; // Don't interfere if a dropdown is already open via click
                  
                  // Close all other dropdowns first
                  $(".nav__dropdown-list").removeClass(dropdownDirective);
                  
                  // Get the current dropdown index
                  const targetIndex = $(this).attr("data-sh-index");
                  
                  // Show only the current dropdown
                  $(this).find(".nav__dropdown-list").addClass(dropdownDirective);
                  $(`[data-sh-dropdown="${targetIndex}"]`).addClass(dropdownDirective);
                  
                  // Set z-index for the active dropdown
                  $(this).find(".nav__dropdown-list").css("z-index", "100");
                  $(`[data-sh-dropdown="${targetIndex}"]`).css("z-index", "100");
              },
              function() {
                  if (dropdownState) return; // Don't interfere if a dropdown is already open via click
                  
                  // On hover out, remove the dropdown and reset z-index
                  const targetIndex = $(this).attr("data-sh-index");
                  $(this).find(".nav__dropdown-list").removeClass(dropdownDirective);
                  $(`[data-sh-dropdown="${targetIndex}"]`).removeClass(dropdownDirective);
                  $(this).find(".nav__dropdown-list").css("z-index", "");
                  $(`[data-sh-dropdown="${targetIndex}"]`).css("z-index", "");
              }
          );
      }
      
        
        // Close all other dropdowns first
        $(".nav__dropdown-list").removeClass(dropdownDirective);
        
        // Get the current dropdown index
        const targetIndex = $(this).attr("data-sh-index");
        
        // Show only the current dropdown
        $(this).find(".nav__dropdown-list").addClass(dropdownDirective);
        $(`[data-sh-dropdown="${targetIndex}"]`).addClass(dropdownDirective);
        
        // Set z-index for the active dropdown
        $(this).find(".nav__dropdown-list").css("z-index", "100");
        $(`[data-sh-dropdown="${targetIndex}"]`).css("z-index", "100");
      },
      function() {
        if (checkIfMobile()) {
          return;
        }
        
        // On hover out, remove the dropdown and reset z-index
        const targetIndex = $(this).attr("data-sh-index");
        $(this).find(".nav__dropdown-list").removeClass(dropdownDirective);
        $(`[data-sh-dropdown="${targetIndex}"]`).removeClass(dropdownDirective);
        $(this).find(".nav__dropdown-list").css("z-index", "");
        $(`[data-sh-dropdown="${targetIndex}"]`).css("z-index", "");
      }
    );


    if (checkIfMobile()) {
      let dropdownContent = $("[data-sh-dropdown]");
      let target = $('[data-sh-mount="mainDropdown"]');
      target.append(dropdownContent);
    }
    /** end Events */
  }

  function swipeRight(event, action) {
    const target = $(event.target);
    const touchObjStart = event.changedTouches[0];
    const startX = parseInt(touchObjStart.clientX);

    $(this).off("touchend");
    $(this).on("touchend", function (event) {
      const touchObjEnd = event.changedTouches[0];
      const endX = parseInt(touchObjEnd.clientX);
      if (endX > startX + 50) {
        action(target);
      }
    });
  }

  function toggleNav(event) {
    const burger = $(".nav__burger-inner");
    $('[data-app="custom-banner"], [data-element="custom-banner"]').css("display", "flex");
    closeAllDropdowns();
    
    if (navState === false) {
        $('[data-app="custom-banner"], [data-element="custom-banner"]').css("display", "none");
        const wrapper = $("<div>").addClass("nav__mobile-menu-wrapper").attr("data-sh-state", "temp");
        $nav_menu.children().wrapAll(wrapper);
        $nav_menu.addClass(navDirective).attr("data-sh-state", "open");
        burger.children().each(function () {
            $(this).addClass(navDirective);
            $(this)
                .children()
                .each(function () {
                    $(this).addClass(navDirective);
                });
        });
        return (navState = true);
    }

    if (navState === true) {
        $('[data-app="custom-banner"], [data-element="custom-banner"]').css("display", "flex");
        $('[data-sh-state="temp"]').children().unwrap();
        $nav_menu.removeClass(navDirective).attr("data-sh-state", "closed");
        burger.children().each(function () {
            $(this).removeClass(navDirective);
            $(this)
                .children()
                .each(function () {
                    $(this).removeClass(navDirective);
                });
        });
        return (navState = false);
    }
}


  function toggleNavDropdown(target) {
    const targetIndex = target.attr("data-sh-index");
    const tempDropdownIndex = $(`[data-sh-dropdown="${targetIndex}"]`).attr("data-sh-dropdown");

    if (dropdownState === false) {
      if (checkIfMobile()) {
        $('[data-sh-index="0"]').find(".nav__dropdown-list").addClass(dropdownDirective);
        $(`[data-sh-dropdown="${targetIndex}"]`).addClass(dropdownDirective);
        $(".nav__logo-wrapper").addClass(dropdownDirective);
        $(".nav__tab-back").addClass(dropdownDirective);
      } else {
        target.find(".nav__dropdown-list").addClass(dropdownDirective);
      }
      target.attr("data-sh-state", "current");
      $(".nav__column").each(function () {
        $(this).addClass(dropdownDirective);
      });

      return (dropdownState = true);
    }

    if (dropdownState === true) {
      $(".nav__column").each(function () {
        $(this).removeClass(dropdownDirective);
      });
      if (checkIfMobile()) {
        $('[data-sh-index="0"]').find(".nav__dropdown-list").removeClass(dropdownDirective);
        $(`[data-sh-dropdown="${targetIndex}"]`).removeClass(dropdownDirective);
        $(".nav__logo-wrapper").removeClass(dropdownDirective);
        $(".nav__tab-back").removeClass(dropdownDirective);
      } else {
        target.find(".nav__dropdown-list").removeClass(dropdownDirective);
      }
      target.find(".nav__dropdown-list").removeClass(dropdownDirective);

      return (dropdownState = false);
    }
  }

  function closeAllDropdowns() {
    if (dropdownState === false) return;
    $(".dropdown--open").each(function () {
      $(this).removeClass(dropdownDirective);
    });
    return (dropdownState = false);
  }

  function toggleNavTab(target) {
    let bindGroup = target.attr("data-tab-group");

    // Mobile
    if (checkIfMobile()) {
      if (tabLevel === 1) {
        $(bindGroup).each(function () {
          $(this).addClass(tabDirective);
        });
        $(`.nav__dropdown-tab[data-tab-group=${bindGroup}]`).addClass(tabDirective);
        target.closest(".nav__dropdown-list-wrapper.type-two").find(".nav__dropdown-content-left.type-two").addClass(tabDirective);
        target.closest(".nav__dropdown-list-wrapper.type-two").find(".nav__dropdown-content-right.type-two").addClass(tabDirective);
        tabState = true;
        tabLevel = 2;
        return;
      }
      if (tabLevel === 2) {
        $(`.${tabDirective}`).each(function () {
          $(this).removeClass(tabDirective);
        });
        tabState = false;
        tabLevel = 1;

        return;
      }
    }

    $(`.${tabDirective}`).each(function () {
      $(this).removeClass(tabDirective);
    });

    $(bindGroup).each(function () {
      $(this).toggleClass(tabDirective);
    });
    $(`.nav__dropdown-tab[data-tab-group=${bindGroup}]`).toggleClass(tabDirective);
    target.closest(".nav__dropdown-list-wrapper.type-two").find(".nav__dropdown-content-left.type-two").toggleClass(tabDirective);
    target.closest(".nav__dropdown-list-wrapper.type-two").find(".nav__dropdown-content-right.type-two").toggleClass(tabDirective);
  }

  initNav();
})();

// footer year update
try {
  let footerYear = document.querySelector("#footer-year");
  footerYear.innerHTML = new Date().getFullYear();
} catch (e) {}

// mobile tabs fix

$(document).ready(function() {

  function checkWidthAndApplyClass() {
      if($(window).width() > 991) {
          $('[data-trigger="open"]').addClass('tab--open');
      } else {
          $('[data-trigger="open"]').removeClass('tab--open');
      }
  }

  checkWidthAndApplyClass();

  $(window).resize(function() {
      checkWidthAndApplyClass();
  });
});

// Navbar sticky logic

$(document).ready(function () {
  function setupScrollChanges({ navSelector, subnavSelector, distanceThreshold = 75 }) {
      let navigation = $(navSelector);
      let subnav = $(subnavSelector);

      // Check if the subnav element exists before setting up scroll changes
      if (subnav.length === 0) {
          return;
      }

      let lastScrollTop = 0;
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
          } else if (currentScrollTop < lastScrollTop) {
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
