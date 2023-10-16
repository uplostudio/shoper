$(window).on("scroll resize", function () {
  var width = $(window).width();
  var scrollPosition = $(window).scrollTop();

  if (width > 991 && scrollPosition > 100) {
    gsap.to("[data-element='hide-on-scroll']", { opacity: 0, duration: 0.25 });
  } else {
    gsap.to("[data-element='hide-on-scroll']", { opacity: 1, duration: 0.25 });
  }
});

function adjustBoxPosition() {
  if ($(window).width() > 991) {
    const viewportHeight = $(window).height();
    const $box = $("[data-box='details']");
    const boxHeight = $box.outerHeight();
    const boxPosition = 0.95 * viewportHeight - boxHeight;

    $box.css("top", Math.max(boxPosition, 0) + "px");
  }
}

// Trigger on window resize and on load
$(window).on("load resize", adjustBoxPosition);

// ScrollTrigger imported

gsap.registerPlugin(ScrollTrigger);

$(document).ready(function () {
  var boxEl = $('[data-box="job-cta"]');

  if ($(window).width() < 992) {
    boxEl.css({
      position: "fixed",
      bottom: "-100%",
    });

    var boxAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#offer-hero",
        start: "top 80%",
        end: "bottom 10%",
        toggleActions: "play none none reverse",
      },
    });

    boxAnimation.to(boxEl, { duration: 0.3, bottom: 0 });

    ScrollTrigger.create({
      trigger: "#offer-footer",
      start: "top 90%",
      onEnter: () => {
        gsap.to(boxEl, { duration: 0.3, bottom: "-100%" });
      },
    });
  }
});

$(window).on("scroll resize", function () {
  var width = $(window).width();
  var scrollPosition = $(window).scrollTop();

  if (width > 991 && scrollPosition > 100) {
    gsap.to("[data-element='hide-on-scroll']", { opacity: 0, duration: 0.25 });
  } else {
    gsap.to("[data-element='hide-on-scroll']", { opacity: 1, duration: 0.25 });
  }
});

function adjustBoxPosition() {
  if ($(window).width() > 991) {
    const viewportHeight = $(window).height();
    const $box = $("[data-box='details']");
    const boxHeight = $box.outerHeight();
    const boxPosition = 0.95 * viewportHeight - boxHeight;

    $box.css("top", Math.max(boxPosition, 0) + "px");
  }
}

// Trigger on window resize and on load
$(window).on("load resize", adjustBoxPosition);

// ScrollTrigger imported

gsap.registerPlugin(ScrollTrigger);

$(document).ready(function () {
  var boxEl = $('[data-box="job-cta"]');

  if ($(window).width() < 992) {
    boxEl.css({
      position: "fixed",
      bottom: "-100%",
    });

    var boxAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#offer-hero",
        start: "top 80%",
        end: "bottom 10%",
        toggleActions: "play none none reverse",
      },
    });

    boxAnimation.to(boxEl, { duration: 0.3, bottom: 0 });

    ScrollTrigger.create({
      trigger: "#offer-footer",
      start: "top 90%",
      onEnter: () => {
        gsap.to(boxEl, { duration: 0.3, bottom: "-100%" });
      },
    });
  }
});
