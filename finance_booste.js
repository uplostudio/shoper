$("[app='booste_submit']").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let form = e.target.form;

  useRegexFirstName(firstNameValue);
  useRegexLastName(lastNameValue);
  useRegexEmail(emailValue);
  useRegexUrl(urlValue);

  checkFirstName(e);
  checkLastName(e);
  checkEmail(e);
  checkUrl(e);

  let shoperTermsEmail = form.querySelector("[name='shoper_terms_email']");
  let shoperTermsSms = form.querySelector("[name='shoper_terms_sms']");
  let shoperTermsTel = form.querySelector("[name='shoper_terms_tel']");
  let acceptAgree = form.querySelector("[name='accept_agree']");
  let boosteTermsEmail = form.querySelector("[name='booste_terms_email']");
  let boosteTermsSms = form.querySelector("[name='booste_terms_sms']");
  let boosteTermsTel = form.querySelector("[name='booste_terms_tel']");

  if (!acceptAgree.checked) {
    acceptAgree.parentElement.children[0].style.border = errorBorderColor;
    acceptAgree.parentElement.parentElement.nextElementSibling.style.display =
      "flex";
  } else {
    acceptAgree.parentElement.children[0].style.border = initialBorderColor;
    acceptAgree.parentElement.parentElement.nextElementSibling.style.display =
      "none";
  }

  if (shoperTermsEmail.checked) {
    shoperTermsEmail.value = 1;
  } else {
    shoperTermsEmail.value = "";
  }

  if (shoperTermsSms.checked) {
    shoperTermsSms.value = 1;
  } else {
    shoperTermsSms.value = "";
  }

  if (shoperTermsTel.checked) {
    shoperTermsTel.value = 1;
  } else {
    shoperTermsTel.value = "";
  }

  if (boosteTermsEmail.checked) {
    boosteTermsEmail.value = 1;
  } else {
    boosteTermsEmail.value = "";
  }

  if (boosteTermsSms.checked) {
    boosteTermsSms.value = 1;
  } else {
    boosteTermsSms.value = "";
  }

  if (boosteTermsTel.checked) {
    boosteTermsTel.value = 1;
  } else {
    boosteTermsTel.value = "";
  }

  const body = new FormData();
  body.append("firstname", firstNameValue);
  body.append("lastname", lastNameValue);
  body.append("email", emailValue);
  body.append("website", urlValue);
  body.append("shoper_terms_email", shoperTermsEmail.value);
  body.append("shoper_terms_sms", shoperTermsSms.value);
  body.append("shoper_terms_tel", shoperTermsTel.value);
  body.append("booste_terms_email", boosteTermsEmail.value);
  body.append("booste_terms_sms", boosteTermsSms.value);
  body.append("booste_terms_tel", boosteTermsTel.value);
  body.append("accept_agree", "1");
  body.append("country", "PL");
  body.append("referer_url", "https://shoper.pl/finansowanie/booste");

  if (
    useRegexFirstName(firstNameValue) &&
    useRegexLastName(lastNameValue) &&
    useRegexEmail(emailValue) &&
    useRegexUrl(urlValue) &&
    acceptAgree.checked
  ) {
    fetch(`https://hooks.zapier.com/hooks/catch/492789/bke9mgj/`, {
      body: body,
      action: "https://app.booste.com/sign-up",
      headers: {
        Accept: "*/*",
      },
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        let status = data.status;
        if (status === "success") {
          form.reset();
          window.location.href = `https://app.booste.com/sign-up?firstname=${firstNameValue}&lastname=${lastNameValue}&email=${emailValue}&website=${urlValue}`;
        } else {
          form.style.display = "none";
          form.parentElement.querySelector(".w-form-fail").style.display =
            "block";
        }
      });
  }
});
