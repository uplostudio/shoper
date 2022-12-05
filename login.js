// Required Attributes: form[app='login'], input[app='host']

$("[app='open_login_modal_button']").on("click", function () {
  $("[app='login_modal'").addClass("modal--open");
});

$("[app='login']").on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  const errorInfo = $(this).find(".w-form-fail");

  let rawValue = document.querySelector("[app='host']").value;
  let validDomain;
  const regex = /www.*/gm;
  let match = rawValue.match(regex);

  if (match !== null) {
    let rawSplittedValue = match[0].split(".");
    let rawShifted = rawSplittedValue.shift();
    validDomain = rawSplittedValue.join(".");
  } else {
    validDomain = rawValue;
  }

  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: $("[app='login']").attr("action"),
      host: validDomain,
    },

    success: function (data) {
      console.log(data);
      if (data.status === 1) {
        window.location.href = data.redirect;
      } else {
        console.log(data);
        errorInfo.css("display", "block");
        errorInfo.html("Podaj poprawny adres sklepu lub domeny roboczej");
      }
    },
  });
});
