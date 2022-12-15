$("[app='booste_submit']").on("click", function (e) {
  event.preventDefault(e);
  event.stopPropagation(e);

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

  let shoperTermsEmail = form.querySelector(
    "[name='shoper_terms_email']"
  ).checked;
  let shoperTermsSms = form.querySelector("[name='shoper_terms_sms']").checked;
  let shoperTermsTel = form.querySelector("[name='shoper_terms_tel']").checked;
  let acceptAgree = form.querySelector("[name='accept_agree']").checked;
  let boosteTermsEmail = form.querySelector(
    "[name='booste_terms_email']"
  ).checked;
  let boosteTermsSms = form.querySelector("[name='booste_terms_sms']").checked;
  let boosteTermsTel = form.querySelector("[name='booste_terms_tel']").checked;

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
    errorBoxName.textContent = "To pole jest wymagane";
  } else if (!useRegexName(nameValue)) {
    nameInput.style.border = errorBorderColor;
    errorBoxName.style.display = "flex";
    errorBoxName.textContent = "Podaj poprawne dane";
  } else if (useRegexName(nameValue)) {
    nameInput.style.border = initialBorderColor;
    errorBoxName.style.display = "none";
  }

  if (lastNameInputValue === "") {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
  } else if (!useRegexLastName(lastNameInputValue)) {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
  } else if (useRegexLastName(lastNameInputValue)) {
    lastNameInput.style.border = initialBorderColor;
    errorBoxLastName.style.display = "none";
  }

  if (emailValue === "") {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
  } else if (!useRegexEmail(emailValue)) {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
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

  $.ajax({
    url: "https://hooks.zapier.com/hooks/catch/492789/bke9mgj/",
    headers: {},
    method: "GET",
    data: {
      firstname: nameValue,
      lastname: lastNameInputValue,
      email: emailInput,
      website: urlValue,
      shoperTermsEmail: shoperTermsEmail,
      shoperTermsSms: shoperTermsSms,
      shoperTermsTel: shoperTermsTel,
      acceptAgree: acceptAgree,
      boosteTermsEmail: boosteTermsEmail,
      boosteTermsSms: boosteTermsSms,
      boosteTermsTel: boosteTermsTel,
      country: "PL",
      refererUrl: "https://shoper.pl/finansowanie/booste",
    },

    success: function (data) {
      console.log(data);
    },
  });
});
