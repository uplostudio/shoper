const LANG = $("html").attr("lang");

const TRANSLATIONS = {
  pl: {
    currency: "zł",
    monthGross: "brutto miesięcznie",
    monthNetto: "netto miesięcznie",
    discount: '%s% taniej',
    priceMode: 'Pokaż ceny brutto'
  },
  en: {
    currency: "PLN",
    monthGross: "gross monthly",
    monthNetto: "net monthly",
    discount: 'save %s%',
    priceMode: "Show gross prices"
  }
};

function formatPrice(price, isOnetime) {
    let priceFormatted = price - Math.floor(price) > 0 ? price.toFixed(2).replace(".", ",") : Number(price).toString();
    let parts = priceFormatted.split(",");
    if (isOnetime) {
        return priceFormatted + " " + TRANSLATIONS[LANG].currency;
    } else if (parts[1]) {
        return parts[0] + '<span class="pricelist__span">,' + parts[1] + '</span> <span class="size3">' + TRANSLATIONS[LANG].currency + '</span>';
    } else {
        return parts[0] + ' <span class="size3">' + TRANSLATIONS[LANG].currency + '</span>';
    }
}

function setPrice(fields, prices, isGross, isYearly, promotion) {

    fields.forEach((field)=>{
        const isOnetime = ["standard_onetime", "premium_onetime", "enterprise_onetime"].includes(field);
        const priceType = isOnetime ? 
            isGross ? (isYearly ? "onetimeGrossYear" : "onetimeGrossMonth") : isYearly ? "onetimeNetYear" : "onetimeNetMonth" :
            isGross ? (isYearly ? "yeargross" : "monthgross") : isYearly ? "yearnet" : "monthnet";

        const priceValue = prices[field][priceType];
        let price = priceValue;

        if (promotion && promotion.active === 1 && promotion.price[field]) {
            const priceTypePromotion = isYearly ? "year" : "month";
            const promotionPriceValue = isYearly ?
                parseFloat(prices[field][isGross ? "yeargross" : "yearnet"]) :
                parseFloat(promotion.price[field]["12"][priceTypePromotion][isGross ? "gross" : "net"]);

            if (promotionPriceValue) {
                price = promotionPriceValue;
            } 
        } 

        $("[data-field='" + field + "']").html(formatPrice(price, isOnetime));
    }
    );
    const labelText = isGross ? TRANSLATIONS[LANG].monthGross : TRANSLATIONS[LANG].monthNetto;
    $("[data-field='label']").text(labelText);
}

function populateDiscounts(response) {
    const { promotion, price } = response;

    ["standard", "premium", "enterprise"].forEach((field) => {
        let discount = "";
        if (promotion && promotion.price && promotion.price[field]) {
            discount = promotion.price[field].discount;
        } else if (price && price[field]) {
            discount = price[field].discount;
        }
        $("[data-field='" + field + "_discount']").text(TRANSLATIONS[LANG].discount.replace('%s', discount));
    });
}

$( document ).ready( function() {
  $.ajax({
      url: "https://backend.webflow.prod.shoper.cloud",
      data: {
          action: "get_prices_list",
      },
      type: "POST",
      dataType: "json",
      success: function(response) {

          const {promotion, price} = response;
          let originalPrices = {};
          const fields = [ "standard", "standard_onetime", "premium", "premium_onetime", "enterprise", "enterprise_onetime"];

          fields.forEach((field)=>{
              populateDiscounts(response);
              if (field === "promotion") {
                  if (promotion && promotion.active === 1) {
                      originalPrices[field] = {
                          monthnet: parseFloat(promotion.price.standard["12"].month.net),
                          monthgross: parseFloat(promotion.price.standard["12"].month.gross),
                     
                      };
                  } else {
                      originalPrices[field] = {
                          monthnet: parseFloat(price[field]["1"].net),
                          monthgross: parseFloat(price[field]["1"].gross),
                   
                      };
                  }
              } else if (field.includes("_onetime")) {
                  const baseField = field.replace("_onetime", "");
                  originalPrices[field] = {
                      onetimeNetMonth: parseFloat(price[baseField]["1"].net),
                      onetimeGrossMonth: parseFloat(price[baseField]["1"].gross),
                      onetimeNetYear: parseFloat(price[baseField]["12"].year.net),
                      onetimeGrossYear: parseFloat(price[baseField]["12"].year.gross),
                  };
              } else {
                  originalPrices[field] = {
                      monthnet: parseFloat(price[field]["12"].month.net),
                      monthgross: parseFloat(price[field]["12"].month.gross),
                      yearnet: parseFloat(price[field]["1"].net),
                      yeargross: parseFloat(price[field]["1"].gross),
                  };
              }
          }
          );

          let isGross = false;
          let isYearly = false;
          console.log( originalPrices );
          // Initial price setting
          setPrice(fields, originalPrices, isGross, isYearly, promotion);

          // Change price mode on click
          $('a[data-toggle="price-mode"]').on("click", function(e) {
              e.preventDefault();
              const priceMode = $(this);
              priceMode.toggleClass("is-on").find(".toggle-ball").toggleClass("is-on");
              isGross = !isGross;
              setPrice(fields, originalPrices, isGross, isYearly, promotion);
          });

          // Change billing period on click
          $('a[data-toggle="billing-period"]').on("click", function(e) {
              e.preventDefault();
              const billingPeriod = $(this);
              billingPeriod.toggleClass("is-on").find(".toggle-ball").toggleClass("is-on");
              isYearly = !isYearly;
              let elementsWithOnetime = $('[data-field]').filter(function() {
                return $(this).data('field').indexOf('_onetime') !== -1;
              });

              let elementsWithDiscount = $('[data-field]').filter(function() {
                return $(this).data('field').indexOf('_discount') !== -1;
              });

              if( isYearly ) {
                elementsWithOnetime.css( "visibility", "hidden" );
                elementsWithDiscount.parent().css( "visibility", "hidden" );
              } else {
                elementsWithOnetime.css( "visibility", "visible" );
                elementsWithDiscount.parent().css( "visibility", "visible" );
              }
              setPrice(fields, originalPrices, isGross, isYearly, promotion);
          });

          $("[data-field='loader']").css("display", "none");
      }
});
});