let originalTrigger;
let error;
// validation patterns

const validationPatterns = [
  {
    type: "email",
    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/,
  },
  {
    type: "phone",
    pattern: /^\d{9}$/,
  },
  {
    type: "text",
    pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,
  },
  {
    type: "nip",
    pattern: /^\d{10}$/,
  },
  {
    type: "url",
    pattern: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
  },
];

// attributes we don't need when AJAX

const omittedAtributes = ["method", "name", "id", "class", "aria-label", "fs-formsubmit-element", "wf-page-id", "wf-element-id"];

function createEnterKeydownHandler(inputElement, submitTriggerElement) {
  return function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      inputElement.blur();
      submitTriggerElement.click();
    }
  };
}

function validateInput(input) {
  const name = $(input).data("form");

  const value = $(input).val();

  const required = $(input).prop("required");

  const type = $(input).data("type");

  error = required ? (value === "" ? `${name} - jest wymagane` : null) : null;

  if (!error && value !== "" && required) {
    const pattern = validationPatterns.find((p) => p.type === type)?.pattern;
    if (pattern && !pattern.test(value)) {
      error = `${name} nie jest wypełnione prawidłowo`;
    }
  }

  if (required && value === "") {
    $(input).next().next().toggleClass("show", true);
    $(input).next().toggleClass("show", false);
    $(input).addClass("error");
  } else {
    $(input).next().next().toggleClass("show", false);
    $(input)
      .next()
      .toggleClass("show", error !== null);
    $(input).toggleClass("error", error !== null);
  }

  return error;
}

function handleBlur(event) {
  // Only if the field was touched run validation
  if ($(event.target).data("touched")) {
    validateInput(event.target);
  }
}

$("input").each(function () {
  const input = $(this);
  const submitButton = input.closest("form").find("[data-form='submit']");

  // Add touched data to false on creation
  input.data("touched", false);

  input.on("blur", handleBlur);

  input.on("keydown", function (e) {
    // On first keydown (excluding Tab), set touched data to true
    if (!input.data("touched") && e.keyCode !== 9) {
      input.data("touched", true);
    }
    createEnterKeydownHandler(input, submitButton)(e);
  });
});

function validateForm(formElement) {
  const inputs = $(formElement).find("input, textarea");

  let errors = 0;

  inputs.each(function () {
    if (validateInput($(this))) {
      errors++;
    }
  });

  return errors;
}

function sendFormDataToURL(formElement, form, loader) {
  const formData = new FormData();

  $.each($(formElement)[0].attributes, function (index, attribute) {
    const attributeName = attribute.name.replace("data-", "");
    const attributeValue = attribute.value;
    if (attributeValue !== "" && !omittedAtributes.includes(attributeName)) {
      formData.append(attributeName, attributeValue);
    }
  });

  const inputElements = $(formElement).find("input, textarea, select");

  let outputValues = {};

  let dataActionLoanValue = $(formElement).attr("data-action") === "loan_decision_contact";

  inputElements.each(function () {
    let inputElement = $(this);
    let inputValue = inputElement.val();
    const inputName = inputElement.attr("data-form");

    if (inputElement.is("input")) {
      const inputType = inputElement.attr("type");

      // Handle checkboxes and radio buttons
      if (inputType === "checkbox" || inputType === "radio") {
        if (dataActionLoanValue) {
          inputValue = inputElement.is(":checked") ? "1" : "0";
        } else if (inputElement.is(":checked")) {
          inputValue = inputElement
            .next()
            .text()
            .replace(/[^\u0000-\u007F\u0100-\u017F]+/g, "")
            .trim();
        } else {
          // Continue to the next iteration if checkbox/radio not checked
          return;
        }

        // Add to existing array or create a new one
        if (outputValues.hasOwnProperty(inputName) && Array.isArray(outputValues[inputName])) {
          outputValues[inputName].push(inputValue);
        } else if (outputValues.hasOwnProperty(inputName)) {
          outputValues[inputName] = [outputValues[inputName], inputValue];
        } else {
          outputValues[inputName] = inputValue;
        }
      } else if (inputValue !== "") {
        outputValues[inputName] = inputValue;
      }
    } else if (inputElement.is("select")) {
      // If multiple selections for a field exist, create an array, otherwise store as a single value
      if (outputValues.hasOwnProperty(inputName) && Array.isArray(outputValues[inputName])) {
        outputValues[inputName].push(inputValue);
      } else if (outputValues.hasOwnProperty(inputName)) {
        outputValues[inputName] = [outputValues[inputName], inputValue];
      } else {
        outputValues[inputName] = inputValue;
      }
    }
  });

  Object.keys(outputValues).forEach((inputName) => {
    if (Array.isArray(outputValues[inputName])) {
      formData.append(inputName, JSON.stringify(outputValues[inputName]));
    } else {
      formData.append(inputName, outputValues[inputName]);
    }
  });

  $.ajax({
    type: "POST",
    url: window.myGlobals.URL,
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: function () {
      // Show loader before sending
      loader.show();
    },
    complete: function () {
      // Hide loader when request is complete
      loader.hide();
    },
    success: function (data) {
      $(form).parent().hide();
      $(form).parent().next().show();
      if (formData.has("host")) {
        if (data.status === 1) {
          $(formElement).siblings(".error-message").hide();
          window.location.href = data.redirect;
          return;
        } else {
          $(formElement).siblings(".error-message").show();
          return;
        }
      }

      if ($(formElement).data("layer") !== "true") {
        return;
      } else {
        DataLayerGatherers.pushTrackEventDataModalRegular($(formElement).attr("data-action"), $(formElement).attr("data-action"));
      }
    },
    error: function () {
      if ($(formElement).data("layer") !== "true") {
        return;
      } else {
        DataLayerGatherers.pushTrackEventDataModalRegularError($(formElement).attr("data-action"), $(formElement).attr("data-action"));
      }
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
    sendFormDataToURL(formElement, form, loader);
  }
}

// send data trigger
$("[data-form='submit']").click(handleSubmitClick);

// open modal with universal button
$("[data-app^='open_']").on("click", function () {
  originalTrigger = $(this);
  const triggerName = originalTrigger.data("app").replace(/^open_|_modal_button$/g, "");
  $(`[data-app='${triggerName}']`).addClass("modal--open");
  $(document.body).toggleClass("overflow-hidden", true);
});

// reset or close formsubmit

$("[fs-formsubmit-element='reset']").on("click", function () {
  $(".loading-in-button").hide();
});

// function pushDataToDataLayer(formElement, eventCategory) {
//   const leadOfferText = $(originalTrigger).attr("data-lead_offer");

//   if (leadOfferText) {
//     data.lead_offer = leadOfferText;
//   }

//   window.dataLayer.push(data);
