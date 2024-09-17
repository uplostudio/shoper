const API_URL_ADDRESS = "https://backend.webflow.prod.shoper.cloud";
const signupFormsActions = ["get_inpost", "get_ssl", "get_app"];
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
const validationPatterns = {};
const errorMessages = {};

const inputsData = {
  inputs: [
    {
      email: {
        active_placeholder: "np. jan.kowalski@domena.pl",
        error:
          "Niepoprawny adres e-mail. Wprowadź adres w formacie: nazwa@domena.pl",
        validationPatterns:
          /^(?=[a-zA-Z0-9@._%+-]{1,254}$)(?=[a-zA-Z0-9._%+-]{1,64}@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
    },
    {
      number_phone: {
        active_placeholder: "w formacie: 123456789",
        error:
          "Niepoprawny numer telefonu. Wprowadź numer składający się z 9 cyfr w formacie: 123456789",
        validationPatterns: /^\d{9}$/,
      },
    },
    // old structure phone
    {
      phone: {
        active_placeholder: "w formacie: 123456789",
        error:
          "Niepoprawny numer telefonu. Wprowadź numer składający się z 9 cyfr w formacie: 123456789",
        validationPatterns: /^\d{9}$/,
      },
    },
    {
      url: {
        active_placeholder: "np. www.twojsklep.pl",
        error:
          "Podaj poprawny adres www twojego sklepu w formacie: www.twojsklep.pl",
        validationPatterns:
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      },
    },
    {
      "address1[first_name]": {
        active_placeholder: "",
        error: "Podaj poprawne imię",
        validationPatterns:
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
      },
    },
    {
      "address1[last_name]": {
        active_placeholder: "",
        error: "Podaj poprawne nazwisko",
        validationPatterns:
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
      },
    },
    {
      name: {
        active_placeholder: "",
        error: "Podaj poprawne imię i nazwisko",
        validationPatterns:
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
      },
    },
    {
      "address1[company_name]": {
        active_placeholder: "",
        error: "Podaj poprawną nazwę firmy",
        validationPatterns:
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
      },
    },
    {
      "address1[nip]": {
        active_placeholder: "w formacie 1234567890",
        error:
          "Podaj poprawny numer NIP. Dopuszczalne formaty: 1234567890",
        validationPatterns: /^\d{10}$/,
      },
    },
    {
      "address1[line_1]": {
        active_placeholder: "",
        error: "Podaj poprawny adres",
        validationPatterns:
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+(\s+\d+(\s*[a-zA-Z])?(\s*\/\s*\d+)?)?$/,
      },
    },
    {
      "address1[post_code]": {
        active_placeholder: "w formacie 12345",
        error: "Podaj poprawny kod pocztowy",
        validationPatterns: /^(\d{5}|\d{2}-\d{3})$/,
      },
    },
    {
      "address1[city]": {
        active_placeholder: "",
        error: "Podaj poprawny adres",
        validationPatterns:
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
      },
    },
  ],
};

inputsData.inputs.forEach((input) => {
  const key = Object.keys(input)[0];
  validationPatterns[key] = input[key].validationPatterns;
  errorMessages[key] = input[key].error;
});

window.validationPatterns = validationPatterns;

function validateNIPWithAPI(nip, country) {
  return $.ajax({
    type: "POST",
    url: API_URL_ADDRESS,
    data: { action: "validate_nip", country, nip },
  }).then(
    (response) => response === true,
    (error) => {
      console.error("NIP validation API error:", error);
      return false;
    }
  );
}

function addValidationSVG($input, isValid) {
  const $wrapper = $input.closest('[data-element="input-wrapper"]');
  if (!$wrapper.length) return;

  const validSvgBase64 =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgOEMwIDMuNTgxNzIgMy41ODE3MiAwIDggMEMxMi40MTgzIDAgMTYgMy41ODE3MiAxNiA4QzE2IDEyLjQxODMgMTIuNDE4MyAxNiA4IDE2QzMuNTgxNzIgMTYgMCAxMi40MTgzIDAgOFoiIGZpbGw9IiMyNEIyNkYiLz4KPHBhdGggZD0iTTYuNTAwMDggMTAuMDg1TDQuNDE1MDggOC4wMDAwNEwzLjcwNTA4IDguNzA1MDRMNi41MDAwOCAxMS41TDEyLjUwMDEgNS41MDAwNEwxMS43OTUxIDQuNzk1MDRMNi41MDAwOCAxMC4wODVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=";
  const invalidSvgBase64 =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgOEMwIDMuNTgxNzIgMy41ODE3MiAwIDggMEMxMi40MTgzIDAgMTYgMy41ODE3MiAxNiA4QzE2IDEyLjQxODMgMTIuNDE4MyAxNiA4IDE2QzMuNTgxNzIgMTYgMCAxMi40MTgzIDAgOFoiIGZpbGw9IiNFMjNGNDYiLz4KPHBhdGggZD0iTTExLjUgNS4yMDVMMTAuNzk1IDQuNUw4IDcuMjk1TDUuMjA1IDQuNUw0LjUgNS4yMDVMNy4yOTUgOEw0LjUgMTAuNzk1TDUuMjA1IDExLjVMOCA4LjcwNUwxMC43OTUgMTEuNUwxMS41IDEwLjc5NUw4LjcwNSA4TDExLjUgNS4yMDVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";

  $wrapper.find(".validation-svg").remove();

  if ($input.is(":focus") || $input.hasClass("active")) {
    return;
  }

  const $svg = $("<img>", {
    src: isValid ? validSvgBase64 : invalidSvgBase64,
    class: "validation-svg",
    css: {
      position: "absolute",
      right: "1rem",
      top: "1.5rem",
      transform: "translateY(-50%)",
      width: "1rem",
      height: "1rem",
      pointerEvents: "none",
    },
  });

  $wrapper.css("position", "relative");
  $wrapper.append($svg);
}


function validateInput($input) {
  const value = $input.val().trim();
  const isRequired = $input.prop("required");
  const isDisabled = $input.prop("disabled");
  const isActive = $input.hasClass("active");
  const isOldStructure = !$input.siblings(".new__input-label").length;
  const inputType = $input.data("type") || $input.attr("type");
  const dataForm = $input.data("form");

  $input.removeClass("invalid error");

  if (isActive || isDisabled) {
    $input.siblings('.error-box, [class*="error-wrapper"]').hide();
    return Promise.resolve(false);
  }

  if (inputType === "checkbox") {
    const isChecked = $input.prop("checked");
    if (isRequired && !isChecked) {
      showError($input, "To pole jest wymagane", isOldStructure, true);
      updateInputLabel($input, "invalid");
      return Promise.resolve(true);
    }
    hideError($input, isOldStructure);
    updateInputLabel($input, "valid");
    return Promise.resolve(false);
  }

  if (isRequired && value === "") {
    showError($input, "To pole jest wymagane", isOldStructure, true);
    updateInputLabel($input, "invalid");
    return Promise.resolve(true);
  }

  if (value !== "") {
    const pattern =
      validationPatterns[inputType] || validationPatterns[dataForm];
    if (pattern) {
      if (!pattern.test(value)) {
        showError(
          $input,
          errorMessages[inputType] ||
            errorMessages[dataForm] ||
            errorMessages.default,
          isOldStructure,
          false
        );
        if (!isOldStructure) addValidationSVG($input, false);
        return Promise.resolve(true);
      } else if (inputType === "nip" || dataForm === "address1[nip]") {
        const $form = $input.closest("form");
        const country =
          $form.find('select[data-form="address1[country]"]').val() || "PL";
        return validateNIPWithAPI(value, country)
          .then((isValid) => {
            if (!isValid) {
              showError(
                $input,
                errorMessages["address1[nip]"],
                isOldStructure,
                false
              );
              updateInputLabel($input, "invalid");
              if (!isOldStructure) addValidationSVG($input, false);
              return true;
            } else {
              hideError($input, isOldStructure);
              updateInputLabel($input, "valid");
              if (!isOldStructure) addValidationSVG($input, true);
              return false;
            }
          })
          .catch(() => {
            hideError($input, isOldStructure);
            updateInputLabel($input, "valid");
            return false;
          });
      }
    }
  }

  hideError($input, isOldStructure);
  if (!isOldStructure) {
    if (value !== "") {
      addValidationSVG($input, true);
    } else {
      $input.siblings(".validation-svg").remove();
    }
  }
  return Promise.resolve(false);
}

function updateInputLabel($input, state) {
  const $wrapper = $input.closest('[data-element="input-wrapper"]');
  const $label = $wrapper.find(".new__input-label");

  if ($label.length) {
    $label.removeClass("valid invalid").addClass(state);
  }
}

function pushFormError(errorMessage, $input) {
  const formId = $input.closest("form").attr("id");
  const formStep = $input.attr("data-type") || "undefined";

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "form_error",
    error_message: errorMessage,
    form_id: formId,
    form_location: "undefined",
    form_step: formStep,
    form_type: "undefined",
    lead_offer: "standard",
    lead_type: "new",
  });
}

function showError($input, message, isOldStructure, isRequiredError) {
  pushFormError(message, $input);

  $input.addClass("invalid");
  if (!isOldStructure) addValidationSVG($input, false);

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
    if ($input.val()) {
      addValidationSVG($input, true);
    } else {
      $input.siblings(".validation-svg").remove();
    }
  }
}

function handleBlur(event) {
  const $element = $(event.target);
  $element.data("touched", true).removeClass("active");
  const isOldStructure = !$element.siblings(".new__input-label").length;

  validateInput($element).then((isInvalid) => {
    if (isOldStructure) return;

    const $label = $element.siblings(".new__input-label");
    $label.removeClass("active valid invalid");

    if (isInvalid) {
      $label.addClass("invalid");
      addValidationSVG($element, false);
    } else if ($element.val()) {
      $label.addClass("valid");
      addValidationSVG($element, true);
    } else {
      $element.siblings(".validation-svg").remove();
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

      const dataForm = $element.data("form");
      const inputType = $element.data("type") || $element.attr("type");
      const inputData = inputsData.inputs.find(
        (input) => input[dataForm] || input[inputType]
      );

      if (inputData) {
        const data = inputData[dataForm] || inputData[inputType];
        if (
          data.active_placeholder &&
          data.active_placeholder !== "{initial}"
        ) {
          $element.data("active-placeholder", data.active_placeholder);
        }
      }

      $element.on({
        focus: function () {
          const $label = $(this).siblings(".new__input-label");
          $(this).addClass("active").removeClass("invalid");
          $label.removeClass("valid invalid").addClass("active");
          $(this).siblings(".error-box").hide();
          $(this).siblings(".validation-svg").hide();

          const activePlaceholder = $(this).data("active-placeholder");
          if (activePlaceholder) {
            $(this).attr("placeholder", activePlaceholder);
          }
        },
        blur: function () {
          $(this).removeClass("active");
          $(this).attr("placeholder", $(this).data("initial-placeholder"));
          validateInput($(this)).then((isInvalid) => {
            if (isInvalid) {
              addValidationSVG($(this), false);
            } else if ($(this).val()) {
              addValidationSVG($(this), true);
            } else {
              $(this).siblings(".validation-svg").remove();
            }
          });
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

  return Promise.all(
    $inputs
      .filter(function () {
        return !$(this).closest("[data-element]").hasClass("hide");
      })
      .map(function () {
        return validateInput($(this));
      })
      .get()
  ).then((results) => results.filter(Boolean).length);
}

function performNIPPreflightCheck($form) {
  const $nipInput = $form.find(
    'input[data-type="nip"]:not([data-exclude="true"]):not(:disabled), input[data-form="address1[nip]"]:not([data-exclude="true"]):not(:disabled)'
  );
  if ($nipInput.length === 0) {
    return Promise.resolve(true);
  }

  const nipValue = $nipInput.val().trim();
  if (!validationPatterns["address1[nip]"].test(nipValue)) {
    showError(
      $nipInput,
      errorMessages["address1[nip]"],
      !$nipInput.siblings(".new__input-label").length,
      false
    );
    return Promise.resolve(false);
  }

  const country =
    $form.find('select[data-form="address1[country]"]').val() || "PL";
  return validateNIPWithAPI(nipValue, country)
    .then((isValid) => {
      if (!isValid) {
        showError(
          $nipInput,
          errorMessages["address1[nip]"],
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

  Array.from(formElement.attributes).forEach(({ name, value }) => {
    const attributeName = name.replace("data-", "");
    if (value && !omittedAttributes.has(attributeName)) {
      formData.append(attributeName, value);
    }
  });

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

  Object.entries(outputValues).forEach(([inputName, value]) => {
    if (arrayInputNames.includes(inputName) && Array.isArray(value)) {
      value.forEach((val, index) => {
        formData.append(`${inputName}[${index}]`, val);
      });
    } else {
      formData.append(inputName, value);
    }
  });

  const valueTrack = DataLayerGatherers.getValueTrackData();
  formData.append("front_page", window.location.host + window.location.pathname);
  formData.append("adwords[gclid]", window.myGlobals.gclidValue);
  formData.append("adwords[fbclid]", window.myGlobals.fbclidValue);
  
  if (valueTrack) {
      for (const [key, value] of Object.entries(valueTrack)) {
          if (key !== 'timestamp') {
              formData.append(`adwords[${key}]`, value);
          }
      }
  }

  $.ajax({
    type: "POST",
    url: API_URL_ADDRESS,
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: () => {
      if ($loader && $loader.show) $loader.show();
    },
    complete: () => {
      if ($loader && $loader.hide) $loader.hide();
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
      DataLayerGatherers.pushTrackEventErrorModal(
        $form.attr("id"),
        $(this).val(),
        $form.attr("data-label") || "consult-form"
      );
    } else {
      const $nipInput = $form.find(
        'input[data-type="nip"]:not([data-exclude="true"]):not(:disabled), input[data-form="address1[nip]"]:not([data-exclude="true"]):not(:disabled)'
      );
      if ($nipInput.length > 0) {
        const nipValue = $nipInput.val().trim();
        const country =
          $form.find('select[data-form="address1[country]"]').val() || "PL";
        validateNIPWithAPI(nipValue, country)
          .then((isValid) => {
            if (isValid) {
              sendFormDataToURL($form[0]);
            } else {
              showError(
                $nipInput,
                errorMessages["address1[nip]"],
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

  $('select[data-form="address1[country]"]').on("change", function () {
    const $form = $(this).closest("form");
    const $nipInput = $form.find(
      'input[data-type="nip"], input[data-form="address1[nip]"]'
    );
    if ($nipInput.length > 0 && $nipInput.val().trim() !== "") {
      validateInput($nipInput).then((isInvalid) => {
        updateInputLabel($nipInput, isInvalid ? "invalid" : "valid");
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
