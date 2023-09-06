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

$(document).ready(function () {
  const excludedSubpages = [
    "/rodo",
    "/rodo/",
    "/zmien-oprogramowanie-sklepu",
    "/zmien-oprogramowanie-sklepu/",
    "/regulamin-kampanii/microsoft-advert/",
    "/regulamin-kampanii/google-ads/",
    "/oferta-shoper-plus/",
    "/oferta-symfonia/",
    "/oferta-sklep-polaczony-z-allegro/",
    "/sprzedaz-wielokanalowa/",
  ];

  let subpage = window.location.pathname;

  // Normalize paths to remove any trailing slashes
  subpage = subpage.endsWith("/") ? subpage.slice(0, -1) : subpage;
  const normalizedExcludedSubpages = $.map(excludedSubpages, (path) => (path.endsWith("/") ? path.slice(0, -1) : path));

  const intercomScript = $("<script></script>");
  intercomScript.attr("src", "https://shoper-web.netlify.app/intercom.js");

  if (!normalizedExcludedSubpages.some((path) => subpage.startsWith(path))) {
    $("body").append(intercomScript);
    console.log(subpage);
  }
});
