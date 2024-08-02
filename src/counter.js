function createCountdown(element, targetDate) {
  var $elem = $(element);
  var targetTime = targetDate.getTime();
  var intervalId = null;
  var lastValues = { day: null, hour: null, min: null, sec: null };

  function updateTime() {
    var now = new Date().getTime();
    var difference = targetTime - now;

    if (difference < 0) {
      clearInterval(intervalId);
      difference = 0; // To display "0" when the countdown is over.
    }

    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (lastValues.day !== days) {
      $elem.find('[data-item="day"]').text(days);
      lastValues.day = days;
    }
    if (lastValues.hour !== hours) {
      $elem.find('[data-item="hour"]').text(hours);
      lastValues.hour = hours;
    }
    if (lastValues.min !== minutes) {
      $elem.find('[data-item="min"]').text(minutes);
      lastValues.min = minutes;
    }
    if (lastValues.sec !== seconds) {
      $elem.find('[data-item="sec"]').text(seconds);
      lastValues.sec = seconds;
    }
  }

  updateTime();
  intervalId = setInterval(updateTime, 1000);
}

// Usage:
// sklep-z-konsultacja
createCountdown($("[data-item='counter-box-1']"), new Date("Nov 19, 2023 23:59:59"));
// sklep-90-taniej
createCountdown($("[data-item='counter-box-2']"), new Date("Nov 30, 2023 23:59:59"));
// sklep-92-taniej
createCountdown($("[data-item='counter-box-3']"), new Date("Nov 27, 2023 23:59:59"));
// sklep-premium-aplikacje
createCountdown($("[data-item='counter-box-4']"), new Date("Nov 23, 2023 23:59:59"));
// sklep-premium-30-taniej
createCountdown($("[data-item='counter-box-5']"), new Date("Nov 30, 2023 23:59:59"));

// GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Defining the elements
let counterBoxSticky = $("[data-item='counter-box-sticky']");
let heroSection = $("[data-section='hero']");

// ScrollTrigger
ScrollTrigger.create({
  trigger: heroSection[0],
  start: "top top",
  end: "bottom top",
  onEnter: ({ progress, direction, isActive }) => {
    // if user is scrolling up and hits the top of the page
    if (direction === -1) {
      gsap.to(counterBoxSticky[0], {
        opacity: 0,
        display: "none",
        duration: 0.35,
      });
    }
  },
  onLeave: ({ progress, direction, isActive }) => {
    gsap.to(counterBoxSticky[0], {
      opacity: 1,
      display: "flex",
      duration: 0.35,
    });
  },
  onEnterBack: ({ progress, direction, isActive }) => {
    gsap.to(counterBoxSticky[0], {
      opacity: 0,
      display: "none",
      duration: 0.1,
    });
  },
  onLeaveBack: ({ progress, direction, isActive }) => {
    // if user is scrolling down past the trigger point
    if (direction === 1) {
      gsap.to(counterBoxSticky[0], {
        opacity: 1,
        display: "flex",
        duration: 0.35,
      });
    }
  },
});

let ctaSection = $("[data-item='section-cta']");
let counterBoxStickyButton = counterBoxSticky.find("#to-hide");
console.log(counterBoxStickyButton);

ScrollTrigger.create({
  trigger: ctaSection[0],
  start: "top bottom", // The top of the CTA section hits the bottom of the viewport
  end: "bottom top", // The bottom of the CTA section hits the top of the viewport
  onEnter: () => {
    gsap.to(counterBoxStickyButton[0], {
      // Fade out
      opacity: 0,
      duration: 0.35,
    });
  },
  onLeave: () => {
    gsap.to(counterBoxStickyButton[0], {
      // Fade in
      opacity: 1,
      duration: 0.35,
    });
  },
  onEnterBack: () => {
    gsap.to(counterBoxStickyButton[0], {
      // Fade out
      opacity: 0,
      duration: 0.35,
    });
  },
  onLeaveBack: () => {
    gsap.to(counterBoxStickyButton[0], {
      // Fade in
      opacity: 1,
      duration: 0.35,
    });
  },
});
