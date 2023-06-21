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

window.addEventListener("load", () => {
  const excludedSubpages = [
    "/rodo",
    "/rodo/",
    "/zmien-oprogramowanie-sklepu",
    "/zmien-oprogramowanie-sklepu/",
    "/regulamin-kampanii/microsoft-advert/",
    "/regulamin-kampanii/google-ads/",
    "/oferta-shoper-plus/",
  ];

  const subpage = window.location.pathname;
  const body = document.querySelector("body");
  const intercomScript = document.createElement("script");

  if (!excludedSubpages.includes(subpage)) {
    intercomScript.src = "https://shoper-web.netlify.app/intercom.js";
    body.append(intercomScript);
  }
});
