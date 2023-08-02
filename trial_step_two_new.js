// this code is for trial step 2 with international number library

let error;

var input = document.querySelector("#phone");
var iti = window.intlTelInput(input, {
  utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
  preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
  autoInsertDialCode: false,
  nationalMode: false,
  separateDialCode: true,
  initialCountry: "auto",
  geoIpLookup: function (callback) {
    fetch("https://ipapi.co/json")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        callback(data.country_code);
      })
      .catch(function () {
        callback("pl");
      });
  },
});

const validationPatterns = [
  {
    type: "phone",
    pattern: /^\d\d\d\d\d\d\d\d\d$/,
  },
];

// attributes we don't need when AJAX

const omittedAtributes = ["method", "name", "id", "class", "aria-label", "fs-formsubmit-element", "wf-page-id", "wf-element-id"];

const urlN = "https://www.shoper.pl/ajax.php";

function createEnterKeydownHandler(inputElement, submitTriggerElement) {
  return function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      inputElement.blur();
      submitTriggerElement.click();
    }
  };
}

// run valication for each input

function validateInput(input) {
  const countryCode = iti.getSelectedCountryData().iso2;
  const name = input.getAttribute("data-form");
  const value = input.value;
  const required = input.required;
  const type = input.getAttribute("data-type");

  error = required ? (value === "" ? `${name} - jest wymagane` : null) : null;

  if (countryCode === "pl" && !error && value !== "" && required) {
    const pattern = validationPatterns.find((p) => p.type === type)?.pattern;
    if (pattern && !pattern.test(value)) {
      error = `${name} nie jest wypełnione prawidłowo`;
    }
  }

  function processForm() {
    var input = $("#phone");
    var parentElement = input.parent()[0];
    if (required && value === "") {
      $(parentElement).siblings("[data-toast='required']").toggleClass("show", true);
      $(parentElement).siblings("[data-toast='regex']").toggleClass("show", false);
      input.addClass("error");
    } else {
      $(parentElement).siblings("[data-toast='required']").toggleClass("show", false);
      $(parentElement)
        .siblings("[data-toast='regex']")
        .toggleClass("show", error !== null);
      $(input).toggleClass("error", error !== null);
    }
  }

  processForm();

  return error;
}

function handleBlur(event) {
  validateInput(event.target);
}

// enter event added to each input
// try to send form (click submit button)
// when pushing enter

const trialStepTwoForm = document.querySelector("[data-action='create_trial_step2']");

trialStepTwoForm.querySelectorAll("input").forEach((input) => {
  const submitButton = input.closest("form").querySelector("[data-form='submit_trial_step_two']");

  input.addEventListener("blur", handleBlur);
  input.addEventListener("keydown", createEnterKeydownHandler(input, submitButton));
});

function validateForm(formElement) {
  const inputs = formElement.querySelectorAll("input");

  let errors = 0;

  inputs.forEach((input) => {
    if (validateInput(input)) {
      errors++;
    }
  });

  return errors;
}

// get all Inputs, all attrbiutes from form
// create an AJAX request

function sendFormDataToURL(urlN, formElement, form, loader) {
  const formData = new FormData();

  const attributes = formElement.attributes;
  for (let i = 0; i < attributes.length; i++) {
    const attributeName = attributes[i].name.replace("data-", "");
    const attributeValue = attributes[i].value;
    if (attributeValue !== "" && !omittedAtributes.includes(attributeName)) {
      formData.append(attributeName, attributeValue);
    }
  }

  const inputElements = formElement.querySelectorAll("#phone");
  let countryValues = [];
  let marketplaceValues = [];
  inputElements.forEach((inputElement) => {
    let inputValue = iti.getNumber();
    const inputName = inputElement.getAttribute("data-form");
    formData.append(inputName, inputValue);
  });

  $.ajax({
    type: "POST",
    url: urlN,
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      loader.show();
      if (data.status === 1) {
        window.location.href = "https://www.shoper.pl/zaloz-sklep/";
      }
      successResponse(formElement);
      $(form).parent().hide();
      $(form).parent().next().show();
    },
    error: function () {
      errorResponse(formElement);
      $(formElement).siblings(".error-message").show();
    },
  });
}

// send data, if no errros
function handleSubmitClick(e) {
  e.preventDefault();
  const form = this;
  const formElement = this.closest("form");
  const loader = $(this).find(".loading-in-button");
  if (validateForm(formElement) === 0) {
    sendFormDataToURL(urlN, formElement, form, loader);
  }
}

// send data trigger
$("[data-form='submit_trial_step_two']").click(handleSubmitClick);

$(document).ready(function () {
  var regexElement = $("[data-toast='regex']");
  var requiredElement = $("[data-toast='required']");
  requiredElement.insertAfter(".iti--show-flags");
  regexElement.insertAfter(".iti--show-flags");
});

function successResponse(formElement) {
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
      // client_id: client_id,
      formId: $(formElement).attr("id"),
      "shop-id": data.license_id,
      eventAction: $(formElement).find("#label").text(),
      eventLabel: window.location.pathname,
      eventType: iti.getNumber(),
      eventHistory: window.history,
    };

    window.dataLayer.push(data);
  }
}

function errorResponse(formElement) {
  let data;
  if (window.dataLayer) {
    data = {
      event: "formSubmitError",
      formId: $(formElement).attr("id"),
      eventCategory: "Button modal form error",
      eventAction: $(formElement).find("#label").text(),
      eventLabel: window.location.pathname,
      eventType: iti.getNumber(),
      eventHistory: window.history,
    };

    window.dataLayer.push(data);

    data = {
      event: "myTrackEvent",
      formId: $(formElement).attr("id"),
      eventCategory: "Button modal form error",
      eventAction: $(formElement).find("#label").text(),
      eventLabel: window.location.pathname,
      eventType: iti.getNumber(),
    };

    window.dataLayer.push(data);
  }
}

let debug = false;

if (debug) {
  // Step 1: Create an input field
  const inputField = document.createElement("input");

  inputField.setAttribute("type", "text");

  // Step 2: Get the country list and append the input field as the first child
  const flagContainer = document.querySelector(".iti__flag-container");
  const countryList = document.querySelector(".iti__country-list");
  flagContainer.insertBefore(inputField, flagContainer.lastChild);

  // Step 3: Add event listener to the input field for filtering
  inputField.addEventListener("input", function () {
    const searchTerm = inputField.value.trim().toLowerCase();

    // Loop through each <li> element in the country list
    Array.from(countryList.children).forEach(function (country) {
      const countryName = country.textContent.toLowerCase();

      // Show or hide the element based on the filter
      if (countryName.includes(searchTerm)) {
        country.style.display = "block";
      } else {
        country.style.display = "none";
      }
    });
  });

  // Step 4: Add event listener to prevent default behavior when clicking on the input field
  inputField.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
  });
}

$(document).ready(function () {
  $("form").on("click", ".iti.iti--allow-dropdown.iti--separate-dial-code.iti--show-flags", function () {
    // Check if the window width is below 992 pixels
    if ($(window).width() < 992) {
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
        });
        // Append it as the second child of the clicked element
        $(this).append(container);
      }
    }
  });
});
