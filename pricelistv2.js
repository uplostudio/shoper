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

function setPrice(fields, prices, isGross, isYearly, promotion) {
    fields.forEach((field)=>{
        const isOnetime = ["standard_onetime", "premium_onetime", "enterprise_onetime"].includes(field);
        const priceType = isOnetime ? "onetimenet" : isGross ? (isYearly ? "yeargross" : "monthgross") : isYearly ? "yearnet" : "monthnet";
        const priceValue = prices[field][priceType];
        let price = priceValue;

        if (promotion && promotion.active === 1 && promotion.price[field]) {
            const priceTypePromotion = isYearly ? "year" : "month";
            const promotionPriceValue = parseFloat(promotion.price[field]["12"][priceTypePromotion][isGross ? "gross" : "net"]);

            if (promotionPriceValue) {
                price = promotionPriceValue;
            }
        }
        $("[data-field='" + field + "']").html(formatPrice(price, isOnetime));
    }
    );
    const labelText = isGross ? (isYearly ? "brutto rocznie" : "brutto miesięcznie") : isYearly ? "netto rocznie" : "netto miesięcznie";
    $("[data-field='label']").text(labelText);
}

function populateDiscounts(response) {
    const {promotion, price} = response;

    if (promotion && promotion.active === 1) {
        ["standard", "premium", "enterprise"].forEach((field)=>{
            if (promotion.price[field]) {
                $("[data-field='" + field + "_discount']").text(promotion.price[field].discount + "% taniej");
            }
        }
        );
    }
}

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
        const fields = ["promotion", "standard", "standard_onetime", "premium", "premium_onetime", "enterprise", "enterprise_onetime"];

        fields.forEach((field)=>{
            populateDiscounts(response);
            if (field === "promotion") {
                if (promotion && promotion.active === 1) {
                    originalPrices[field] = {
                        monthnet: parseFloat(promotion.price.standard["12"].month.net),
                        monthgross: parseFloat(promotion.price.standard["12"].month.gross),
                        yearnet: parseFloat(promotion.price.standard["12"].year.net),
                        yeargross: parseFloat(promotion.price.standard["12"].year.gross),
                    };
                } else {
                    originalPrices[field] = {
                        monthnet: parseFloat(price[field]["12"].month.net),
                        monthgross: parseFloat(price[field]["12"].month.gross),
                        yearnet: parseFloat(price[field]["12"].year.net),
                        yeargross: parseFloat(price[field]["12"].year.gross),
                    };
                }
            } else if (field.includes("_onetime")) {
                const baseField = field.replace("_onetime", "");
                originalPrices[field] = {
                    onetimenet: parseFloat(price[baseField]["1"].net),
                };
            } else {
                originalPrices[field] = {
                    monthnet: parseFloat(price[field]["12"].month.net),
                    monthgross: parseFloat(price[field]["12"].month.gross),
                    yearnet: parseFloat(price[field]["12"].year.net),
                    yeargross: parseFloat(price[field]["12"].year.gross),
                };
            }
        }
        );

        let isGross = false;
        let isYearly = false;

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
            setPrice(fields, originalPrices, isGross, isYearly, promotion);
        });

        $("[data-field='loader']").css("display", "none");
    }
});
