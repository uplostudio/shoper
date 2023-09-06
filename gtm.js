// without this, dataLayer sometimes gets 'undefined'

window.dataLayer = window.dataLayer || [];

window.addEventListener("load", () => {
  try {
    let gtmBanner = document.querySelector("#top-bar-header");

    gtmBanner.addEventListener("click", () => {
      let bf = document.querySelector("[app='blackFriday']");
      bf.classList.add("modal--open");
      $(document.body).css("overflow", "hidden");
    });
  } catch (err) {}
});

// remove sites from intercom

$(window).on("load", function () {
  const excludedSubpages = [
    "/rodo/",
    "/zmien-oprogramowanie-sklepu/",
    "/regulamin-kampanii/microsoft-advert/",
    "/regulamin-kampanii/google-ads/",
    "/oferta-shoper-plus/",
    "/oferta-symfonia/",
    "/oferta-sklep-polaczony-z-allegro/",
    "/sprzedaz-wielokanalowa/",
  ];

  let subpage = window.location.pathname;
  // Ensure subpage always ends with '/'
  if (!subpage.endsWith("/")) {
    subpage += "/";
  }

  if (!excludedSubpages.some((path) => subpage.startsWith(path))) {
    let intercomScript = $("<script>", { src: "https://shoper-web.netlify.app/intercom.js" });
    $("body").append(intercomScript);
  }
});
