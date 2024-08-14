// new_step_one.js

$(document).ready(() => {
  let ajaxRequest;
  let currentSID = null;
  let lastProcessedData = null;
  const $modalTrialOne = $('[data-element="modal_trial_one"]');
  const $modalTrialTwo = $('[data-element="modal_trial_two"]');
  const $modalTrialThree = $('[data-element="modal_trial_three"]');

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

      const $form = $field.closest("form");
      formSubmitErrorTrial($form.attr("id"), $form.data("action"), email);
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
    if (validateEmail($emailField)) return;

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
      affiliant: $form.data("affiliant") || "",
      ...DataLayerGatherers.getValueTrackData(),
    };

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
        $(document).trigger("trialStepComplete", [1, response]);
        $('[data-app="trial-domain"]').text(response.host);
        if (response.step === "#create_trial_step3") {
          $trialsWrapper.show();
          if ($modalTrialTwo.length) {
            $modalTrialTwo.hide();
          }
          if ($modalTrialThree.length) {
            $modalTrialThree.show();
          }
        } else {
          if ($modalTrialTwo.length) {
            $modalTrialThree.hide()
            $modalTrialTwo.show();
          }
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
    $openTrialWrapperButton.on("click", () => {
      $trialsWrapper.show();
      $("body").addClass("overflow-hidden");
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
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          value: 420,
          items: [
            {
              item_id: "Standard",
              item_name: "Standard",
              item_category: "Global Header",
              price: "35",
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
      DataLayerGatherers.pushTrackEventDataModal(
        window.myGlobals.clientId,
        $form.data("action"),
        window.myGlobals.shopId,
        $form.data("action"),
        $emailField.val()
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
