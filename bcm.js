// blackfriday modal & contact

let sendBcm = document.querySelectorAll("[app='bcm']");

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
        send: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS9iMGs3cnBxLw==",
        phone: n.querySelector("[app='phone_campaign']").value,
        email: n.querySelector("[app='email_campaign']").value,
      },
      success: function (data) {
        console.log(data);
      },
    });
  });
});
