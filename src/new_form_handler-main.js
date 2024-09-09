const API_URL_ADDRESS = "https://backend.webflow.prod.shoper.cloud";
const signupFormsActions = [
  "get_inpost",
  "get_ssl",
  "get_app"
];

validationPatterns = {
  email: /^(?=[a-zA-Z0-9@._%+-]{1,254}$)(?=[a-zA-Z0-9._%+-]{1,64}@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\d{9}$/,
  text: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
  nip: /^\d{10}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  zipcode: /^(\d{5}|\d{2}-\d{3})$/,
  address:
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+(\s+\d+(\s*[a-zA-Z])?(\s*\/\s*\d+)?)?$/,
};

const errorMessages = {
  email: "Podaj poprawny adres e-mail.",
  phone:
    "Podaj poprawny numer telefonu składający się z 9 cyfr bez znaków specjalnych.",
  text: "Podaj poprawne dane.",
  nip: "Podaj poprawny numer NIP",
  address: "Podaj poprawny adres",
  url: "Podaj poprawny adres URL.",
  zipcode: "Podaj poprawny kod pocztowy",
  default: "To pole jest wymagane",
};

const omittedAttributes = new Set([
  "method",
  "name",
  "id",
  "class",
  "aria-label",
  "fs-formsubmit-element",
  "wf-page-id",
  "wf-element-id",
  "autocomplete",
  "layer",
]);

function validateNIPWithAPI(nip, country) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: API_URL_ADDRESS,
      data: {
        action: "validate_nip",
        country: country,
        nip: nip,
      },
      success: (response) => {
        resolve(response === true);
      },
      error: (xhr, status, error) => {
        console.error("NIP validation API error:", error);
        reject(error);
      },
    });
  });
}

function validateInput($input) {
  const value = $input.val().trim();
  const isRequired = $input.prop("required");
  const isDisabled = $input.prop("disabled");
  const isActive = $input.hasClass("active");
  const isOldStructure = !$input.siblings(".new__input-label").length;
  const inputType = $input.data("type") || $input.attr("type");

  $input.removeClass("invalid error");

  if (isActive || isDisabled) {
    $input.siblings('.error-box, [class*="error-wrapper"]').hide();
    return Promise.resolve(false);
  }

  // Handle checkbox validation
  if (inputType === "checkbox") {
    const isChecked = $input.prop("checked");

    if (isRequired && !isChecked) {
      showError($input, errorMessages.default, isOldStructure, true);
      updateInputLabel($input, 'invalid');
      return Promise.resolve(true);
    }

    hideError($input, isOldStructure);
    updateInputLabel($input, 'valid');
    return Promise.resolve(false);
  }

  // Handle other input types
  if (isRequired && value === "") {
    showError($input, errorMessages.default, isOldStructure, true);
    updateInputLabel($input, 'invalid');
    return Promise.resolve(true);
  }

  if (value !== "" && validationPatterns[inputType]) {
    if (!validationPatterns[inputType].test(value)) {
      showError(
        $input,
        errorMessages[inputType] || errorMessages.default,
        isOldStructure,
        false
      );
      return Promise.resolve(true);
    } else if (inputType === "nip") {
      const $form = $input.closest('form');
      const country = $form.find('select[data-form="address1[country]"]').val() || 'PL';
      return validateNIPWithAPI(value, country)
        .then((isValid) => {
          if (!isValid) {
            showError($input, errorMessages.nip, isOldStructure, false);
            updateInputLabel($input, 'invalid');
            return true;
          } else {
            hideError($input, isOldStructure);
            updateInputLabel($input, 'valid');
            return false;
          }
        })
        .catch(() => {
          hideError($input, isOldStructure);
          updateInputLabel($input, 'valid');
          return false;
        });
    }
  }

  hideError($input, isOldStructure);
  return Promise.resolve(false);
}

function updateInputLabel($input, state) {
  const $wrapper = $input.closest('[data-element="input-wrapper"]');
  const $label = $wrapper.find('.new__input-label');
  
  if ($label.length) {
    $label.removeClass("valid invalid").addClass(state);
  }
}


function pushFormError(errorMessage, $input) {
  const formId = $input.closest('form').attr('id');
  const formStep = $input.attr('data-type') || 'undefined';

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "form_error",
    error_message: errorMessage,
    form_id: formId,
    form_location: "undefined",
    form_step: formStep,
    form_type: "undefined",
    lead_offer: "standard",
    lead_type: "new"
  });
}

function showError($input, message, isOldStructure, isRequiredError) {
  pushFormError(message, $input);

  $input.addClass("invalid");
  if (isOldStructure) {
    const $errorWrappers = $input.siblings(".form-input__error-wrapper");
    $errorWrappers.hide();
    $errorWrappers.eq(isRequiredError ? 1 : 0).css("display", "flex");
    $input.attr("type") === "checkbox"
      ? $input.prev(".form-checkbox-icon").addClass("error")
      : $input.addClass("error");
  } else {
    let $errorBox = $input.siblings(".error-box");
    if ($errorBox.length === 0) {
      $errorBox = $('<span class="error-box"></span>').insertAfter($input);
    }
    $errorBox.text(message).show();
  }
}

function hideError($input, isOldStructure) {
  if (isOldStructure) {
    $input.siblings(".form-input__error-wrapper").hide();
    $input.attr("type") === "checkbox"
      ? $input.prev(".form-checkbox-icon").removeClass("error")
      : $input.removeClass("error");
  } else {
    $input.siblings(".error-box").hide();
  }
}

function handleBlur(event) {
  const $element = $(event.target);
  $element.data("touched", true).removeClass("active");

  validateInput($element).then((isInvalid) => {
    if (!$element.siblings(".new__input-label").length) return;

    const $label = $element.siblings(".new__input-label");
    $label.removeClass("active valid invalid");
    
    if (isInvalid) {
      $label.addClass("invalid");
    } else if ($element.val()) {
      $label.addClass("valid");
    }
    
    $element.attr("placeholder", $element.data("initial-placeholder"));
  });
}

function initializeInputs() {
  $("input, textarea").each(function () {
    const $element = $(this);
    $element.data("touched", false);
    const isOldStructure = !$element.siblings(".new__input-label").length;

    if (!isOldStructure) {
      $element.data("initial-placeholder", $element.attr("placeholder"));

      $element.on({
        focus: function () {
          const $label = $(this).siblings(".new__input-label");
          $(this)
            .addClass("active")
            .removeClass("invalid")
            .attr("placeholder", "");
          $label.removeClass("valid invalid").addClass("active");
          $(this).siblings(".error-box").hide();
        },
        input: function () {
          const $label = $(this).siblings(".new__input-label");
          const hasValue = $(this).val().length > 0;
          $label.removeClass("valid invalid");
          if (hasValue) {
            $label.addClass("active");
          } else {
            $label.removeClass("active");
          }
          $(this).attr(
            "placeholder",
            hasValue ? "" : $(this).data("initial-placeholder")
          );
          validateInput($(this)).then((isInvalid) => {
            if (isInvalid) {
              $label.addClass("invalid");
            } else if (hasValue) {
              $label.addClass("valid");
            }
          });
        },
      });

      // Initial state check
      const $label = $element.siblings(".new__input-label");
      $label.removeClass("active valid invalid");
      
      // Only validate if the field has a value
      if ($element.val()) {
        validateInput($element).then((isInvalid) => {
          if (isInvalid) {
            $label.addClass("invalid");
          } else {
            $label.addClass("valid");
          }
        });
        $element.attr("placeholder", "");
      } else {
        $element.attr("placeholder", $element.data("initial-placeholder"));
      }
    }

    $element.on("blur", handleBlur);
  });

  $("input, textarea").removeClass("invalid");
}

function validateForm(formElement) {
  const $inputs = $(formElement).find(
    "input:not([type='submit']):not([data-exclude='true']):not(:disabled), textarea:not([data-exclude='true']):not(:disabled), select:not([data-exclude='true']):not(:disabled)"
  );

  const validationPromises = $inputs
    .map(function () {
      const $input = $(this);
      if (!$input.closest("[data-element]").hasClass("hide")) {
        return validateInput($input);
      }
      return Promise.resolve(false);
    })
    .get();

  return Promise.all(validationPromises).then((results) => {
    return results.filter(Boolean).length;
  });
}

function performNIPPreflightCheck($form) {
  const $nipInput = $form.find('input[data-type="nip"]:not([data-exclude="true"]):not(:disabled)');
  if ($nipInput.length === 0) {
    return Promise.resolve(true);
  }

  const nipValue = $nipInput.val().trim();
  if (!validationPatterns.nip.test(nipValue)) {
    showError(
      $nipInput,
      errorMessages.nip,
      !$nipInput.siblings(".new__input-label").length,
      false
    );
    return Promise.resolve(false);
  }

  const country = $form.find('select[data-form="address1[country]"]').val() || 'PL';
  return validateNIPWithAPI(nipValue, country)
    .then((isValid) => {
      if (!isValid) {
        showError(
          $nipInput,
          errorMessages.nip,
          !$nipInput.siblings(".new__input-label").length,
          false
        );
      } else {
        hideError($nipInput, !$nipInput.siblings(".new__input-label").length);
      }
      return isValid;
    })
    .catch(() => {
      hideError($nipInput, !$nipInput.siblings(".new__input-label").length);
      return true;
    });
}

function sendFormDataToURL(formElement) {
  const formData = new FormData();
  const $form = $(formElement);
  const $loader = $form.find(".loading-in-button.is-inner");

  // Add form attributes
  Array.from(formElement.attributes).forEach(({ name, value }) => {
    const attributeName = name.replace("data-", "");
    if (value && !omittedAttributes.has(attributeName)) {
      formData.append(attributeName, value);
    }
  });

  // Add form inputs
  const $inputs = $form.find(
    "input:not([type='submit']):enabled:not([data-exclude='true']), textarea:enabled, select:enabled"
  );
  const outputValues = {};

  $inputs.each(function () {
    const $input = $(this);
    const name = $input.attr("name");
    const type = $input.attr("type");
    const dataForm = $input.attr("data-form") || name;

    if (type === "radio") {
      if ($input.is(":checked")) {
        outputValues[dataForm] = $input.val();
      }
    } else if (type === "checkbox") {
      if ($input.is(":checked")) {
        if (!outputValues[dataForm]) {
          outputValues[dataForm] = [];
        }
        const value = $input.attr("aria-label") || $input.val();
        outputValues[dataForm].push(value);
      }
    } else {
      const value = $input.val().trim();
      if (value) outputValues[dataForm] = value;
    }
  });

  const arrayInputNames = ["marketplace", "country", "create_or_move_shop"];

  Object.keys(outputValues).forEach((inputName) => {
    if (
      arrayInputNames.includes(inputName) &&
      Array.isArray(outputValues[inputName])
    ) {
      outputValues[inputName].forEach((value, index) => {
        formData.append(`${inputName}[${index}]`, value);
      });
    } else {
      formData.append(inputName, outputValues[inputName]);
    }
  });

  $.ajax({
    type: "POST",
    url: API_URL_ADDRESS,
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: () => {
      if (typeof $loader !== "undefined" && $loader.show) $loader.show();
    },
    complete: () => {
      if (typeof $loader !== "undefined" && $loader.hide) $loader.hide();
    },
    success: (data) => {
      if (formData.has("host")) {
        if (data.status === 1) {
          $form.siblings(".error-admin").hide();
          if ($form.attr("data-action") === "get_admin") {
            dataLayer.push({
              event: "login",
              user_id: "undefined",
              shop_id: "undefined",
            });
          }

          window.location.href = data.redirect;
        } else {
          $form.siblings(".error-admin").show();
        }
        return;
      }

      if ($form.data("name") === "create_trial_step3" && data.status === 1) {
        localStorage.clear();
        window.location.href = data.redirect;
        return;
      }

      if (data.status !== 0) {
        $form.hide().next().show();
        $(document).trigger("submitSuccess", $form);
      } else {
        $(document).trigger("submitError", $form);
      }
    },
    error: () => {
      $form.siblings(".error-message").show();
    },
  });
}

function handleSubmitClick(e) {
  e.preventDefault();
  const $form = $(this).closest("form");

  const formAction = $form.attr("data-action");
  if (signupFormsActions.includes(formAction)) {
    dataLayer.push({
      event: "sign_up",
      user_id: "undefined",
      method: "url",
      shop_id: "undefined",
    });
  }

  validateForm($form[0]).then((errors) => {
    if (errors > 0) {
      DataLayerGatherers.pushTrackEventErrorModal($form.attr("id"), $(this).val(), $form.attr("data-label") || "consult-form")
    } else {
      const $nipInput = $form.find('input[data-type="nip"]:not([data-exclude="true"]):not(:disabled)');
      if ($nipInput.length > 0) {
        const nipValue = $nipInput.val().trim();
        const country = $form.find('select[data-form="address1[country]"]').val() || 'PL';
        validateNIPWithAPI(nipValue, country)
          .then((isValid) => {
            if (isValid) {
              sendFormDataToURL($form[0]);
            } else {
              showError(
                $nipInput,
                errorMessages.nip,
                !$nipInput.siblings(".new__input-label").length,
                false
              );
            }
          })
          .catch(() => {
            sendFormDataToURL($form[0]);
          });
      } else {
        sendFormDataToURL($form[0]);
      }
    }
  });
}

function initializeEventListeners() {
  $("[data-form='submit']").on("click", handleSubmitClick);

  $("[data-app^='open_'], [data-element^='open_']").on("click", function () {
    const dataValue = $(this).data("app") || $(this).data("element");
    const triggerName = dataValue.replace(/^open_|_modal_button$/g, "");
    const $modal = $(
      `[data-app='${triggerName}'], [data-element='${triggerName}']`
    );

    $modal.addClass("modal--open");
    $(document.body).addClass("overflow-hidden");

    const $form = $modal.find("form:first");
    if ($form.length > 0) {
      $form.find(":input:enabled:visible:first").focus();
    }
  });

  $("[fs-formsubmit-element='reset']").on("click", () =>
    $(".loading-in-button").hide()
  );

  $(document).on("submitSuccess submitError", (e, formElement) => {
    // Common data for both success and error events
    const commonData = {
      event: "myTrackEvent",
      eventCategory: `Button modal form ${
        e.type === "submitSuccess" ? "sent" : "error"
      }`,
      eventAction: $(formElement).find('[type="submit"]').val(),
      eventType: $(formElement).attr("data-label"),
      eventLabel: window.location.href,
    };

    sendDataLayer(commonData);

    if (e.type === "submitSuccess") {
      const formId = $(formElement).attr("id");

      sendDataLayer({
        event: "generate_lead",
        form_id: formId,
        form_location: "",
        form_type: "",
        lead_offer: "standard",
        form_step: "complete",
        lead_type: "new",
      });
    }
  });

  $('select[data-form="address1[country]"]').on('change', function() {
    const $form = $(this).closest('form');
    const $nipInput = $form.find('input[data-type="nip"]');
    if ($nipInput.length > 0 && $nipInput.val().trim() !== '') {
      validateInput($nipInput).then((isInvalid) => {
        updateInputLabel($nipInput, isInvalid ? 'invalid' : 'valid');
      });
    }
  });
}

function cleanObject(obj = {}) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value != null && value !== "")
  );
}

function sendDataLayer(obj = {}) {
  const cleanedObj = cleanObject(obj);
  if (window.dataLayer) {
    dataLayer.push(cleanedObj);
  }
}

$(document).ready(() => {
  initializeInputs();
  initializeEventListeners();
});
