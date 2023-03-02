let phoneInputValue,
  nipValue,
  emailValue,
  urlValue,
  firstNameValue,
  lastNameValue,
  companyValue,
  formWrapper,
  emailInput,
  firstNameInput,
  lastNameInput,
  urlInput,
  phoneInput,
  textArea,
  bodyValue,
  outcomeOne,
  outcomeTwo,
  outcomeThree;
let errorBorderColor = `1px solid #eb4826`;
let initialBorderColor = `1px solid #898989`;

/* Regexes start here */

function useRegexFirstName(firstNameValue) {
  let regex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  return regex.test(firstNameValue);
}
function useRegexLastName(lastNameValue) {
  let regex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  return regex.test(lastNameValue);
}

function useRegexPhone(phoneInputValue) {
  let regex = /^\d\d\d\d\d\d\d\d\d$/;
  return regex.test(phoneInputValue);
}

function useRegexNip(nipValue) {
  let regex = /^\d\d\d\d\d\d\d\d\d\d$/;
  return regex.test(nipValue);
}

function useRegexEmail(emailValue) {
  let regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  return regex.test(emailValue);
}

function useRegexUrl(urlValue) {
  let regex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(urlValue);
}

function useRegexHost(hostValue) {
  let regex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(hostValue);
}

/* Regexes end here */

/* Functions start here */

function checkFirstNameBlur() {
  firstNameValue = firstNameInput.value;
  let errorBoxFirstName = firstNameInput.nextElementSibling;
  if (firstNameValue === "") {
    firstNameInput.style.border = errorBorderColor;
    errorBoxFirstName.style.display = "flex";
    errorBoxFirstName.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexFirstName(firstNameValue)) {
    firstNameInput.style.border = errorBorderColor;
    errorBoxFirstName.style.display = "flex";
    errorBoxFirstName.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexFirstName(firstNameValue)) {
    firstNameInput.style.border = initialBorderColor;
    errorBoxFirstName.style.display = "none";
    return true;
  }
}
function checkLastNameBlur() {
  lastNameValue = lastNameInput.value;
  let errorBoxLastName = lastNameInput.nextElementSibling;
  if (lastNameValue === "") {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
    errorBoxLastName.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexLastName(lastNameValue)) {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
    errorBoxLastName.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexLastName(lastNameValue)) {
    lastNameInput.style.border = initialBorderColor;
    errorBoxLastName.style.display = "none";
    return true;
  }
}

function checkCompanyNameBlur() {
  companyValue = companyNameInput.value;
  let errorBoxCompany = companyNameInput.nextElementSibling;
  if (companyValue === "") {
    companyNameInput.style.border = errorBorderColor;
    errorBoxCompany.style.display = "flex";
    errorBoxCompany.children[1].textContent = "To pole jest wymagane";
  } else {
    companyNameInput.style.border = initialBorderColor;
    errorBoxCompany.style.display = "none";
  }
}

function checkNipBlur() {
  nipValue = nipInput.value;
  let errorBoxNip = nipInput.nextElementSibling;
  if (nipValue === "") {
    nipInput.style.border = errorBorderColor;
    errorBoxNip.style.display = "flex";
    errorBoxNip.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexNip(nipValue)) {
    nipInput.style.border = errorBorderColor;
    errorBoxNip.style.display = "flex";
    errorBoxNip.children[1].textContent =
      "Podaj poprawny numer NIP składający się z 10 cyfr bez znaków specjalnych";
    return false;
  } else if (useRegexNip(nipValue)) {
    nipInput.style.border = initialBorderColor;
    errorBoxNip.style.display = "none";
    return true;
  }
}

function checkEmailBlurTrialStepOne(n) {
  emailValue = n.value;
  let errorBoxEmail = n.nextElementSibling;
  if (emailValue === "") {
    n.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "To pole jest wymagane";
    result = false;
    return false;
  } else if (!useRegexEmail(emailValue)) {
    n.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
    result = false;
    return false;
  } else if (useRegexEmail(emailValue)) {
    n.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
    result = true;
    return true;
  }
}

function checkPhoneBlurTrialStepTwo(n) {
  phoneInputValue = n.value;
  let errorBoxPhone = n.nextElementSibling;
  if (phoneInputValue === "") {
    n.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "To pole jest wymagane";
    result = false;
    return false;
  } else if (!useRegexPhone(phoneInputValue)) {
    n.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent =
      "Podaj poprawny numer telefonu składający się z 9 cyfr bez znaków specjalnych";
    result = false;
    return false;
  } else if (useRegexPhone(phoneInputValue)) {
    n.style.border = initialBorderColor;
    errorBoxPhone.style.display = "none";
    result = true;
    return true;
  }
}

function checkEmailBlur() {
  emailValue = emailInput.value;
  let errorBoxEmail = emailInput.nextElementSibling;
  if (emailValue === "") {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexEmail(emailValue)) {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexEmail(emailValue)) {
    emailInput.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
    return true;
  }
}

function checkPhoneBlur() {
  phoneInputValue = phoneInput.value;
  let errorBoxPhone = phoneInput.nextElementSibling;
  if (phoneInputValue === "") {
    phoneInput.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexPhone(phoneInputValue)) {
    phoneInput.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent =
      "Podaj poprawny numer telefonu składający się z 9 cyfr bez znaków specjalnych";
    return false;
  } else if (useRegexPhone(phoneInputValue)) {
    phoneInput.style.border = initialBorderColor;
    errorBoxPhone.style.display = "none";
    return true;
  }
}

function checkUrlBlur() {
  urlValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;
  if (urlValue === "") {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexUrl(urlValue)) {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexUrl(urlValue)) {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  }
}

function checkHostBlur() {
  hostValue = hostInput.value;
  let errorBoxUrl = hostInput.nextElementSibling;
  console.log(hostValue);
  if (hostValue === "") {
    hostInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexHost(hostValue)) {
    hostInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexHost(hostValue)) {
    hostInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  }
}

function checkUrlBlurRegex() {
  urlValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;

  if (urlValue === "") {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  } else if (!useRegexUrl(urlValue)) {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexUrl(urlValue)) {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  }
}

function checkTextAreaBlur() {
  textAreaValue = textArea.value;
  let errorBoxArea = textArea.nextElementSibling;

  if (textAreaValue === "") {
    textArea.style.border = errorBorderColor;
    errorBoxArea.style.display = "flex";
    errorBoxArea.children[1].textContent = "To pole jest wymagane";
    return false;
  } else {
    textArea.style.border = initialBorderColor;
    errorBoxArea.style.display = "none";
    return true;
  }
}

// Function where are more than one form on one useRegexFirstName

function checkMailBlurTwo() {
  emailValue = this.value;
  let errorBoxEmail = this.nextElementSibling;
  if (emailValue === "") {
    this.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "To pole jest wymagane";
    outcomeOne = false;
    return false;
  } else if (!useRegexEmail(emailValue)) {
    this.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
    outcomeOne = false;
    return false;
  } else if (useRegexEmail(emailValue)) {
    this.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
    outcomeOne = true;
    return true;
  }
}

function checkPhoneBlurTwo() {
  phoneInputValue = this.value;
  let errorBoxPhone = this.nextElementSibling;
  if (phoneInputValue === "") {
    this.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "To pole jest wymagane";
    outcomeTwo = false;
    return false;
  } else if (!useRegexPhone(phoneInputValue)) {
    this.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent =
      "Podaj poprawny numer telefonu składający się z 9 cyfr bez znaków specjalnych";
    outcomeTwo = false;
    return false;
  } else if (useRegexPhone(phoneInputValue)) {
    this.style.border = initialBorderColor;
    errorBoxPhone.style.display = "none";
    outcomeTwo = true;
    return true;
  }
}

function checkUrlBlurTwo() {
  urlValue = this.value;
  let errorBoxUrl = this.nextElementSibling;
  if (urlValue === "") {
    this.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "To pole jest wymagane";
    outcomeThree = false;
    return false;
  } else if (!useRegexUrl(urlValue)) {
    this.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    outcomeThree = false;
    return false;
  } else if (useRegexUrl(urlValue)) {
    this.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    outcomeThree = true;
    return true;
  }
}

/* Functions end here */
