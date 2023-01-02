$("[app='booste_submit']").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

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
  // let boosteTermsEmail = form.querySelector("[name='booste_terms_email']");
  // let boosteTermsSms = form.querySelector("[name='booste_terms_sms']");
  // let boosteTermsTel = form.querySelector("[name='booste_terms_tel']");

  function useRegexName(nameValue) {
    let regex =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    return regex.test(nameValue);
  }

  function useRegexLastName(lastNameInputValue) {
    let regex =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    return regex.test(lastNameInputValue);
  }

  function useRegexEmail(emailValue) {
    let regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailValue);
  }

  if (nameValue === "") {
    nameInput.style.border = errorBorderColor;
    errorBoxName.style.display = "flex";
    errorBoxName.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexName(nameValue)) {
    nameInput.style.border = errorBorderColor;
    errorBoxName.style.display = "flex";
    errorBoxName.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexName(nameValue)) {
    nameInput.style.border = initialBorderColor;
    errorBoxName.style.display = "none";
  }

  if (lastNameInputValue === "") {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
    errorBoxLastName.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexLastName(lastNameInputValue)) {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
    errorBoxLastName.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexLastName(lastNameInputValue)) {
    lastNameInput.style.border = initialBorderColor;
    errorBoxLastName.style.display = "none";
  }

  if (emailValue === "") {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexEmail(emailValue)) {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexEmail(emailValue)) {
    emailInput.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
  }

  if (urlValue === "") {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
  } else {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
  }

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
  body.append("firstName", nameValue);
  body.append("lastName", lastNameInputValue);
  body.append("email", emailInput);
  body.append("website", urlValue);
  body.append("shoperTermsEmail", shoperTermsEmail.checked);
  body.append("shoperTermsSms", shoperTermsSms.checked);
  body.append("shoperTermsTel", shoperTermsTel.checked);
  body.append("acceptAgree", "1");
  body.append("country", "PL");
  body.append("refererUrl", "https://shoper.pl/finansowanie/booste");

  if (
    useRegexName(nameValue) &&
    useRegexLastName(lastNameInputValue) &&
    useRegexEmail(emailValue) &&
    urlInput !== "" &&
    acceptAgree.checked
  ) {
    fetch(
      `https://hooks.zapier.com/hooks/catch/492789/bke9mgj/?action="https://app.booste.com/sign-up"&firstname=${nameValue}&lastname=${lastNameInputValue}&email=${emailValue}&website=${urlValue}&shoperTermsEmail=${shoperTermsEmail.checked}&shoperTermsSms=${shoperTermsSms.checked}&shoperTermsTel=${shoperTermsTel.checked}&acceptAgree="1"&location="PL"&referer_url="https://shoper.pl/finansowanie/booste"`,
      {
        headers: {
          Accept: "*/*",
        },
        method: "GET",
      }
    ).then(function (response) {
      //   console.log(response.status);
    });
  } else {
  }
});
