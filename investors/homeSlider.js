// home slider
const progressBar = document.querySelector("[data-item='progress-indicator']");
const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,

  effect: "fade",
  fadeEffect: { crossFade: true },
  slidesPerView: "auto",
  centeredSlides: false,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  spaceBetween: 10,
  mousewheel: {
    forceToAxis: true,
  },
  speed: 300,
  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 480px
    480: {
      slidesPerView: "auto",
    },
    // when window width is >= 768px
    768: {
      slidesPerView: "auto",
    },
    // when window width is >= 992px
    992: {
      slidesPerView: "auto",
    },
  },

  // If we need pagination
  pagination: {
    el: ".swiper_pagination",
    type: "fraction",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-next",
    prevEl: ".swiper-prev",
  },
  on: {
    slideChange: function () {
      const slides = this.slides;
      for (let i = 0; i < slides.length; i++) {
        if (i === this.activeIndex) {
          slides[i].style.opacity = 1;
        } else {
          slides[i].style.opacity = 0;
        }
      }
    },
    autoplayTimeLeft(s, time, progress) {
      progressBar.style.setProperty("--progress", 1 - progress);
    },
  },
});
