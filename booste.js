$("[app='booste_submit']").on("click", function (event) {
  event.preventDefault();
  event.stopPropagation();

  let form = e.target.form;
  let nameInput = form.querySelector("[app='firstName']");
  let nameValue = nameInput.value;
  let errorBoxName = nameInput.nextElementSibling;
  let lastNameInput = form.querySelector("[app='lastName']");
  let lastNameInputValue = lastNameInput.value;
  let errorBoxLastName = lastNameInput.nextElementSibling;
  let emailInput = form.querySelector("[app='email']");
  let emailValue = emailInput.value;
  let errorBoxEmail = emailInput.nextElementSibling;
  let urlInput = form.querySelector("[app='url']");
  let urlValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;

  let shoperTermsEmail = form.querySelector("[name='shoper_terms_email']");
  let shoperTermsSms = form.querySelector("[name='shoper_terms_sms']");
  let shoperTermsTel = form.querySelector("[name='shoper_terms_tel']");
  let acceptAgree = form.querySelector("[name='accept_agree']");
  let boosteTermsEmail = form.querySelector("[name='booste_terms_email']");
  let boosteTermsSms = form.querySelector("[name='booste_terms_sms']");
  let boosteTermsTel = form.querySelector("[name='booste_terms_tel']");

  $.ajax({
    url: "https://hooks.zapier.com/hooks/catch/492789/bke9mgj/",
    headers: {},
    method: "GET",
    data: {
      firstname: nameValue,
      lastname: lastNameInputValue,
      email: emailInput,
      website: urlValue,
      shoperTermsEmail,
      shoperTermsSms,
      shoperTermsTel,
      acceptAgree,
      boosteTermsEmail,
      boosteTermsSms,
      boosteTermsTel,
      country: "PL",
      refererUrl: "https://shoper.pl/finansowanie/booste",
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
