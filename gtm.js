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
  let subpage = window.location.pathname;
  let body = document.querySelector("body");

  if (subpage !== "/rodo" && subpage !== "/rodo/" && subpage !== "/zmien-oprogramowanie-sklepu" && subpage !== "/zmien-oprogramowanie-sklepu/") {
    let intercomSrc = "https://shoper-web.netlify.app/intercom.js";
    let intercomScript = document.createElement("script");
    intercomScript.src = intercomSrc;
    body.append(intercomScript);
  } else {
  }
});
