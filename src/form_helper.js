$(document).ready(function () {
  updateDisclaimer();
  changeSubmitValue();
});

const pathnameGroups = {
  group2: [
    "/systemy-platnosci",
    "/kurierzy",
    "/domena",
    "/certyfikaty-ssl",
    "/klarna",
    "/systemy-platnosci/google-pay",
    "/systemy-platnosci/paypo",
    "/shoper-connect",
    "/apilo",
    "/autopay",
    "/przelewy24",
  ],
};

function getGroupForPathname(pathname) {
  for (const [group, pathnames] of Object.entries(pathnameGroups)) {
    let pathnamesWithoutSlash = pathnames.map((path) => (path.endsWith("/") ? path.slice(0, -1) : path));
    let isInGroup = pathnamesWithoutSlash.some((path) => pathname.startsWith(path));

    if (isInGroup) {
      return group;
    }
  }
}

function updateDisclaimer() {
  let currentPathname = window.location.pathname;
  const currentGroup = getGroupForPathname(currentPathname);
  const dataItem = $("[data-item='disclaimer']");

  if (currentGroup === "group2") {
    const disclaimerHTML = `<div>Nie masz jeszcze sklepu? <a href="/cennik-sklepu-shoper" class="inline-link">Wypróbuj go za darmo</a></div>`;
    dataItem.html(disclaimerHTML);
  }
}

function changeSubmitValue() {
  let submitInput = $("[data-app='login']").find("input[type='submit']");
  if(submitInput.length) {
      submitInput.val('Zaloguj się');
  }
}


// Price list hotifx

$(document).ready(function() {
  $('[card="enterprise"]')
    .find('.pricelist__perks-list')
    .children()
    .first()
    .find('.text-size-regular')
    .text('500 000 produktów');
});
