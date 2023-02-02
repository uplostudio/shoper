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

let subpage = window.location.pathname;
let head = document.querySelector("head");
let scripts = head.querySelectorAll("script");

if (subpage !== "/rodo") {
  let intercomSrc = "https://shoper-web.netlify.app/intercom.js";
  let intercomScript = document.createElement("script");
  intercomScript.src = intercomSrc;
  head.append(intercomScript);
} else {
}
