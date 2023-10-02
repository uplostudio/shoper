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

const omittedAtributes = ["method", "name", "id", "class", "aria-label", "fs-formsubmit-element", "wf-page-id", "wf-element-id", "autocomplete", "layer"];

function validateInput(input) {
  const name = $(input).data("form");
  const type = $(input).data("type");
  const value = type === "checkbox" ? $(input).prop("checked") : $(input).val();
  const required = $(input).prop("required");
  let error = required ? (value === false || value === "" ? `${name} - jest wymagane` : null) : null;

  if (value !== "" && value !== false) {
    const pattern = validationPatterns.find((p) => p.type === type)?.pattern;
    if (pattern && !pattern.test(value)) {
      error = `${name} nie jest wypełnione prawidłowo`;
    }
  }

  if (required && (value === "" || value === false)) {
    if (type === "checkbox") {
      $(input).prev(".form-checkbox-icon").addClass("error");
      $(input).parent().next().css("display", "flex");
    } else {
      $(input).next().next().css("display", "flex");
      $(input).next().css("display", "none");
      $(input).addClass("error");
    }
  } else {
    if (type === "checkbox") {
      $(input).prev(".form-checkbox-icon").removeClass("error");
      if ($(input).parent().next('[class*="error-wrapper"]').length) {
        $(input).parent().next().css("display", "none");
      }
    } else {
      $(input).next().next().css("display", "none");
      $(input)
        .next()
        .css("display", error !== null ? "flex" : "none");
      $(input).toggleClass("error", error !== null);
    }
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
    // createEnterKeydownHandler(input, submitButton)(e);
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

function sendFormDataToURL(formElement, form) {
  const formData = new FormData();

  $.each($(formElement)[0].attributes, function (index, attribute) {
    const attributeName = attribute.name.replace("data-", "");
    const attributeValue = attribute.value;
    if (attributeValue !== "" && !omittedAtributes.includes(attributeName)) {
      formData.append(attributeName, attributeValue);
    }
  });

  const inputElements = $(formElement).find("input:not([type=submit]), textarea, select");

  let outputValues = {};
  let checkboxBinary = ["loan_decision_contact", "external_ads_terms"].includes($(formElement).attr("data-action"));

  inputElements.each(function () {
    let inputElement = $(this);
    let inputValue = inputElement.val();
    const inputName = inputElement.attr("data-form");

    if (inputElement.is("input")) {
      const inputType = inputElement.attr("type");

      if (inputType === "checkbox" || inputType === "radio") {
        if (checkboxBinary) {
          inputValue = inputElement.is(":checked") ? "1" : "0";
        } else if (inputElement.is(":checked")) {
          inputValue = inputElement
            .next()
            .text()
            .replace(/[^\u0000-\u007F\u0100-\u017F]+/g, "")
            .trim();
        } else {
          return;
        }

        if (!outputValues.hasOwnProperty(inputName)) {
          outputValues[inputName] = [];
        }

        outputValues[inputName].push(inputValue);
      } else if (inputValue !== "") {
        outputValues[inputName] = inputValue;
      }
    } else if (inputElement.is("textarea") || inputElement.is("select")) {
      outputValues[inputName] = inputValue;
    }
  });

  Object.keys(outputValues).forEach((inputName) => {
    if (Array.isArray(outputValues[inputName])) {
      outputValues[inputName].forEach((value, index) => {
        formData.append(`${inputName}[${index}]`, value);
      });
    } else {
      formData.append(inputName, outputValues[inputName]);
    }
  });
  const loader = $(formElement).find(".loading-in-button");
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
      console.log(data);
      if (formData.has("host")) {
        if (data.status === 1) {
          $(formElement).siblings(".error-admin").hide();
          window.location.href = data.redirect;
          return;
        } else {
          $(formElement).siblings(".error-admin").show();
          return;
        }
      }

      if (data.status !== 0) {
        $(formElement).hide();
        $(formElement).next().show();
        $(document).trigger("submitSuccess", $(formElement));
      } else {
        $(document).trigger("submitError", $(formElement));
      }
    },
    error: function () {
      $(formElement).siblings(".error-message").show();
    },
  });
}

// send data, if no errros
function handleSubmitClick(e) {
  e.preventDefault();
  const form = this;
  const formElement = this.closest("form");
  const errors = validateForm(formElement);
  if (errors > 0) {
    window.dataLayer.push({
      event: "myTrackEvent",
      eventCategory: "Button modal form error",
      eventAction: $(this).val(),
      eventLabel: window.location.href,
      eventType: $(formElement).attr("data-label") || "consult-form",
    });
  } else {
    sendFormDataToURL(formElement, form);
  }
}

// send data trigger
$("[data-form='submit']").click(handleSubmitClick);

// open modal with universal button
$("[data-app^='open_']").on("click", function () {
  originalTrigger = $(this);
  const triggerName = originalTrigger.data("app").replace(/^open_|_modal_button$/g, "");
  const modalElement = $(`[data-app='${triggerName}']`);

  modalElement.addClass("modal--open");
  $(document.body).toggleClass("overflow-hidden", true);

  const form = modalElement.find("form:first");
  // find the first form
  if (form.length > 0) {
    // if form exists
    form.find(":input:enabled:visible:first").focus();
    // focus on the first input of the form
  }
});

// reset or close formsubmit

$("[fs-formsubmit-element='reset']").on("click", function () {
  $(".loading-in-button").hide();
});

// DataLayer Support

$(document).on("submitSuccess", function (e, formElement) {
  sendDataLayer({
    eventName: "myTrackEvent",
    eventCategory: "Button modal form sent",
    eventAction: $(formElement).find('[type="submit"]').val(),
    eventType: $(formElement).attr("data-label"),
    eventLabel: window.location.href,
  });
});

$(document).on("submitError", function (e, formElement) {
  sendDataLayer({
    eventName: "myTrackEvent",
    eventCategory: "Button modal form error",
    eventAction: $(formElement).find('[type="submit"]').val(),
    eventType: $(formElement).attr("data-label"),
    eventLabel: window.location.href,
  });
});

function cleanObject(obj = {}) {
  let cleanedObj = {};

  for (let key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      cleanedObj[key] = obj[key];
    }
  }

  return cleanedObj;
}

function sendDataLayer(obj = {}) {
  obj = cleanObject(obj);

  if (window.dataLayer) {
    dataLayer.push(obj);
  }
}
