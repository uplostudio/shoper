$(document).ready(function () {
  updateDisclaimer();
});

const pathnameGroups = {
  group1: ["/kampanie-ppc/", "/shoper-kampanie/", "/google-shopping/", "/microsoft-ads/", "/facebook/", "/instagram/", "/reklama-tiktok/"],
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

  if (currentGroup === "group1") {
    const dataItem = $("[data-item='disclaimer']");
    const disclaimerLink1 = `<a href="https://www.shoper.pl/static/rodo/Shoper_klauzula_informacyjna_osoby_korespondujace_z_Shoper.pdf" target="_blank" class="inline-link">informacją na temat przetwarzania twoich danych osobowych</a>`;
    const disclaimerLink2 = `<a href="https://www.shoper.pl/static/regulaminy/ogloszenie-o-promocji-shoper-kampanie-oferta-noworoczna-2023-2024.pdf" target="_blank" class="inline-link"> ogłoszenie o promocji Oferta Noworoczna 2023/2024.</a>`;
    const disclaimerText = `Wysyłając wiadomość potwierdzasz zapoznanie się z ${disclaimerLink1} oraz ${disclaimerLink2}`;

    dataItem.html(disclaimerText);

    const prependHTML = `<div class="badge-new is-new-pricing"><div><strong>Teraz darmowa konsultacja + 50% rabatu na obsługę</strong></div></div>`;
    const parentForm = dataItem.closest("form");
    parentForm.prepend(prependHTML);
  }
}
