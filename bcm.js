// blackfriday modal & contact

let sendBcm = document.querySelectorAll("[app='bcm-submit']");

sendBcm.forEach((n) => {
  n.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    $.ajax({
      url: "https://www.shoper.pl/ajax.php",
      headers: {},
      method: "POST",
      data: {
        action: "bcm22-2",
        subject: "Black Promocja Sklep plus Grafika za 499 zł",
        phone: n.querySelector("[app='phone_campaign']").value,
        email: n.querySelector("[app='email_campaign']").value,
      },
      succes: function (data) {
        if (data.code === 2) {
          console.log(data);
        } else {
          console.log(data);
        }
      },
    });
  });
});
