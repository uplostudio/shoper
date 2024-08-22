$(document).ready(function () {
  let state = {
    errors: [],
    phoneRegex: window.validationPatterns.phone,
  };

  function maskPhoneNumber(phone) {
    return phone.replace(/(\+48)(\d{7})(\d{2})/, "$1 *** *** *$3");
  }

  function formSubmitErrorTrial(formId, eventAction, phone) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "formSubmitError",
      formId: formId,
      phone: phone,
      action: eventAction,
      website: "shoper",
      eventLabel: window.location.pathname,
    });
  }

  function setupValidation() {
    // select only phone fields in the trial forms
    const phoneFields = $('[data-type="phone"]').filter(function () {
      return $(this).parents('[data-action*="trial"]').length > 0;
    });
    phoneFields.each(function () {
      let phoneField = $(this);

      var iti = window.intlTelInput(phoneField.get(0), {
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
        preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
        autoInsertDialCode: false,
        nationalMode: false,
        separateDialCode: true,
        autoPlaceholder: "off",
        initialCountry: "pl",
      });

      phoneField.on("blur", function () {
        state.errors = validatePhone(this, iti);
      });

      phoneField.on("keydown", function (e) {
        if (e.which === 13) {
          e.preventDefault();
          $(this).trigger("blur");
          handleFormSubmission(e, phoneField, iti);
        }
      });

      phoneField
        .closest("form")
        .find('[data-form="submit-step-two"]')
        .on("click", function (e) {
          handleFormSubmission(e, phoneField, iti);
        });
    });
  }

  function validatePhone(field, iti) {
    let errors = [];
    const countryCode = iti.getSelectedCountryData().iso2;
    let phone = iti.getNumber().trim();

    clearErrors($(field));

    if (!phone) {
      showError($(field), errorMessages.default);
      errors.push(errorMessages.default);
    } else if (countryCode === "pl") {
      const phoneWithoutPrefix = phone.replace(/^\+48/, "");
      if (!/^\d{9}$/.test(phoneWithoutPrefix)) {
        showError($(field), errorMessages.phone);
        errors.push(errorMessages.phone);
      }
    } else {
      showError($(field), errorMessages.phone);
      errors.push(errorMessages.phone);
    }

    if (errors.length > 0) {
      const $form = $(field).closest("form");
      formSubmitErrorTrial($form.attr("id"), $form.data("action"), phone);
    }

    state.errors = errors;
    return errors;
  }

  function showError($field, message) {
    $field.addClass("error");
    let $errorElement = $field.siblings(".error-box");
    if ($errorElement.length === 0) {
      $errorElement = $('<div class="error-box"></div>').insertAfter($field);
    }
    $errorElement.text(message).show();
  }

  function clearErrors($field) {
    $field.removeClass("error");
    $field.siblings(".error-box").hide();
  }

  function handleFormSubmission(e, phoneField, iti) {
    e.preventDefault();
    let form = phoneField.closest("form");
    const wFormFail = form.find(".w-form-fail");
    phoneField.trigger("blur");
    const valueTrack = DataLayerGatherers.getValueTrackData();
    const loader = form.find(".loading-in-button.is-inner");

    // Create a FormData object
    const formData = new FormData();
    formData.append("action", "create_trial_step2");
    formData.append("phone", iti.getNumber());
    formData.append("formid", "create_trial_step2");
    formData.append("adwords[gclid]", window.myGlobals.gclidValue);
    formData.append("adwords[fbclid]", window.myGlobals.fbclidValue);
    formData.append("analytics_id", window.myGlobals.analyticsId);
    formData.append("sid", SharedUtils.getCurrentSID());

    if (valueTrack) {
      for (const [key, value] of Object.entries(valueTrack)) {
        if (key !== "timestamp") {
          formData.append(`adwords[${key}]`, value);
        }
      }
    }

    if (state.errors.length === 0) {
      const maskedPhoneNumber = maskPhoneNumber(iti.getNumber());
      localStorage.setItem("phoneNumber", maskedPhoneNumber);

      $.ajax({
        type: "POST",
        url: SharedUtils.API_URL,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
          loader.show();
        },
        success: function (data) {
          if (data.status === 0) {
            showError(phoneField, data.errors.phone.invalidPhone);
          } else {
            SharedUtils.handleResponse(
              data,
              form,
              phoneField,
              wFormFail,
              true,
              2
            );
          }
        },
        error: function (data) {
          SharedUtils.handleResponse(
            data,
            form,
            phoneField,
            wFormFail,
            false,
            2
          );
        },
        complete: function () {
          loader.hide();
        },
      });
    } else {
    }
  }

  setupValidation();

  $(document).on("trialStepComplete", function (event, completedStep, data) {
    if (completedStep === 2) {
      const isPremiumPackage =
        localStorage.getItem("isPremiumPackage") === "true";
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_payment_info",
        ecommerce: {
          items: [
            {
              item_id: isPremiumPackage ? "Premium" : "Standard",
              item_name: isPremiumPackage ? "Premium" : "Standard",
              item_category: "Global Header",
              price: isPremiumPackage ? "35" : "499",
              currency: "PLN",
              item_variant: "12",
            },
          ],
        },
        eventLabel: window.location.pathname,
      });

      const $modalTrialTwo = $('[data-element="modal_trial_two"]');
      const $modalTrialThree = $('[data-element="modal_trial_three"]');

      if ($modalTrialTwo.length) {
        $modalTrialTwo.hide();
      }
      if ($modalTrialThree.length) {
        $modalTrialThree.show();
      }

      if (data.license_id) {
      }
    }
  });
});
