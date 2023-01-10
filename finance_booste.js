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

  // let shoperTermsEmail = form.querySelector("[name='shoper_terms_email']");
  // let shoperTermsSms = form.querySelector("[name='shoper_terms_sms']");
  // let shoperTermsTel = form.querySelector("[name='shoper_terms_tel']");
  let acceptAgree = form.querySelector("[name='accept_agree']");
  // let boosteTermsEmail = form.querySelector("[name='booste_terms_email']");
  // let boosteTermsSms = form.querySelector("[name='booste_terms_sms']");
  // let boosteTermsTel = form.querySelector("[name='booste_terms_tel']");

  if (!acceptAgree.checked) {
    acceptAgree.parentElement.children[0].style.border = errorBorderColor;
    acceptAgree.parentElement.parentElement.nextElementSibling.style.display =
      "flex";
    acceptAgree.value === 0;
  } else {
    acceptAgree.parentElement.children[0].style.border = initialBorderColor;
    acceptAgree.parentElement.parentElement.nextElementSibling.style.display =
      "none";
    acceptAgree.value === 1;
  }

  const body = new FormData();
  body.append("firstName", firstNameValue);
  body.append("lastName", lastNameValue);
  body.append("email", emailValue);
  body.append("website", urlValue);
  body.append("shoperTermsEmail", shoperTermsEmail.checked);
  body.append("shoperTermsSms", shoperTermsSms.checked);
  body.append("shoperTermsTel", shoperTermsTel.checked);
  body.append("acceptAgree", "1");
  body.append("country", "PL");
  body.append("refererUrl", "https://shoper.pl/finansowanie/booste");

  if (
    useRegexFirstName(firstNameValue) &&
    useRegexLastName(lastNameValue) &&
    useRegexEmail(emailValue) &&
    useRegexUrl(urlValue) &&
    acceptAgree.checked
  ) {
    fetch(
      `https://hooks.zapier.com/hooks/catch/492789/bke9mgj/?action="https://app.booste.com/sign-up"&firstname=${firstNameValue}&lastname=${lastNameValue}&email=${emailValue}&website=${urlValue}&shoperTermsEmail=${shoperTermsEmail.checked}&shoperTermsSms=${shoperTermsSms.checked}&shoperTermsTel=${shoperTermsTel.checked}&acceptAgree="1"&location="PL"&referer_url="https://shoper.pl/finansowanie/booste"`,
      {
        headers: {
          Accept: "*/*",
        },
        method: "GET",
      }
    ).then(function (response) {
      form.style.display = "none";
      form.parentElement.querySelector(".w-form-done").style.display = "block";
    });
  } else {
  }
});
