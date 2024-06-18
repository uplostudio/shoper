$(document).ready(function () {
  var spanUnderlined = $("span.is-underlined");
  var underlineEl = $("#special-underline");

  spanUnderlined.each(function () {
    $(this).css("position", "relative"); // Ensuring the span is relative for absolute positioning of child
    let cloneEl = underlineEl.clone().removeAttr("id"); // clone and remove id to avoid duplicate ids
    cloneEl.css({
      display: "flex",
      bottom: "-0.5rem",
    });
    $(this).append(cloneEl);

    var pathEl = cloneEl.find("path")[0]; // should select the path of the cloned element

    var length = pathEl.getTotalLength();
    pathEl.style.transition = "none";
    pathEl.style.strokeDasharray = length + " " + length;
    pathEl.style.strokeDashoffset = length;
    pathEl.getBoundingClientRect();
    pathEl.style.transition = "stroke-dashoffset 1s ease-in-out";
    pathEl.style.strokeDashoffset = "0";
  });

  underlineEl.remove(); // remove the original #special-underline div
});

gsap.registerPlugin(ScrollTrigger);

// Hide all images initially
$(".slider-image").css({ opacity: 0 });

// Only the first image is visible
$("#i-1").css({ opacity: 1 });
try {
  var scroller = document.querySelector(".slider_text-wrapper-box");

  if (!scroller) {
    console.error("Scroll container not found");
  } else {
    $(".slider_text-wrapper-box > .slide_text-wrapper").each(function (index, element) {
      if (!element || !document.getElementById("i-" + (index + 1))) {
        console.error("Text wrapper or image not found", { index, element });
      } else {
        // Trigger for scrolling down
        ScrollTrigger.create({
          trigger: element,
          scroller: scroller,
          start: "top 70%",
          end: "bottom center",
          onEnter: () => {
            $(".slide_text-wrapper").removeClass("active");
            $(element).addClass("active");
            gsap.to(".slider-image", { opacity: 0, duration: 0.3 });
            gsap.to("#i-" + (index + 1), { opacity: 1, duration: 0.3 });
          },
          onLeave: (self) => {
            if (self.isActive) {
              $(element).removeClass("active");
              gsap.to("#i-" + (index + 1), { opacity: 0, duration: 0.3 });
            }
          },
        });

        // Trigger for scrolling up
        ScrollTrigger.create({
          trigger: element,
          scroller: scroller,
          start: "top 1%",
          end: "top center",
          onEnterBack: () => {
            $(".slide_text-wrapper").removeClass("active");
            $(element).addClass("active");
            gsap.to(".slider-image", { opacity: 0, duration: 0.3 });
            gsap.to("#i-" + (index + 1), { opacity: 1, duration: 0.3 });
          },
          onLeaveBack: (self) => {
            if (self.isActive) {
              $(element).removeClass("active");
              gsap.to("# " + (index + 1), { opacity: 0, duration: 0.3 });
            }
          },
        });
        ScrollTrigger.refresh();
      }
    });
  }
} catch (err) {}

$(document).ready(function () {
  var listEl = $('[fs-cmsfilter-element="list"]')[0];
  var initialCount = listEl.children.length;
  $('[data-link="all"]').text(initialCount);
  $('[fs-cmsfilter-element="clear"]').find(".offer_count-box.is-offer").text(initialCount);

  $(".offers_category-wrapper .flex-h.sb.w-radio").each(function () {
    var locality = $(this).find(".city-label").text().trim();
    var count = 0;

    $("[data-link='open-role']").each(function () {
      $(this)
        .find("[data-list='location']")
        .each(function () {
          $(this)
            .find("div[fs-cmsfilter-field='lokalizacja']")
            .each(function () {
              if ($(this).text().trim() === locality) {
                count++;
              }
            });
        });
    });

    $(this).find(".offer_count-box.is-offer").text(count);

    if (count === 0) {
      $(this).remove();
    }
  });

  var observer = new MutationObserver(function () {
    var currentLength = listEl.children.length;
    if (currentLength === initialCount) {
      $('[fs-cmsfilter-element="clear"]').css("font-weight", "700");
      $('[data-link="all"]').toggleClass("is-invert", true);
    } else {
      $('[fs-cmsfilter-element="clear"]').css("font-weight", "normal");
      $('[data-link="all"]').toggleClass("is-invert", false);
    }
  });

  observer.observe(listEl, { childList: true });
});
