let originalTrigger;
let error;
const API_URL_ADRESS = "https://backend.webflow.prod.shoper.cloud";
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
    pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
  },
  {
    type: "nip",
    pattern: /^\d{10}$/,
  },
  {
    type: "url",
    pattern: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
  },
  {
    type: "zipcode",
    pattern: /^(\d{5}|\d{2}-\d{3})$/,
  },
];

// attributes we don't need when AJAX

const omittedAtributes = ["method", "name", "id", "class", "aria-label", "fs-formsubmit-element", "wf-page-id", "wf-element-id", "autocomplete", "layer"];

function validateInput(input) {
  var excludeIds = ["1", "0"]; // Match the IDs of the radio inputs to exclude them to NOT interact with this snippet

  const id = $(input).attr("id"); 
  const name = $(input).data("form");
  const type = $(input).data("type");
  const value = type === "checkbox" ? $(input).prop("checked") : $(input).val();
  const required = $(input).prop("required");
  let error = required ? (value === false || value === "" ? `${name} - jest wymagane` : null) : null;

  // Continue only if the input's id is not in the excludeIds array
  if (!excludeIds.includes(id)) {
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
      if (type === "checkbox" || (name === "client_type")) {
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
  const inputs = $(formElement).find("input:not([type='submit']):enabled:not([data-exclude='true']), textarea:enabled, select:enabled");

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

  const inputElements = $(formElement).find("input:not([type='submit']):enabled:not([data-exclude='true']), textarea:enabled, select:enabled");

  let outputValues = {};
  let binaryCheckboxActions = ["loan_decision_contact", "external_ads_terms", "simple_form", "register_reseller"];

  inputElements.each(function() {
      let currentElement = $(this);
      let currentValue = currentElement.val();
      const elementName = currentElement.attr("data-form");
      
      if (currentElement.is("input")) {
          const checkboxBinary = binaryCheckboxActions.includes($(formElement).attr("data-action"));
          const elementType = currentElement.attr("type");
          
          // Check for checkbox or radio input types
          if (elementType === "checkbox" || elementType === "radio") {
              if (elementType === "radio") {
                  currentValue = currentElement.val();
              } else if (checkboxBinary) {
                  // Assign 1 or 0 based on checkbox state
                  currentValue = currentElement.is(":checked") ? "1" : "0";
              } else if (currentElement.is(":checked")) {
                  currentValue = currentElement.next().text().replace(/[^\u0000-\u007F\u0100-\u017F]+/g, "").trim();
              } else {
                  return;
              }
              
              // If the outputValues object doesn't already have this key, initialize it with an empty array
              if (!outputValues.hasOwnProperty(elementName)) {
                  outputValues[elementName] = [];
              }
              
              // Push the current value into the array corresponding to the element name in the outputValues object
              outputValues[elementName].push(currentValue);
          } else if (currentValue !== "") {
              outputValues[elementName] = currentValue;
          }
      } else if (currentElement.is("textarea") || currentElement.is("select")) {
          outputValues[elementName] = currentValue;
      }
  });

  const arrayInputNames = ["marketplace", "country", "create_or_move_shop"];

  Object.keys(outputValues).forEach((inputName) => {
    // If it is a special inputName and the value is an array
    if (arrayInputNames.includes(inputName) && Array.isArray(outputValues[inputName])) {
      outputValues[inputName].forEach((value, index) => {
        formData.append(`${inputName}[${index}]`, value);
      });
    } // If the name isn't special, or it is but isn't an array value
    else {
      formData.append(inputName, outputValues[inputName]);
    }
  });

  const loader = $(formElement).find(".loading-in-button");
  formData.append("front_page", window.location.host + window.location.pathname);
  formData.append("adwords[gclid]", window.myGlobals.gclidValue);
  formData.append("adwords[fbclid]", window.myGlobals.fbclidValue);

  if (valueTrackData) {
    for (const [key,value] of Object.entries(valueTrackData)) {
        if (key !== 'timestamp') {
            formData.append(key, value);
        }
    }
}

  $.ajax({
    type: "POST",
    url: API_URL_ADRESS,
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
    event: "myTrackEvent",
    eventCategory: "Button modal form sent",
    eventAction: $(formElement).find('[type="submit"]').val(),
    eventType: $(formElement).attr("data-label"),
    eventLabel: window.location.href,
  });
});

$(document).on("submitError", function (e, formElement) {
  sendDataLayer({
    event: "myTrackEvent",
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
