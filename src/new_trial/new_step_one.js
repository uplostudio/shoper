// new_step_one.js

$(document).ready(() => {
  let ajaxRequest;
  let currentSID = null;
  let lastProcessedData = null;
  const $modalTrialOne = $('[data-element="modal_trial_one"]');
  const $modalTrialTwo = $('[data-element="modal_trial_two"]');
  const $modalTrialThree = $('[data-element="modal_trial_three"]');
  let isPremiumPackage = false;
  let isStandardPlusPackage = false;

  function updateTrialPromoElements(data, isPremiumPackage, isStandardPlusPackage) {
    const $trialPromo = $('#trial-promo');
    const $trialPromoBox = $('#trial-promo-box');
    let discount, oldPrice, newPrice, packageName;
  
    if (isPremiumPackage) {
      packageName = "Premium";
      discount = data.promotion?.price?.premium?.discount;
      oldPrice = data.price?.premium?.regular_price_year;
      newPrice = data.promotion?.price?.premium?.["12"]?.year?.net;
    } else if (isStandardPlusPackage) {
      packageName = "Standard+";
      discount = data.promotion?.price?.["standard-plus"]?.discount;
      oldPrice = data.price?.["standard-plus"]?.regular_price_year;
      newPrice = data.promotion?.price?.["standard-plus"]?.["12"]?.year?.net;
    } else {
      packageName = "Standard";
      discount = data.promotion?.price?.standard?.discount;
      oldPrice = data.price?.standard?.regular_price_year;
      newPrice = data.promotion?.price?.standard?.["12"]?.year?.net;
    }
    
  
    // Update trial promo
    if (discount && discount !== 0) {
      $trialPromo.text(`${discount}% taniej`).show();
    } else {
      $trialPromo.hide();
    }
  
    // Update trial promo box
    const formattedOldPrice = parseFloat(oldPrice || 0).toLocaleString('pl-PL', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    const formattedNewPrice = parseFloat(newPrice || 0).toLocaleString('pl-PL', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    $trialPromoBox.html(`Shoper ${packageName} w promocji <del>${formattedOldPrice}</del> <strong>${formattedNewPrice} zł</strong> netto / pierwszy rok`);
  }

  const generateErrorMessage = (type) => {
    const messages = {
      email: "Podaj poprawny adres e-mail.",
      required: "To pole jest wymagane.",
    };
    return messages[type] || messages.required;
  };

  const formSubmitErrorTrial = (formId, eventAction, email) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "formSubmitError",
      formId: formId,
      email: email,
      action: eventAction,
      website: "shoper",
      eventLabel: window.location.pathname,
    });
  };

  const validateEmail = ($field) => {
    const email = $field.val().trim();
    const emailRegex = validationPatterns.email;

    let error = null;

    if (!email) {
      error = generateErrorMessage("required");
    } else if (!emailRegex.test(email)) {
      error = generateErrorMessage("email");
    }

    $field.next(".error-box").remove();

    if (error) {
      $field.after(`<span class="error-box">${error}</span>`);
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

  const handleFormSubmission = (e, $form) => {
    e.preventDefault();
    const $emailField = $form.find('[data-type="email"]');
    const error = validateEmail($emailField);
    if (error) {
      formSubmitErrorTrial(
        $form.attr("id"),
        $form.data("action"),
        $emailField.val()
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
      form_source_url: window.location.href.split('?')[0],
      ...DataLayerGatherers.getValueTrackData(),
    };

    if (isPremiumPackage) {
      formData.package = 33;
      formData.period = 12;
      localStorage.setItem('isPremiumPackage', 'true');
      localStorage.setItem('isStandardPlusPackage', 'false');
    } else if (isStandardPlusPackage) {
      formData.package = 38;
      formData.period = 12;
      localStorage.setItem('isPremiumPackage', 'false');
      localStorage.setItem('isStandardPlusPackage', 'true');
    } else {
      localStorage.setItem('isPremiumPackage', 'false');
      localStorage.setItem('isStandardPlusPackage', 'false');
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
          SharedUtils.handleResponse(
            response,
            $form,
            $emailField,
            $wFormFail,
            true,
            1
          );
          DataLayerGatherers.pushEmailSubmittedData(
            window.myGlobals.clientId,
            window.myGlobals.shopId,
            $form.data("action"),
            $emailField.val()
          );
          localStorage.removeItem('shoper_affiliate');

          // Hide all modals first
          $modalTrialOne.hide();
          $modalTrialTwo.hide();
          $modalTrialThree.hide();

          // Show the trials wrapper
          $trialsWrapper.show();

          // Set up the next step
          if (response.step === "#create_trial_step3") {
            $modalTrialThree.show();
          } else {
            $modalTrialTwo.show();
          }

          // Trigger the event
          $(document).trigger("trialStepComplete", [1, response]);
          $('[data-app="trial-domain"]').text(response.host);
        } else {
          // Handle status 0 response (unchanged)
          let error;
          if (
            response.hasOwnProperty("code") &&
            SharedUtils.statusMessages.hasOwnProperty(response.code)
          ) {
            error = SharedUtils.statusMessages[response.code];
          } else {
            error = generateErrorMessage("email");
          }

          $emailField.next(".error-box").remove();
          $emailField.after(`<span class="error-box">${error}</span>`);
          $emailField.removeClass("valid").addClass("invalid");
          $emailField
            .siblings(".new__input-label")
            .removeClass("valid active")
            .addClass("invalid");
          formSubmitErrorTrial(
            $form.attr("id"),
            $form.data("action"),
            $emailField.val()
          );
        }
      })
      .catch((error) => {
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
      '[data-action="create_trial_step1"] [data-type="email"]',
      function () {
        validateEmail($(this));
      }
    );

    $(document).on(
      "keydown",
      '[data-action="create_trial_step1"] [data-type="email"]',
      function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleFormSubmission(e, $(this).closest("form"));
        }
      }
    );

    $(document).on(
      "click",
      '[data-action="create_trial_step1"] [data-form="submit-step-one"]',
      function (e) {
        handleFormSubmission(e, $(this).closest("form"));
      }
    );

    $(document).on(
      "submit",
      '[data-action="create_trial_step1"]',
      function (e) {
        handleFormSubmission(e, $(this));
      }
    );
  };

  const $openTrialWrapperButton = $("[data-element='open_trial_wrapper']");
  if ($openTrialWrapperButton.length) {
    $openTrialWrapperButton.on("click", function () {
      $trialsWrapper.show();
      $("body").addClass("overflow-hidden");

      isPremiumPackage = $(this).data("premium") === true;
      isStandardPlusPackage = $(this).data("standard-plus") === true;

      window.ShoperPricing.addLoadCallback(function (pricingData) {
        updateTrialPromoElements(pricingData, isPremiumPackage, isStandardPlusPackage);
      });
    });
  }

  const $closeTrialWrapperButton = $("[data-element='close_trial_wrapper']");
  if ($closeTrialWrapperButton.length) {
    $closeTrialWrapperButton.on("click", () => {
      $trialsWrapper.hide();
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
    completedStep,
    data
  ) {
    if (
      completedStep === 1 &&
      JSON.stringify(data) !== JSON.stringify(lastProcessedData)
    ) {
      lastProcessedData = data;
      $trialsWrapper.show();

      window.dataLayer = window.dataLayer || [];

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
          price: "35",
        };
      }

      window.dataLayer.push({
        event: "begin_checkout",
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

      if ($modalTrialOne.length) {
        $modalTrialOne.hide();
      }

      if (data.step === "#create_trial_step3") {
        if ($modalTrialTwo.length) {
          $modalTrialTwo.hide();
        }
        if ($modalTrialThree.length) {
          $modalTrialThree.show();
        }
      } else {
        if ($modalTrialTwo.length) {
          $modalTrialTwo.show();
        }
      }

      window.ShoperPricing.addLoadCallback(function (pricingData) {
        updateTrialPromoElements(pricingData, isPremiumPackage, isStandardPlusPackage);
      });
    }
  },
  250);

  $(document)
    .off("trialStepComplete.step1")
    .on("trialStepComplete.step1", handleTrialStepComplete);

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
      '[data-action="create_trial_step1"] [data-type="email"]'
    );
    $(document).off(
      "keydown",
      '[data-action="create_trial_step1"] [data-type="email"]'
    );
    $(document).off(
      "click",
      '[data-action="create_trial_step1"] [data-form="submit-step-one"]'
    );
    $(document).off("submit", '[data-action="create_trial_step1"]');
    $openTrialWrapperButton.off("click");
    $(document).off("trialStepComplete.step1");
  };

  $(window).on("beforeunload", cleanup);
});

$(document).on(
  "formSubmissionComplete",
  function (event, isSuccess, $form, $emailField, data) {
    if (isSuccess) {
      let packageValue = "";
      if (localStorage.getItem('isPremiumPackage') === 'true') {
        packageValue = 33;
      } else if (localStorage.getItem('isStandardPlusPackage') === 'true') {
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
