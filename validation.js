// console.log(
//   "%cValidation Dev Channel",
//   "color: white; font-family:monospace; background-color: red; font-size: 20px"
// );

let errorBorderColor = `1px solid #eb4826`;
let initialBorderColor = `1px solid #898989`;

let trialStepOneSubmit = document.querySelectorAll("[app='submit-step-one']");
// Step One Submit Buttons
trialStepOneSubmit.forEach((button) => {
  button.addEventListener("click", (e) => {
    let form = e.target.form;
    let inputInForm = form.querySelector("[app='email']");
    let emailValue = inputInForm;
    let errorBox = form.nextElementSibling;
    function useRegexEmail(emailValue) {
      let regex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(emailValue);
    }

    // console.log(`Mail Regex Text: ${useRegexEmail(emailValue.value)}`);

    if (emailValue.value === "") {
      inputInForm.style.border = errorBorderColor;
      errorBox.style.display = "flex";
    } else if (!useRegexEmail(emailValue.value)) {
      inputInForm.style.border = errorBorderColor;
      errorBox.style.display = "flex";
    } else if (useRegexEmail(emailValue.value)) {
      inputInForm.style.border = initialBorderColor;
      errorBox.style.display = "none";
    }
  });
});

let trialStepTwoSubmit = document.querySelectorAll(
  "#w-node-_843c2892-e86e-eb6c-8979-71be50cdf61e-6c7562df"
);
// Step Two Submit Buttons

trialStepTwoSubmit.forEach((button) => {
  button.addEventListener("click", (e) => {
    let form = e.target.form;
    // console.log(form);
    let inputInForm = form.querySelector("[app='phone']");
    let phoneValue = inputInForm;
    let errorBox = inputInForm.parentNode.lastChild;
    console.log(errorBox);

    function useRegexPhone(phoneValue) {
      let regex = /^\d\d\d\d\d\d\d\d\d$/;
      return regex.test(phoneValue);
    }

    // console.log(`Phone Regex Text: ${useRegexPhone(phoneValue.value)}`);

    if (phoneValue.value === "") {
      inputInForm.style.border = errorBorderColor;
      errorBox.style.display = "flex";
    } else if (!useRegexPhone(phoneValue.value)) {
      inputInForm.style.border = errorBorderColor;
      errorBox.style.display = "flex";
    } else if (useRegexPhone(phoneValue.value)) {
      inputInForm.style.border = initialBorderColor;
      errorBox.style.display = "none";
    }
  });
});

// free consult form validation

let consultFormSubmit = document.querySelectorAll("[app='consult-submit']");

consultFormSubmit.forEach((button) => {
  button.addEventListener("click", (e) => {
    let form = e.target.form;
    let phoneInput = form.querySelector("[app='phone_campaign']");
    let emailInput = form.querySelector("[app='email_campaign']");
    let urlInput = form.querySelector("[app='url_campaign']");
    let urlValue = urlInput;
    let emailValue = emailInput;
    let phoneValue = phoneInput;
    let errorBoxPhone = phoneInput.parentNode.nextElementSibling;
    let errorBoxMail = emailInput.parentNode.nextElementSibling;
    let errorBoxUrl = urlInput.parentNode.nextElementSibling;

    function useRegexPhone(phoneValue) {
      let regex = /^\d\d\d\d\d\d\d\d\d$/;
      return regex.test(phoneValue);
    }

    function useRegexEmail(emailValue) {
      let regex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(emailValue);
    }

    function useRegexUrl(urlValue) {
      let regex = /[a-zA-Z][a-zA-Z]/gm;
      return regex.test(urlValue);
    }

    if (phoneValue.value === "") {
      phoneInput.style.border = errorBorderColor;
      errorBoxPhone.style.display = "flex";
    } else if (!useRegexPhone(phoneValue.value)) {
      phoneInput.style.border = errorBorderColor;
      errorBoxPhone.style.display = "flex";
    } else if (useRegexPhone(phoneValue.value)) {
      phoneInput.style.border = initialBorderColor;
      errorBoxPhone.style.display = "none";
    }

    if (emailValue.value === "") {
      emailInput.style.border = errorBorderColor;
      errorBoxMail.style.display = "flex";
    } else if (!useRegexEmail(emailValue.value)) {
      emailInput.style.border = errorBorderColor;
      errorBoxMail.style.display = "flex";
    } else if (useRegexEmail(emailValue.value)) {
      emailInput.style.border = initialBorderColor;
      errorBoxMail.style.display = "none";
    }

    if (urlValue.value === "") {
      urlInput.style.border = errorBorderColor;
      errorBoxUrl.style.display = "flex";
    } else if (!useRegexUrl(urlValue.value)) {
      urlInput.style.border = errorBorderColor;
      errorBoxUrl.style.display = "flex";
    } else if (useRegexUrl(urlValue.value)) {
      urlInput.style.border = initialBorderColor;
      errorBoxUrl.style.display = "none";
    }
  });
});
