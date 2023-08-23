// this code is for trial step 2 with international number library

const inputsStepTwo = document.querySelectorAll("[data-action='create_trial_step2'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])");

window.addEventListener("beforeunload", () => {
  inputsStepTwo.forEach((n) => {
    inputVals = n.value;
    let element = document.querySelector("[data-action='create_trial_step2']");
    elementId = element.getAttribute("data-formId");

    inputValsArr.push(inputVals);
    inputValsArrFiltered = inputValsArr.filter((el) => el.length > 1);
  });

  if (inputValsArrFiltered.length > 0 && window.dataLayer) {
    data = {
      event: "formAbandon",
      formId: elementId,
      eventHistory: window.history,
    };

    window.dataLayer.push(data);
  }
});

inputsStepTwo.forEach((n) => {
  // Control Blur Step Two
  n.addEventListener("blur", function () {
    let data;
    let element = document.querySelector("[data-action='create_trial_step2']");
    elementId = element.getAttribute("data-formId");

    if (window.dataLayer) {
      data = {
        event: "controlBlur",
        formId: elementId,
        controlName: n.getAttribute("data-action"),
        controlType: n.type,
        controlValue: n.value,
      };

      window.dataLayer.push(data);
    }
  });
  // Control Focus Step Two
  n.addEventListener("focus", () => {
    let data;
    let element = document.querySelector("[data-action='create_trial_step2']");
    elementId = element.getAttribute("data-formId");

    if (window.dataLayer) {
      data = {
        event: "controlFocus",
        formId: elementId,
        controlName: n.getAttribute("data-action"),
        controlType: n.type,
        controlValue: n.value,
      };

      window.dataLayer.push(data);
    }
  });
});

let errorT;

var input = document.querySelector("#phone-trial");
var iti = window.intlTelInput(input, {
  utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
  preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
  autoInsertDialCode: false,
  nationalMode: false,
  separateDialCode: true,
  autoPlaceholder: "off",
  initialCountry: "pl",
});

const validationPatternsTrial = [
  {
    type: "phone",
    pattern: /^\d\d\d\d\d\d\d\d\d$/,
  },
];

const omittedAtributesTrial = ["method", "name", "id", "class", "aria-label", "fs-formsubmit-element", "wf-page-id", "wf-element-id"];

const urlNTrial = "https://www.shoper.pl/ajax.php";

function createEnterKeydownHandler(inputElement, submitTriggerElement) {
  return function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      inputElement.blur();
      validateInput(inputElement);
      submitTriggerElement.click();
    }
  };
}

function processForm(input, required, value, errorT) {
  const parentElement = $(input).parent()[0];
  if (required && value === "") {
    $(parentElement).siblings("[data-toast='required']").toggleClass("show", true);
    $(parentElement).siblings("[data-toast='regex']").toggleClass("show", false);
    $(input).toggleClass("errorT", true);
  } else {
    $(parentElement).siblings("[data-toast='required']").toggleClass("show", false);
    $(parentElement)
      .siblings("[data-toast='regex']")
      .toggleClass("show", errorT !== null);
    $(input).toggleClass("errorT", errorT !== null);
  }
}

function validateInput(input) {
  const countryCode = iti.getSelectedCountryData().iso2;
  const name = input.getAttribute("data-form");
  const value = input.value;
  const required = input.required;
  const type = input.getAttribute("data-type");

  let errorT = required ? (value === "" ? `${name} - jest wymagane` : null) : null;

  if (countryCode === "pl" && !errorT && value !== "" && required) {
    const pattern = validationPatternsTrial.find((p) => p.type === type)?.pattern;
    if (pattern && !pattern.test(value)) {
      errorT = `${name} nie jest wypełnione prawidłowo`;
    }
  }

  processForm(input, required, value, errorT);

  return errorT;
}

function handleBlur(event) {
  validateInput(event.target);
}

const trialStepTwoForm = document.querySelector("[data-action='create_trial_step2']");

trialStepTwoForm.querySelectorAll("input").forEach((input) => {
  const submitButton = input.closest("form").querySelector("[data-form='submit_trial_step_two']");

  input.addEventListener("blur", handleBlur);
  input.addEventListener("keydown", createEnterKeydownHandler(input, submitButton));
});

function validateForm(formElement) {
  const inputs = formElement.querySelectorAll("input");

  let errorTs = 0;

  inputs.forEach((input) => {
    if (validateInput(input)) {
      errorTs++;
    }
  });

  return errorTs;
}

function sendFormDataToURL(urlNTrial, formElement, form, loader) {
  const formData = new FormData();

  const attributes = formElement.attributes;
  for (let i = 0; i < attributes.length; i++) {
    const attributeName = attributes[i].name.replace("data-", "");
    const attributeValue = attributes[i].value;
    if (attributeValue !== "" && !omittedAtributesTrial.includes(attributeName)) {
      formData.append(attributeName, attributeValue);
    }
  }

  const inputElementsTrial = formElement.querySelectorAll("#phone-trial");
  inputElementsTrial.forEach((inputElement) => {
    let inputValue = iti.getNumber();
    const inputName = inputElement.getAttribute("data-form");
    formData.append(inputName, inputValue);
  });

  formData.append("analyticsId", analyticsId);
  formData.append("adwords[gclid]", gclidInput.value);
  formData.append("adwords[fbclid]", fbclidInput.value);

  $.ajax({
    type: "POST",
    url: urlNTrial,
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      loader.show();
      successResponse(formElement);
      if (data.status === 1) {
        window.location.href = "https://www.shoper.pl/zaloz-sklep/";
      }
    },
    errorT: function () {
      errorTResponse(formElement);
      $(formElement).siblings(".errorT-message").show();
    },
  });
}

function handleSubmitClick(e) {
  e.preventDefault();
  const form = this;
  const formElement = this.closest("form");
  const loader = $(this).find(".loading-in-button");
  if (validateForm(formElement) === 0) {
    sendFormDataToURL(urlNTrial, formElement, form, loader);
  }
}

$("[data-form='submit_trial_step_two']").click(handleSubmitClick);

$(document).ready(function () {
  var regexElement = $("[data-toast='regex']");
  var requiredElement = $("[data-toast='required']");
  requiredElement.insertAfter(".iti--show-flags");
  regexElement.insertAfter(".iti--show-flags");
});

$(document).ready(function () {
  $("form").on("click", ".iti.iti--allow-dropdown.iti--separate-dial-code.iti--show-flags", function () {
    // Check if the window width is below 992 pixels
    if ($(window).width() < 992) {
      console.log("test");
      // Find the .iti.iti--container element
      var container = $(".iti.iti--container");
      // Check if the container exists and is not already a child of the clicked element
      if (container.length && !container.parent().is(this)) {
        // Set the CSS properties for the container
        container.css({
          top: "48px",
          left: "0",
          position: "absolute",
          height: "50svh",
          "overflow-y": "auto",
        });
        // Append it as the second child of the clicked element
        $(this).append(container);
      }
    }
  });
});

function successResponse(formElement, shop_id, client_id) {
  let data;
  if (window.dataLayer) {
    data = {
      event: "myTrackEvent",
      formId: $(formElement).attr("id"),
      eventCategory: "Button modal form sent",
      eventAction: $(formElement).find("#label").text(),
      eventLabel: window.location.pathname,
      eventType: iti.getNumber(),
    };

    window.dataLayer.push(data);

    data = {
      event: "formSubmitSuccess",
      eventCategory: "Button modal form sent",
      client_id,
      formId: $(formElement).attr("id"),
      "shop-id": shop_id,
      eventAction: $(formElement).find("#label").text(),
      eventLabel: window.location.pathname,
      eventType: iti.getNumber(),
      eventHistory: window.history,
    };

    window.dataLayer.push(data);
  }
}

function errorTResponse(formElement) {
  let data;
  if (window.dataLayer) {
    data = {
      event: "formSubmiterror",
      formId: $(formElement).attr("id"),
      eventCategory: "Button modal form errorT",
      eventAction: $(formElement).find("#label").text(),
      eventLabel: window.location.pathname,
      eventType: iti.getNumber(),
      eventHistory: window.history,
    };

    window.dataLayer.push(data);

    data = {
      event: "myTrackEvent",
      formId: $(formElement).attr("id"),
      eventCategory: "Button modal form errorT",
      eventAction: $(formElement).find("#label").text(),
      eventLabel: window.location.pathname,
      eventType: iti.getNumber(),
    };

    window.dataLayer.push(data);
  }
}
