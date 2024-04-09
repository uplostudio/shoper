// navbar

topBar = $('[data-item="topbar"]');
lastScroll = 0;
let scrollThreshold = 140;
let windowWidthLimit = 992;
let animationDuration = 0.1;

$(window).scroll(function () {
  let currentScroll = $(this).scrollTop();

  if ($(this).width() > windowWidthLimit) {
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      gsap.to(topBar, { height: 0, duration: animationDuration });
    } else if (currentScroll < lastScroll && lastScroll > scrollThreshold) {
      gsap.to(topBar, { height: "auto", duration: animationDuration });
    }

    lastScroll = currentScroll;
  }
});
