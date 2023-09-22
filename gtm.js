// window.addEventListener("load", () => {
//   try {
//     let gtmBanner = document.querySelector("#top-bar-header");

//     gtmBanner.addEventListener("click", () => {
//       let bf = document.querySelector("[app='blackFriday']");
//       bf.classList.add("modal--open");
//       $(document.body).css("overflow", "hidden");
//     });
//   } catch (err) {}
// });

// remove sites from intercom

$(function () {
  var excludedSubpages = [
    "/rodo",
    "/rodo/",
    "/zmien-oprogramowanie-sklepu",
    "/zmien-oprogramowanie-sklepu/",
    "/regulamin-kampanii/microsoft-advert/",
    "/regulamin-kampanii/google-ads/",
    "/oferta-shoper-plus/",
    "/oferta-symfonia/",
    "/oferta-sklep-polaczony-z-allegro/",
    "sklep-internetowy-abonament/",
  ];

  var subpage = window.location.pathname;

  if ($.inArray(subpage, excludedSubpages) === -1) {
    $("body").append('<script src="https://shoper-web.netlify.app/intercom.js"></script>');
  }
});
