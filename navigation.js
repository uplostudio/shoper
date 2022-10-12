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

  $(window).resize(function () {
    checkIfMobile();
    if (currentViewport != originViewport) {
      location.reload();
    }
  });

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
          passive: !ns.includes("noPreventDefault")
        });
      }
    };

    jQuery.event.special.touchend = {
      setup: function (_, ns, handle) {
        this.addEventListener("touchend", handle, {
          passive: !ns.includes("noPreventDefault")
        });
      }
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
        console.log("Click denied");
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
    closeAllDropdowns();
    if (navState === false) {
      const wrapper = $("<div>")
        .addClass("nav__mobile-menu-wrapper")
        .attr("data-sh-state", "temp");
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
    const tempDropdownIndex = $(`[data-sh-dropdown="${targetIndex}"]`).attr(
      "data-sh-dropdown"
    );

    if (dropdownState === false) {
      if (checkIfMobile()) {
        $('[data-sh-index="0"]')
          .find(".nav__dropdown-list")
          .addClass(dropdownDirective);
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
        $('[data-sh-index="0"]')
          .find(".nav__dropdown-list")
          .removeClass(dropdownDirective);
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
        $(`.nav__dropdown-tab[data-tab-group=${bindGroup}]`).addClass(
          tabDirective
        );
        target
          .closest(".nav__dropdown-list-wrapper.type-two")
          .find(".nav__dropdown-content-left.type-two")
          .addClass(tabDirective);
        target
          .closest(".nav__dropdown-list-wrapper.type-two")
          .find(".nav__dropdown-content-right.type-two")
          .addClass(tabDirective);
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
    $(`.nav__dropdown-tab[data-tab-group=${bindGroup}]`).toggleClass(
      tabDirective
    );
    target
      .closest(".nav__dropdown-list-wrapper.type-two")
      .find(".nav__dropdown-content-left.type-two")
      .toggleClass(tabDirective);
    target
      .closest(".nav__dropdown-list-wrapper.type-two")
      .find(".nav__dropdown-content-right.type-two")
      .toggleClass(tabDirective);
  }

  initNav();
})();
