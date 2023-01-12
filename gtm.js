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

setInterval(function () {
  try {
    let menu = document.querySelector(".nav__menu");
    let banner = document.querySelector("#top-bar-header");
    bannerHeightString = window.getComputedStyle(banner).height;
    bannerHeightValue = parseInt(bannerHeightString);

    if (window.innerWidth <= 991 && window.scrollY < 30) {
      menu.style.height = `${window.innerHeight - bannerHeightValue}px`;
      console.log(menu.style.height);
    } else {
      menu.style.height = `${window.innerHeight}px`;
    }
  } catch (err) {}
}, 100);
