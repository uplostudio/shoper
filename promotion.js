var Webflow = Webflow || [];
Webflow.push(function () {
  const promoTimeSelector = "[app='promo_time']";
  const dailyPromo = "[app='daily_promo']";
  const promoPriceSelector = "[app='promo_price']";
  const promoTitleSelector = "[app='promo_title']";
  const oldPriceYear = "[app='promo_title_old']";
  const newPriceYear = "[app='promo_title_new']";

  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "get_promotion",
    },
    success: function (data) {
      let discountPercentage = data.package.discount;
      let monthlyPromotion = data.package.price_promo.month;
      let yearlyStandardPrice = data.package.price.total;
      let yearlyPromoPrice = data.package.price_promo.total;

      document.title = `Sklep internetowy - Załóż sklep online z Shoper od ${monthlyPromotion} zł / miesiąc`;

      $(promoPriceSelector).text(` ${monthlyPromotion} `);

      $(dailyPromo).text(
        `Sklep internetowy ${discountPercentage} % taniej - Już od ${monthlyPromotion} zł miesięcznie!`
      );
      $(promoTitleSelector).text(
        `Roczny abonament sklepu ponad ${discountPercentage} taniej`
      );
      $(oldPriceYear).text(`${yearlyStandardPrice}`);
      $(newPriceYear).text(`${yearlyPromoPrice}`);

      let time = 0;
      // Update the count down every 1 second
      var x = setInterval(function () {
        // Find the distance between now and the count down date
        time++;
        let distance = data.timeleft - time;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor(distance / (60 * 60));
        var minutes = Math.floor((distance - hours * (60 * 60)) / 60);
        var seconds = Math.floor(distance - hours * 60 * 60 - minutes * 60);

        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        // Display the result in the element with id="demo"
        $(promoTimeSelector).text(
          "00:" + hours + ":" + minutes + ":" + seconds
        );

        // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
          $(promoTimeSelector).text("EXPIRED");
        }
      }, 1000);

      setTimeout(() => {
        $("[app='promo_banner']").css({
          opacity: 1,
          transform: "translate3d(0px, 0px, 0px)",
        });
      }, 1000);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log("error");
    },
  });
});
