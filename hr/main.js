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
$(document).ready(function () {
  var boxEl = $('[data-box="job-cta"]');
  var slideUpAnimation = { duration: 0.3, bottom: "0", ease: "power1.out" };
  var slideDownAnimation = { duration: 0.3, bottom: "-100%", ease: "power1.out" };

  if ($(window).width() < 992) {
    boxEl.css({
      position: "fixed",
      top: "auto",
      bottom: "-100%", // initially hidden
    });

    ScrollTrigger.create({
      trigger: "#offer-hero",
      start: "bottom 90%", // starts when #offer-hero enters from the top
      end: "bottom 20%", // ends when #offer-hero leaves from top
      onLeave: () => gsap.to(boxEl, slideUpAnimation),
      onEnterBack: () => gsap.to(boxEl, slideDownAnimation),
      scrub: true,
    });

    ScrollTrigger.create({
      trigger: "#offer-footer",
      start: "top bottom", // starts when #offer-footer enters from the bottom
      end: "top top", // ends when #offer-footer reaches the top
      onEnter: () => gsap.to(boxEl, slideDownAnimation),
      onLeaveBack: () => gsap.to(boxEl, slideUpAnimation),
      scrub: true,
    });
  }
});
