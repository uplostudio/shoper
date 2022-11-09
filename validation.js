let trialStepOneSubmit = document.querySelectorAll("[app='submit-step-one']");
// Step One Submit Buttons
trialStepOneSubmit.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Get the form the button is attachted to
    let form = e.target.form;
    //  Get the input (email)
    let inputInForm = form.querySelector("[app='email']");
    // Get the input value
    let emailValue = inputInForm;
    // Get the native error box from wf
    let errorBox = form.parentNode.lastChild;
    // get regex test result against email value
    function useRegexEmail(emailValue) {
      let regex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(emailValue);
    }

    console.log(`Mail Regex Text: ${useRegexEmail(emailValue.value)}`);

    if (emailValue.value === "") {
      inputInForm.style.border = "1px solid #F25158";
      errorBox.innerHTML = "To pole jest wymagane";
      errorBox.style.display = "block";
    } else if (!useRegexEmail(emailValue.value)) {
      inputInForm.style.border = "1px solid #F25158";
      errorBox.innerHTML = "Podaj poprawny adres e-mail";
      errorBox.style.display = "block";
    } else if (useRegexEmail(emailValue.value)) {
      inputInForm.style.border = "1px solid #898989";
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
    let inputInForm = form.querySelector("[app='phone']");
    let phoneValue = inputInForm;
    let errorBox = form.parentNode.lastChild;

    function useRegexPhone(phoneValue) {
      let regex = /^\d\d\d\d\d\d\d\d\d$/;
      return regex.test(phoneValue);
    }

    console.log(`Phone Regex Text: ${useRegexPhone(phoneValue.value)}`);

    if (phoneValue.value === "") {
      inputInForm.style.border = "1px solid #F25158";
      errorBox.innerHTML = "To pole jest wymagane";
      errorBox.style.display = "block";
    } else if (!useRegexPhone(phoneValue.value)) {
      inputInForm.style.border = "1px solid #F25158";
      errorBox.innerHTML = "Podaj poprawny numer telefonu";
      errorBox.style.display = "block";
    } else if (useRegexPhone(phoneValue.value)) {
      inputInForm.style.border = "1px solid #898989";
      errorBox.style.display = "none";
    }
  });
});
