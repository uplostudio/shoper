$(document).ready(() => {
  const state = {
    errors: [],
    phoneRegex: window.validationPatterns["number_phone"],
  };

  const $twoStepTrialsWrapper = $('[data-element="trial_wrapper"]');
  let ajaxRequest, currentSID, lastProcessedData;
  let isUsingModal = false;
  let isPremiumPackage = false;
  let isStandardPlusPackage = false;
  let formType = "inline";

  const updateTrialPromoElements = (
    data,
    isPremiumPackage,
    isStandardPlusPackage
  ) => {
    const $trialPromo = $("#trial-promo");
    const $trialPromoBox = $("#trial-promo-box");
    const packageInfo = isPremiumPackage
      ? { name: "Premium", key: "premium" }
      : isStandardPlusPackage
      ? { name: "Standard+", key: "standard-plus" }
      : { name: "Standard", key: "standard" };

    const discount = data.promotion?.price?.[packageInfo.key]?.discount;
    const oldPrice = data.price?.[packageInfo.key]?.regular_price_year;
    const newPrice = data.promotion?.price?.[packageInfo.key]?.[12]?.year?.net;

    discount && discount !== 0
      ? $trialPromo.text(`${discount}% taniej`).show()
      : $trialPromo.hide();

    const formatPrice = (price) =>
      parseFloat(price || 0).toLocaleString("pl-PL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    $trialPromoBox.html(
      `Shoper ${packageInfo.name} w promocji <del>${formatPrice(
        oldPrice
      )}</del> <strong>${formatPrice(
        newPrice
      )} zł</strong> netto / pierwszy rok`
    );
  };

  const generateErrorMessage = (type) =>
    ({
      email:
        "Niepoprawny adres e-mail. Wprowadź adres w formacie: nazwa@domena.pl",
      required: "To pole jest wymagane.",
      phone: "Niepoprawny numer telefonu. Wprowadź poprawny numer telefonu.",
    }[type] || "To pole jest wymagane.");

  const formSubmitErrorTrial = (formId, eventAction, email, phone) => {
    DataLayerGatherers.pushDataLayerEvent({
      event: "formSubmitError",
      formId,
      email,
      phone,
      action: eventAction,
      website: "shoper",
      eventLabel: window.location.pathname,
    });
  };

  const validateField = ($field, type) => {
    const isCheckbox = $field.attr("data-type") === "checkbox";
    const value = isCheckbox ? $field.prop("checked") : $field.val().trim();
    const regex =
      type === "email" ? validationPatterns.email : state.phoneRegex;
    let error = null;

    if ((!isCheckbox && !value) || (isCheckbox && !value)) {
      error = generateErrorMessage("required");
    } else if (!isCheckbox && !regex.test(value)) {
      error = generateErrorMessage(type);
    }

    $field.next(".error-box").remove();

    if (error) {
      if (!isCheckbox) {
        $field.after(`<span class="error-box">${error}</span>`);
      }
      $field.removeClass("valid").addClass("invalid");
      $field
        .siblings(".new__input-label")
        .removeClass("valid active")
        .addClass("invalid");
    } else {
      $field.removeClass("invalid").addClass("valid");
      $field
        .siblings(".new__input-label")
        .removeClass("invalid")
        .addClass("valid");
    }

    return error;
  };

  const validatePhone = (field) => {
    const $field = $(field);
    const iti = window.intlTelInputGlobals.getInstance(field);

    if (!iti) {
      console.error("IntlTelInput instance not found for field:", field);
      return "IntlTelInput not initialized";
    }

    let error = null;
    const countryCode = iti.getSelectedCountryData().iso2;
    let phone = iti.getNumber().trim();

    clearErrors($field);

    const phoneErrorMessage =
      "Niepoprawny numer telefonu. Wprowadź numer składający się z 9 cyfr w formacie: 123456789";
    const polishPhonePattern = /^(?:\+48)?(?:(?:[\s-]?\d{3}){3}|\d{9})$/;

    if (!phone) {
      error = generateErrorMessage("required");
    } else if (countryCode === "pl") {
      const phoneDigitsOnly = phone.replace(/\D/g, "");
      const phoneWithoutCountryCode = phoneDigitsOnly.startsWith("48")
        ? phoneDigitsOnly.slice(2)
        : phoneDigitsOnly;

      if (
        phoneWithoutCountryCode.length !== 9 ||
        !polishPhonePattern.test(phone)
      ) {
        error = phoneErrorMessage;
      }
    } else if (!iti.isValidNumber()) {
      error = phoneErrorMessage;
    }

    error ? showError($field, error) : updateInputLabel($field, "valid");

    return error;
  };

  const showError = ($field, message) => {
    $field.addClass("error");
    let $errorElement = $field.siblings(".error-box");
    if ($errorElement.length === 0) {
      $errorElement = $('<div class="error-box"></div>').insertAfter($field);
    }
    $errorElement.text(message).show();
  };

  const clearErrors = ($field) => {
    $field.removeClass("error");
    $field.siblings(".error-box").hide();
  };

  const updateInputLabel = ($field, state) => {
    const $label = $field.siblings(".new__input-label");
    $label.removeClass("valid invalid").addClass(state);
    $field.removeClass("valid invalid").addClass(state);
  };

  const populatePhoneNumberFromLocalStorage = () => {
    const storedPhoneNumber = localStorage.getItem("originalPhoneNumber");
    if (storedPhoneNumber) {
      const $phoneInput = $(
        '[data-form="phone_number"]',
        $twoStepTrialsWrapper
      );
      $phoneInput.val(storedPhoneNumber).prop("disabled", true);

      const iti = window.intlTelInputGlobals.getInstance($phoneInput[0]);
      if (iti) {
        iti.setNumber(originalPhoneNumber);
        iti.disable();
      }
    }
  };

  const switchToModal = (modalElement) => {
    $twoStepTrialsWrapper.find('[data-element^="modal_trial_"]').hide();
    $twoStepTrialsWrapper.find(`[data-element="${modalElement}"]`).show();

    if (modalElement === "modal_trial_three") {
      populatePhoneNumberFromLocalStorage();
    }
  };

  const handleFormSubmission = (e, $form) => {
    e.preventDefault();

    const $emailField = $form.find('[data-type="email"]');
    const $phoneField = $form.find('[data-type="phone"]');
    const $checkboxField = $form.find('[data-type="checkbox"]');

    const checkboxError = $checkboxField.length
      ? validateField($checkboxField, "checkbox")
      : null;
    const emailError = $emailField.length
      ? validateField($emailField, "email")
      : null;
    const phoneError = $phoneField.length
      ? validatePhone($phoneField[0])
      : null;

    if (emailError || phoneError || checkboxError) {
      formSubmitErrorTrial(
        $form.attr("id"),
        $form.data("action"),
        $emailField.val(),
        $phoneField.val(),
        $checkboxField.val()
      );
      return;
    }

    const $wFormFail = $form.next().next();
    const $loader = $form.find(".loading-in-button.is-inner");
    $loader.show();

    if (ajaxRequest && ajaxRequest.abort) {
      ajaxRequest.abort();
    }

    const formData = {
      action: $form.data("action"),
      email: $emailField.val(),
      "adwords[gclid]": window.myGlobals.gclidValue,
      "adwords[fbclid]": window.myGlobals.fbclidValue,
      analyticsId: window.myGlobals.analyticsId,
      affiliant: shoperAffiliate || "",
      form_source_url: window.location.href.split("?")[0],
      ...DataLayerGatherers.addUtmDataToForm({}),
    };

    if ($checkboxField.length) {
      formData[`${$checkboxField.attr("id")}`] = $checkboxField.prop("checked")
        ? 1
        : 0;
    }

    if ($phoneField.length) {
      const iti = window.intlTelInputGlobals.getInstance($phoneField[0]);
      if (iti) {
        formData.phone = iti.getNumber();
      } else {
        console.error("IntlTelInput instance not found for phone field");
      }
    }

    if (isPremiumPackage) {
      formData.package = 33;
      formData.period = 12;
      localStorage.setItem("isPremiumPackage", "true");
      localStorage.setItem("isStandardPlusPackage", "false");
    } else if (isStandardPlusPackage) {
      formData.package = 38;
      formData.period = 12;
      localStorage.setItem("isPremiumPackage", "false");
      localStorage.setItem("isStandardPlusPackage", "true");
    } else {
      localStorage.setItem("isPremiumPackage", "false");
      localStorage.setItem("isStandardPlusPackage", "false");
    }

    const localStorageSID = localStorage.getItem("sid");
    if (localStorageSID) {
      try {
        const parsedSID = JSON.parse(localStorageSID);
        if (parsedSID.value) {
          formData.sid = parsedSID.value;
        }
      } catch (e) {
        console.error("Failed to parse SID from localStorage:", e);
      }
    }

    if (currentSID) {
      formData.sid = currentSID;
    }

    ajaxRequest = $.ajax({
      url: SharedUtils.API_URL,
      method: "POST",
      timeout: 30000,
      data: formData,
    });

    ajaxRequest
      .then((response) => {
        if (response.status === 1) {
          if ($phoneField.length) {
            const iti = window.intlTelInputGlobals.getInstance($phoneField[0]);
            if (iti) {
              const maskedPhoneNumber = maskPhoneNumber(iti.getNumber());
              localStorage.setItem("phoneNumber", maskedPhoneNumber);
              localStorage.setItem("originalPhoneNumber", iti.getNumber());
            }
          }
          SharedUtils.handleResponse(
            response,
            $form,
            $emailField,
            $wFormFail,
            true,
            1
          );
          localStorage.removeItem("shoper_affiliate");

          if ($form.data("action") === "validate_email") {
            const newEmail = $emailField.val();
            const storedEmail = localStorage.getItem("trialEmail");
            const trialCompleted =
              localStorage.getItem("trialCompleted") === "true";

            if (newEmail !== storedEmail || !trialCompleted) {
              localStorage.setItem("trialEmail", newEmail);
              localStorage.setItem("trialCompleted", "false");
              switchToModal("modal_trial_one_two");
            } else {
              switchToModal("modal_trial_three");
            }

            $('[data-form="email"]', $twoStepTrialsWrapper)
              .val(newEmail)
              .prop("disabled", true);
            $twoStepTrialsWrapper.show();
          } else if ($form.data("action") === "create_trial_step1_new") {
            switchToModal("modal_trial_three");
            localStorage.setItem("trialCompleted", "true");
          }

          let actualCompletedStep = 0;
          if (response.step === "#create_trial_step1") {
            actualCompletedStep = 0;
          } else if (response.hasOwnProperty("client_id")) {
            actualCompletedStep = 1;
            dataLayer.push({
              event: "sign_up",
              user_id: response.client_id || "undefined",
              method: "url",
              shop_id: response.shop_id || "undefined",
            });
          } else if (response.hasOwnProperty("redirect")) {
            actualCompletedStep = 2;
          }

          $(document).trigger("actualTrialStepComplete", [
            actualCompletedStep,
            response,
            $form,
          ]);
          $('[data-app="trial-domain"]').text(response.host);
        } else {
          let error;
          if (
            response.hasOwnProperty("code") &&
            SharedUtils.statusMessages.hasOwnProperty(response.code)
          ) {
            error = SharedUtils.statusMessages[response.code];
          } else {
            error = generateErrorMessage("email");
          }

          showError($emailField, error);
          formSubmitErrorTrial(
            $form.attr("id"),
            $form.data("action"),
            $emailField.val()
          );
        }
      })
      .catch((error) => {
        console.error("Ajax error:", error);
        SharedUtils.handleResponse(
          error,
          $form,
          $emailField,
          $wFormFail,
          false,
          1
        );
      })
      .always(() => {
        $loader.hide();
        ajaxRequest = null;
      });
  };

  const setupValidation = () => {
    $(document).on(
      "blur",
      '[data-action="create_trial_step1_new"] [data-type="email"], [data-action="validate_email"] [data-type="email"]',
      function () {
        validateField($(this), "email");
      }
    );

    $(document).on("blur", '[data-type="phone"]', function () {
      validatePhone(this);
    });

    $(document).on(
      "keydown",
      '[data-action="create_trial_step1_new"] [data-type="email"], [data-action="validate_email"] [data-type="email"], [data-type="phone"]',
      function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleFormSubmission(e, $(this).closest("form"));
        }
      }
    );

    $(document).on(
      "click",
      '[data-form="submit-step-one-two"], [data-form="validate_email"]',
      function (e) {
        formType = isUsingModal ? "modal" : "inline";
        handleFormSubmission(e, $(this).closest("form"));
      }
    );

    $(document).on(
      "submit",
      '[data-action="create_trial_step1_new"], [data-action="validate_email"]',
      function (e) {
        handleFormSubmission(e, $(this));
      }
    );

    $('[data-type="phone"]').each(function () {
      window.intlTelInput(this, {
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
        preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
        autoInsertDialCode: false,
        nationalMode: false,
        separateDialCode: true,
        autoPlaceholder: "off",
        initialCountry: "pl",
      });
    });
  };

  const $openTwoStepTrialWrapperButton = $(
    "[data-element='open_trial_wrapper']"
  );

  if ($openTwoStepTrialWrapperButton.length) {
    $openTwoStepTrialWrapperButton.on("click", function () {
      isUsingModal = true;
      formType = isUsingModal ? "modal" : "inline";
      $twoStepTrialsWrapper.show();

      const storedEmail = localStorage.getItem("trialEmail");
      const trialCompleted = localStorage.getItem("trialCompleted") === "true";

      let initialStep;
      if (trialCompleted) {
        switchToModal("modal_trial_three");
        initialStep = 2;
      } else {
        switchToModal("modal_trial_one_two");
        initialStep = 0;
      }

      // Track initial form step
      DataLayerGatherers.pushFormInteractionEvent(
        "create_trial_button",
        window.location.pathname,
        formType,
        initialStep === 0
          ? "email"
          : initialStep === 2
          ? "last_step"
          : "unknown"
      );

      if (storedEmail) {
        $('[data-form="email"]', $twoStepTrialsWrapper)
          .val(storedEmail)
          .prop("disabled", true);
      }

      $(document).trigger("trialModalOpened", ["new_flow"]);
      $(document).trigger("trialStepStarted", [trialCompleted ? 3 : 1]);
      $(document).trigger("trialStepViewed", [trialCompleted ? 3 : 1]);
      $("body").addClass("overflow-hidden");

      isPremiumPackage = $(this).data("premium") === true;
      isStandardPlusPackage = $(this).data("standard-plus") === true;

      // Determine package details
      let packageDetails;
      if (isPremiumPackage) {
        packageDetails = {
          trial_type: "Premium",
          item_id: "Premium",
          item_name: "Premium",
          price: "499",
        };
      } else if (isStandardPlusPackage) {
        packageDetails = {
          trial_type: "Standard+",
          item_id: "Standard+",
          item_name: "Standard+",
          price: "35",
        };
      } else {
        packageDetails = {
          trial_type: "Standard",
          item_id: "Standard",
          item_name: "Standard",
          price: "25",
        };
      }

      DataLayerGatherers.pushDataLayerEvent({
        event: "begin_checkout",
        formId: "create_trial_button",
        form_type: formType,
        ecommerce: {
          value: "420",
          items: [
            {
              ...packageDetails,
              item_category: "Global Header",
              currency: "PLN",
              item_variant: "12",
            },
          ],
        },
        eventLabel: window.location.pathname,
      });

      window.ShoperPricing.addLoadCallback(function (pricingData) {
        updateTrialPromoElements(
          pricingData,
          isPremiumPackage,
          isStandardPlusPackage
        );
      });
    });
  }

  const $closeTrialWrapperButton = $("[data-element='close_trial_wrapper']");
  if ($closeTrialWrapperButton.length) {
    $closeTrialWrapperButton.on("click", () => {
      $twoStepTrialsWrapper.hide();
      $("body").removeClass("overflow-hidden");
    });
  }

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const handleTrialStepComplete = debounce(function (
    event,
    actualCompletedStep,
    data,
    $form
  ) {
    let packageDetails;
    if (isPremiumPackage) {
      packageDetails = {
        trial_type: "Premium",
        item_id: "Premium",
        item_name: "Premium",
        price: "499",
      };
    } else if (isStandardPlusPackage) {
      packageDetails = {
        trial_type: "Standard+",
        item_id: "Standard+",
        item_name: "Standard+",
        price: "35",
      };
    } else {
      packageDetails = {
        trial_type: "Standard",
        item_id: "Standard",
        item_name: "Standard",
        price: "25",
      };
    }

    let formId = $form && $form.length ? $form.attr("id") : "unknown";
    // Determine form step based on the flow and completed step
    let formStep;
    if (isUsingModal) {
      // Modal flow (started with openTwoStepTrialWrapperButton)
      switch (actualCompletedStep) {
        case 0:
          formStep = "email";
          break;
        case 1:
          formStep = "email_phone";
          break;
        case 2:
          formStep = "last_step";
          break;
        default:
          formStep = "unknown";
      }
    } else {
      // Inline flow
      switch (actualCompletedStep) {
        case 0:
          formStep = "email";
          break;
        case 1:
          formStep = "phone";
          break;
        case 2:
          formStep = "last_step";
          break;
        default:
          formStep = "unknown";
      }
    }

    DataLayerGatherers.pushFormInteractionEvent(
      formId,
      window.location.pathname,
      isUsingModal ? "modal" : "inline",
      formStep
    );

    if (actualCompletedStep === 0) {
      DataLayerGatherers.pushDataLayerEvent({
        event: "begin_checkout",
        formId: formId,
        form_type: isUsingModal ? "modal" : "inline",
        ecommerce: {
          value: "420",
          items: [
            {
              ...packageDetails,
              item_category: "Global Header",
              currency: "PLN",
              item_variant: "12",
            },
          ],
        },
        eventLabel: window.location.pathname,
      });
    } else if (actualCompletedStep === 1) {
      DataLayerGatherers.pushDataLayerEvent({
        event: "add_payment_info",
        formId: formId,
        form_type: isUsingModal ? "modal" : "inline",
        ecommerce: {
          value: "420",
          items: [
            {
              ...packageDetails,
              item_category: "Global Header",
              currency: "PLN",
              item_variant: "12",
            },
          ],
        },
        eventLabel: window.location.pathname,
      });
    }

    if (JSON.stringify(data) !== JSON.stringify(lastProcessedData)) {
      lastProcessedData = data;
      window.ShoperPricing.addLoadCallback(function (pricingData) {
        updateTrialPromoElements(
          pricingData,
          isPremiumPackage,
          isStandardPlusPackage
        );
      });
    }
  },
  250);

  $(document)
    .off("actualTrialStepComplete")
    .on(
      "actualTrialStepComplete",
      function (event, actualCompletedStep, data, $form) {
        handleTrialStepComplete(event, actualCompletedStep, data, $form);
      }
    );

  setupValidation();
  SharedUtils.checkAndUpdateSID();
  setInterval(SharedUtils.checkAndUpdateSID, 60 * 60 * 1000);

  if (typeof updateAnalytics === "function") {
    updateAnalytics();
  } else {
    console.warn("updateAnalytics function is not defined");
  }

  const cleanup = () => {
    if (ajaxRequest) {
      ajaxRequest.abort();
    }
    $(document).off(
      "blur",
      '[data-action="create_trial_step1_new"] [data-type="email"], [data-action="validate_email"] [data-type="email"]'
    );
    $(document).off("blur", '[data-type="phone"]');
    $(document).off(
      "keydown",
      '[data-action="create_trial_step1_new"] [data-type="email"], [data-action="validate_email"] [data-type="email"], [data-type="phone"]'
    );
    $(document).off(
      "click",
      '[data-form="submit-step-one-two"], [data-form="validate_email"]'
    );
    $(document).off(
      "submit",
      '[data-action="create_trial_step1_new"], [data-action="validate_email"]'
    );
    $openTwoStepTrialWrapperButton.off("click");
    $(document).off("actualTrialStepComplete");
  };

  $(window).on("beforeunload", cleanup);

  // Incorporating logic from new_step_three.js
  $(document).ready(function () {
    const $form = $(
      '[data-formid="create_trial_step2_new"], [data-name="reseller"]'
    );
    const $submitButton = $form.find('[data-form="submit-step-three"]');
    const $clientTypeRadios = $form.find('input[name="address[client_type]"]');
    const $payNowRadios = $form.find('input[name="pay_now"]');
    const $companyWrapper = $('[data-element="company"]');
    const $consumentWrapper = $('[data-element="consument"]');
    const $trialPromoBox = $("#trial-promo-box");

    function setupForm() {
      const $trialForm = $form.filter('[data-formid="create_trial_step2_new"]');
      if ($trialForm.length) {
        const email = localStorage.getItem("email");
        const phone = localStorage.getItem("originalPhoneNumber");

        $trialForm
          .find('[data-form="email"]')
          .val(email)
          .prop("disabled", true);
        $trialForm
          .find('[data-form="phone_number"]')
          .val(phone)
          .prop("disabled", true);
      }

      SharedUtils.populateCountrySelect("#address1\\[country\\]");

      $clientTypeRadios
        .filter('[value="1"]')
        .prop("checked", true)
        .closest("label")
        .addClass("is-checked");
      toggleClientTypeFields();

      $clientTypeRadios.on("change", function () {
        $clientTypeRadios.closest("label").removeClass("is-checked");
        $(this).closest("label").addClass("is-checked");
        toggleClientTypeFields();
      });

      $payNowRadios.on("change", toggleTrialPromoBox);

      $submitButton.on("click", function (e) {
        e.preventDefault();
        handleFormSubmission();
      });

      $form.find("input, select, textarea").each(function () {
        const $input = $(this);
        $input.data("touched", false);
        $input.data("initial-placeholder", $input.attr("placeholder"));
      });
    }

    function clearAllErrors() {
      $form.find(".invalid").removeClass("invalid");
      $form.find(".error-box").remove();
    }

    function toggleClientTypeFields() {
      const isCompany = $clientTypeRadios.filter(":checked").val() === "1";
      $companyWrapper
        .toggleClass("hide", !isCompany)
        .find("input")
        .prop("disabled", !isCompany)
        .attr("data-exclude", isCompany ? null : "true");
      $consumentWrapper
        .toggleClass("hide", isCompany)
        .find("input")
        .prop("disabled", isCompany)
        .attr("data-exclude", isCompany ? "true" : null);
      clearAllErrors();
    }

    function toggleTrialPromoBox() {
      const isPayNow = $payNowRadios.filter(":checked").val() === "1";
      $trialPromoBox.toggle(isPayNow);

      const $submitButtonLabel = $submitButton.find("#label");
      $submitButtonLabel.text(
        isPayNow ? "Zapłać teraz" : "Rozpocznij darmowy okres próbny"
      );
    }

    function formSubmitErrorTrial(formId, eventAction, phone) {
      const formData = {
        event: "formSubmitError",
        formid: formId || "",
        action: eventAction || "",
        "address1[client_type]":
          $form.find('input[name="address[client_type]"]:checked').val() || "",
        "address1[first_name]":
          $form.find('input[name="address[first_name]"]').val() || "",
        "address1[last_name]":
          $form.find('input[name="address[last_name]"]').val() || "",
        "address1[line_1]":
          $form.find('input[name="address[line_1]"]').val() || "",
        "address1[post_code]":
          $form.find('input[name="address[post_code]"]').val() || "",
        "address1[city]": $form.find('input[name="address[city]"]').val() || "",
        "address1[country]":
          $form.find('select[name="address[country]"]').val() || "",
        pay_now: $form.find('input[name="pay_now"]:checked').val() || "",
        accept: 1,
        website: "shoper",
        eventLabel: window.location.pathname || "",
      };

      DataLayerGatherers.pushDataLayerEvent(formData);
    }

    function handleFormSubmission() {
      const isPremiumPackage =
        localStorage.getItem("isPremiumPackage") === "true";
      const isStandardPlusPackage =
        localStorage.getItem("isStandardPlusPackage") === "true";
      validateForm($form[0]).then((errors) => {
        const phone = localStorage.getItem("originalPhoneNumber") || "";
        const formId = $form.data("formid");
        const eventAction = formId;

        if (errors === 0) {
          const $nipField = $form.find(
            'input[data-type="nip"]:not([data-exclude="true"]):not(:disabled)'
          );
          const shouldValidateNip =
            $nipField.length > 0 && $nipField.attr("data-exclude") !== "true";

          if (shouldValidateNip) {
            performNIPPreflightCheck($form).then((isNipValid) => {
              if (isNipValid) {
                sendFormDataToURL($form[0], true);
                DataLayerGatherers.pushFormSubmitSuccessData(
                  formId,
                  eventAction
                );
                DataLayerGatherers.pushFormInteractionEvent(
                  formId,
                  window.location.pathname,
                  isUsingModal ? "modal" : "inline",
                  "last_step"
                );
                DataLayerGatherers.pushDataLayerEvent({
                  event: "ecommerce_purchase",
                  ecommerce: {
                    trial: true,
                    trial_type: isPremiumPackage
                      ? "Premium"
                      : isStandardPlusPackage
                      ? "Standard+"
                      : "Standard",
                    client_type: "Firma",
                  },
                  eventLabel: window.location.pathname,
                  form_type: formType,
                });
              } else {
                formSubmitErrorTrial(formId, eventAction, phone);
                pushDataLayerError();
              }
            });
          } else {
            sendFormDataToURL($form[0], true);
            DataLayerGatherers.pushFormSubmitSuccessData(formId, eventAction);
            DataLayerGatherers.pushFormInteractionEvent(
              formId,
              window.location.pathname,
              isUsingModal ? "modal" : "inline",
              "last_step"
            );
            DataLayerGatherers.pushDataLayerEvent({
              event: "ecommerce_purchase",
              ecommerce: {
                trial: true,
                trial_type: isPremiumPackage
                  ? "Premium"
                  : isStandardPlusPackage
                  ? "Standard+"
                  : "Standard",
                client_type: "Konsument",
              },
              eventLabel: window.location.pathname,
              form_type: formType,
            });
          }
        } else {
          formSubmitErrorTrial(formId, eventAction, phone);
          pushDataLayerError();
        }
      });
    }

    setupForm();

    $(document).on(
      "actualTrialStepComplete",
      function (event, actualCompletedStep, data) {
        if (actualCompletedStep === 2) {
          const $modalTrialThree = $('[data-element="modal_trial_three"]');
          const $modalTrialSuccess = $('[data-element="modal_trial_success"]');

          if ($modalTrialThree.length) {
            $modalTrialThree.hide();
          }
          if ($modalTrialSuccess.length) {
            $modalTrialSuccess.show();
          }
        }
      }
    );
  });
});

$(document).on(
  "formSubmissionComplete",
  function (event, isSuccess, $form, $emailField, data) {
    if (isSuccess) {
      let packageValue = "";
      if (localStorage.getItem("isPremiumPackage") === "true") {
        packageValue = 33;
      } else if (localStorage.getItem("isStandardPlusPackage") === "true") {
        packageValue = 38;
      }
      DataLayerGatherers.pushTrackEventDataModal(
        window.myGlobals.clientId,
        $form.data("action"),
        window.myGlobals.shopId,
        $form.data("action"),
        $emailField.val(),
        packageValue
      );
    } else {
      DataLayerGatherers.pushTrackEventError(
        $form.data("action"),
        $form.find("#label").text(),
        $emailField.val()
      );
    }
  }
);

function maskPhoneNumber(phone) {
  return phone.replace(/(\+48)(\d{7})(\d{2})/, "$1 *** *** *$3");
}
