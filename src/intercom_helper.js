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
    "/cennik-sklepu-shoper",
    "/pelny-cennik-uslug-shoper",
    "/program-partnerski",
    "/program-partnerski/reseller",
    "/program-partnerski/afiliant",
    "/program-partnerski/tworca-aplikacji",
    "/new-components/forms",
    "/trustisto",
    "/statusy-i-odznaki",
    "/statusy",
    "/odznaki",
    "/lista-partnerow",
    "/katalog-partnerow",
    "/katalog-partnerow/lista-partnerow",
    "/oferty-black-friday-nowi-klienci",
    "/oferty-black-friday-obecni-klienci"
  ];

  var excludedDomains = [
    "q5mb64jfuh3c6ngf.webflow.io",
    "selium.eu"
  ];

  var currentUrl = window.location.href;
  var currentHostname = window.location.hostname;
  var currentPathname = window.location.pathname;

  // Check if the current hostname is in the excluded domains
  var isDomainExcluded = excludedDomains.some(function(domain) {
    return currentHostname === domain || currentHostname.endsWith('.' + domain);
  });

  // Check if the current pathname is in the excluded subpages
  var isSubpageExcluded = excludedSubpages.indexOf(currentPathname) !== -1;

  if (!isDomainExcluded && !isSubpageExcluded) {
    $("body").append('<script src="https://development--shoper-web.netlify.app/intercom.js"></script>');
  }
});
