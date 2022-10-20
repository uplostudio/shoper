var Webflow = Webflow || [];
Webflow.push(function () {
  const promoTimeSelector = "[app='promo_time']";
  const promoPriceSelector = "[app='promo_price']";
  const promoTitleSelector = "[app='promo_title']";

  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "get_promotion"
    },
    success: function (data) {
//       console.log(data);
      $(promoTitleSelector).text(data.title);
      $(promoPriceSelector).text(data.package.price_promo.month);

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
          transform: "translate3d(0px, 0px, 0px)"
        });
      }, 1000);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("error");
    }
  });
});
