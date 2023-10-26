// hero

$(function () {
  var scrollSpeed = 120; // Adjust speed

  ["bottom", "top"].forEach(function (animationType) {
    var direction = animationType === "bottom" ? 1 : -1;

    $('[data-animation="' + animationType + '"]').each(function (index, elem) {
      var $elem = $(elem);

      // Clone children to make animation look infinite
      var children = $elem.children().clone();
      $elem.append(children);

      var totalHeight = 0;

      $elem.children().each(function () {
        totalHeight += $(this).outerHeight(true);
      });

      var halfHeight = totalHeight / 2;

      // Initial positioning
      gsap.set($elem, { y: direction > 0 ? 0 : -halfHeight });

      // Setup the animation
      gsap.to($elem, {
        duration: scrollSpeed,
        y: direction > 0 ? -halfHeight : 0,
        repeat: -1, // Run the animation forever
        ease: "none",
      });
    });
  });
});

// main video animation

$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(
    {},
    {
      scrollTrigger: {
        trigger: "#custom-video",
        start: "top bottom", // when the top of the trigger hits the bottom of the viewport
        onEnter: function () {
          $("#custom")[0].play(); // play the video
        },
        onLeaveBack: function () {
          $("#custom")[0].pause(); // pause the video
        },
      },
    }
  );
});

// dot and images above the footer

$(document).ready(function () {
  var footerElement = document.querySelector('[data-section="footer"]');

  // Animation for the dot
  const animateDot = (element) =>
    gsap.to(element, {
      scale: 1,
      duration: 0.5,
      ease: "power1.out",
      transformOrigin: "center",
      stagger: 0.15,
    });

  // Animation for .img-wrapper
  const animateImgWrapper = (element) =>
    gsap.to(element, {
      y: "0%",
      opacity: 1,
      duration: 0.5,
      ease: "power1.out",
      stagger: 0.15,
      onComplete: () => {
        gsap.to(element, {
          y: "10%",
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: "sine.inOut",
        });
      },
    });

  // Find the dot and .img-wrapper elements
  // const dots = document.querySelectorAll('[data-animation="dot"]');
  const imgWrappers = document.querySelectorAll(".img_wrapper");

  // Initialize the dot and .img-wrapper animations once the footer is visible
  ScrollTrigger.create({
    trigger: footerElement,
    start: "top bottom", // Start when the top of the footer hits the bottom of the viewport
    onEnter: () => {
      // dots.forEach((dot) => animateDot(dot));
      imgWrappers.forEach((imgWrapper) => animateImgWrapper(imgWrapper));
    },
  });

  // gsap.set(dots, { scale: 0 });
  gsap.set(imgWrappers, { y: "100%", opacity: 0 });
  ScrollTrigger.refresh();
});

// scroller for text blocks

$(document).ready(function () {
  // Define Intersection Observer options
  var observerOptions = {
    root: document.querySelector('[data-item="scroller"]'), // Parent container
    rootMargin: "0px", // Margin around the root
    threshold: 0.8, // Trigger when the visible part of the target element is 100%
  };

  // Intersection Observer callback
  var observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // If element is fully visible
        gsap.to(entry.target, { opacity: 1, duration: 0.3 }); // Animate opacity to 100%
      } else {
        // If element is not fully visible
        gsap.to(entry.target, { opacity: 0.1, duration: 0.3 }); // Animate opacity gradually to 20%
      }
    });
  };

  // Create Intersection Observer
  var observer = new IntersectionObserver(observerCallback, observerOptions);

  // Add all children of the scrollable element to the observer
  const children = document.querySelectorAll('[data-item="scroller"] > *');
  children.forEach((child) => {
    gsap.set(child, { opacity: 0.1 }); // Set initial opacity to 20%
    observer.observe(child); // Start observing the child
  });
});

// hero mouse anumation

$(document).ready(function () {
  function animateDiv() {
    $("[data-item='mouse']").animate(
      { top: "+=8" },
      {
        duration: 1200,
        complete: function () {
          $("[data-item='mouse']").animate(
            { top: "-=8" },
            {
              duration: 1200,
              complete: animateDiv,
            }
          );
        },
        easing: "swing",
      }
    );
  }
  animateDiv();
});

// Register ScrollTrigger in GSAP
gsap.registerPlugin(ScrollTrigger);

// GSAP Timeline for Dot Animation
const animateDotTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '[data-animation="dot"]',
    start: "top bottom",
    end: () => "+=" + document.documentElement.scrollHeight * 0.1,
    scrub: true,
  },
});

// Animate dot and content
animateDotTimeline
  .to('[data-animation="dot"]', {
    width: "100vw",
    height: "100vh",
    borderRadius: "0",
    duration: 2,
    ease: "none",
  })
  .to(
    '[data-item="dot-content"]',
    {
      opacity: 1,
      duration: 2,
      ease: "none",
    },
    "-=2"
  );

// type effect

$(document).ready(function () {
  let wordArray = ["ulepszaj", "zmieniaj", "sprzedawaj", "planuj"];
  let wordIndex = 0;
  let letterIndex = 0;
  let currentWord = "";
  let currentLetter = "";
  let isDeleting = false;

  (function type() {
    currentWord = wordArray[wordIndex];
    currentLetter = isDeleting ? currentWord.slice(0, letterIndex--) : currentWord.slice(0, ++letterIndex);

    $('[data-item="typing"]').html(currentLetter + '<span class="blinking-cursor">|</span>');

    if (!isDeleting && letterIndex === currentWord.length) {
      setTimeout(() => (isDeleting = true), 1000); // Pause before start deleting
    } else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordArray.length; // Move to the next word
    }

    let timeout = isDeleting ? 120 : 160; // Adjust speed of deleting and adding.
    setTimeout(type, timeout);
  })();
});
