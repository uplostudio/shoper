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
  validateInput(event.target);
}

$("input").each(function () {
  const input = $(this);
  const submitButton = input.closest("form").find("[data-form='submit']");

  input.on("blur", handleBlur);
  input.on("keydown", function (e) {
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

function sendFormDataToURL(urlN, formElement, form, loader) {
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

  inputElements.each(function () {
    let inputElement = $(this);
    let inputValue = inputElement.val();
    const inputName = inputElement.attr("data-form");

    if (inputElement.is("input")) {
      const inputType = inputElement.attr("type");

      // Handle checkboxes and radio buttons
      if (inputType === "checkbox" || inputType === "radio") {
        if (inputElement.is(":checked")) {
          inputValue = inputElement
            .next()
            .text()
            .replace(/[^\u0000-\u007F\u0100-\u017F]+/g, "")
            .trim();

          if (!outputValues.hasOwnProperty(inputName)) {
            outputValues[inputName] = [];
          }

          outputValues[inputName].push(inputValue);
        }
      } else if (inputValue !== "") {
        formData.append(inputName, inputValue);
      }
    } else if (inputElement.is("select")) {
      if (!outputValues.hasOwnProperty(inputName)) {
        outputValues[inputName] = [];
      }

      outputValues[inputName].push(inputValue);
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
    url: urlN,
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      loader.show();
      if (formData.has("host")) {
        if (data.status === 1) {
          $(formElement).siblings(".error-message").hide();
          loader.hide();
          window.location.href = data.redirect;
          return;
        } else {
          loader.hide();
          $(formElement).siblings(".error-message").show();
          return;
        }
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

function pushDataToDataLayer(formElement, eventCategory) {
  if ($(formElement).data("layer") !== "true") {
    return;
  }

  const data = {
    event: "myTrackEvent",
    eventCategory: eventCategory,
    eventAction: $(formElement).find("#label").text(),
    eventLabel: window.location.pathname,
  };

  const leadOfferText = $(originalTrigger).attr("data-lead_offer");

  if (leadOfferText) {
    data.lead_offer = leadOfferText;
  }

  window.dataLayer.push(data);
}

function successResponse(formElement) {
  pushDataToDataLayer(formElement, "Button modal form sent");
}

function errorResponse(formElement) {
  pushDataToDataLayer(formElement, "Button modal form error");
}
