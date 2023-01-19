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
  body.append("firstname", firstNameValue);
  body.append("lastname", lastNameValue);
  body.append("email", emailValue);
  body.append("website", urlValue);
  body.append("shoper_terms_email", shoperTermsEmail.checked);
  body.append("shoper_terms_sms", shoperTermsSms.checked);
  body.append("shoper_terms_tel", shoperTermsTel.checked);
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
        // form.style.display = "none";
        // form.parentElement.querySelector(".w-form-done").style.display = "block";
      })
      .then((data) => {
        let status = data.status;
        // console.log(status);
        if (status === "success") {
          window.location.href = `https://app.booste.com/sign-up?firstname=${firstNameValue}&lastname=${lastNameValue}&email=${emailValue}&website=${urlValue}`;
          // console.log("redirection here")
        } else {
          form.style.display = "none";
          form.parentElement.querySelector(".w-form-fail").style.display =
            "block";
        }
      });
  }
});
