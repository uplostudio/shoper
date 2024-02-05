$(document).ready(function () {
  updateDisclaimer();
});

const pathnameGroups = {
  group2: [
    "/systemy-platnosci/",
    "/kurierzy/",
    "/domena/",
    "/certyfikaty-ssl/",
    "/klarna/",
    "/systemy-platnosci/google-pay/",
    "/systemy-platnosci/paypo/",
    "/shoper-connect/",
    "/apilo/",
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
    const disclaimerHTML = `<div>Nie masz jeszcze sklepu? <a href="https://www.shoper.pl/cennik-sklepu-shoper/" class="inline-link">Wypróbuj go za darmo</a></div>`;
    dataItem.html(disclaimerHTML);
  }
}
