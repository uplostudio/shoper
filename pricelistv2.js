function formatPrice(price, isOnetime) {
  let priceFormatted = price - Math.floor(price) > 0 ? price.toFixed(2).replace(".", ",") : Number(price).toString();
  let parts = priceFormatted.split(",");

  if (isOnetime) {
    return priceFormatted + " zł";
  } else if (parts[1]) {
    return parts[0] + '<span class="pricelist__span">,' + parts[1] + '</span> <span class="size3">zł</span>';
  } else {
    return parts[0] + ' <span class="size3">zł</span>';
  }
}

function setPrice(fields, prices, isGross, isYearly) {
  fields.forEach((field) => {
    const isOnetime = ["standard_onetime", "premium_onetime", "enterprise_onetime"].includes(field);
    const priceType = isOnetime ? "onetimenet" : isGross ? (isYearly ? "yeargross" : "monthgross") : isYearly ? "yearnet" : "monthnet";
    const price = prices[field][priceType];
    $("[data-field='" + field + "']").html(formatPrice(price, isOnetime));
  });
  const labelText = isGross ? (isYearly ? "brutto rocznie" : "brutto miesięcznie") : isYearly ? "netto rocznie" : "netto miesięcznie";
  $("[data-field='label']").text(labelText);
}

function populateDiscounts(response) {
  const standardDiscount = response.promotion.price.standard.discount;
  // const premiumDiscount = response.price.premium.discount;
  const enterpriseDiscount = response.price.enterprise.discount;

  $("[data-field='promotion_discount']").text(standardDiscount + "% taniej");
  $("[data-field='standard_discount']").text(standardDiscount + "% taniej");
  $("[data-field='enterprise_discount']").text(enterpriseDiscount + "% taniej");
}

$.ajax({
  url: "https://www.shoper.pl/ajax.php",
  data: {
    action: "get_prices_list",
  },
  type: "POST",
  dataType: "json",
  success: function (response) {
    let originalPrices = {};
    const fields = ["promotion", "standard", "standard_onetime", "premium", "premium_onetime", "enterprise", "enterprise_onetime"];

    fields.forEach((field) => {
      populateDiscounts(response);
      if (field === "promotion") {
        originalPrices[field] = {
          monthnet: parseFloat(response.promotion.price.standard["12"].month.net),
          monthgross: parseFloat(response.promotion.price.standard["12"].month.gross),
          yearnet: parseFloat(response.promotion.price.standard["12"].year.net),
          yeargross: parseFloat(response.promotion.price.standard["12"].year.gross),
        };
      } else if (field.includes("_onetime")) {
        const baseField = field.replace("_onetime", "");
        originalPrices[field] = {
          onetimenet: parseFloat(response.price[baseField]["1"].net),
        };
      } else {
        originalPrices[field] = {
          monthnet: parseFloat(response.price[field]["12"].month.net),
          monthgross: parseFloat(response.price[field]["12"].month.gross),
          yearnet: parseFloat(response.price[field]["12"].year.net),
          yeargross: parseFloat(response.price[field]["12"].year.gross),
        };
      }
    });

    let isGross = false;
    let isYearly = false;

    setPrice(fields, originalPrices, isGross, isYearly);

    $('a[data-toggle="price-mode"]').on("click", function (e) {
      e.preventDefault();

      const priceMode = $(this);
      const toggleBall = priceMode.find(".toggle-ball");

      priceMode.toggleClass("is-on");
      toggleBall.toggleClass("is-on");

      isGross = !isGross;
      setPrice(fields, originalPrices, isGross, isYearly);
    });

    $('a[data-toggle="billing-period"]').on("click", function (e) {
      e.preventDefault();

      const billingPeriod = $(this);
      const toggleBall = billingPeriod.find(".toggle-ball");

      billingPeriod.toggleClass("is-on");
      toggleBall.toggleClass("is-on");

      isYearly = !isYearly;
      setPrice(fields, originalPrices, isGross, isYearly);
    });
    $("[data-field='loader']").css("display", "none");
  },
});
