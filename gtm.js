// remove sites from intercom

$(function () {
  var excludedSubpages = [
    "/rodo",
    "/zmien-oprogramowanie-sklepu",
    "/regulamin-kampanii/microsoft-advert",
    "/regulamin-kampanii/google-ads",
    "/oferta-shoper-plus",
    "/oferta-symfonia",
    "/oferta-sklep-polaczony-z-allegro",
    "/sklep-internetowy-abonament",
    "/witajwshoper",
    "/storefront",
    "/kampanie-ppc",
    "/pozycjonowanie-sklepow-internetowych",
    "/cennik-sklepu-shoper"
  ];

  var subpage = window.location.pathname;

  if ($.inArray(subpage, excludedSubpages) === -1) {
    $("body").append('<script src="https://development--shoper-web.netlify.app/intercom.js"></script>');
  }
});
