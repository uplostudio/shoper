// step_three.js

$(document).ready(function () {
  const $form = $('[data-formid="create_trial_step3"]');
  const $submitButton = $form.find('[data-form="submit-step-three"]');
  const $clientTypeRadios = $form.find('input[name="address[client_type]"]');
  const $payNowRadios = $form.find('input[name="pay_now"]');
  const $companyWrapper = $('[data-element="company"]');
  const $consumentWrapper = $('[data-element="consument"]');
  const $trialPromoBox = $("#trial-promo-box");

  function setupForm() {
    // Populate email and phone from localStorage
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phoneNumber");

    $form.find('[data-form="email"]').val(email).prop("disabled", true);
    $form.find('[data-form="number_phone"]').val(phone).prop("disabled", true);

    // Set up country select
    SharedUtils.populateCountrySelect("#address1\\[country\\]");

    // Initial setup for client type
    $clientTypeRadios
      .filter('[value="1"]')
      .prop("checked", true)
      .closest("label")
      .addClass("is-checked");
    toggleClientTypeFields();

    // Event listeners
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

    // Use the existing input handling from form-handler-main.js
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

    // Change the button label
    const $submitButtonLabel = $submitButton.find("#label");
    if (isPayNow) {
      $submitButtonLabel.text("Zapłać teraz");
    } else {
      $submitButtonLabel.text("Rozpocznij darmowy okres próbny");
    }
  }

  function handleFormSubmission() {
    validateForm($form[0]).then(errors => {
        if (errors === 0) {
            performNIPPreflightCheck($form).then(isNipValid => {
                if (isNipValid) {
                    sendFormDataToURL($form[0]);
                } else {
                    window.dataLayer.push({
                        event: "myTrackEvent",
                        eventCategory: "Button modal form error",
                        eventAction: $submitButton.val(),
                        eventLabel: window.location.href,
                        eventType: $form.attr("data-label") || "consult-form",
                    });
                }
            });
        } else {
            window.dataLayer.push({
                event: "myTrackEvent",
                eventCategory: "Button modal form error",
                eventAction: $submitButton.val(),
                eventLabel: window.location.href,
                eventType: $form.attr("data-label") || "consult-form",
            });
        }
    });
}


  setupForm();

  $(document).on("trialStepComplete", function (event, completedStep, data) {
    if (completedStep === 3) {
      const $modalTrialThree = $('[data-element="modal_trial_three"]');
      const $modalTrialSuccess = $('[data-element="modal_trial_success"]');

      if ($modalTrialThree.length) {
        $modalTrialThree.hide();
      }
      if ($modalTrialSuccess.length) {
        $modalTrialSuccess.show();
      }

      console.log("Step 3 completed successfully");
      if (data.license_id) {
        console.log("License ID:", data.license_id);
      }
      if (data.host) {
        console.log("Host:", data.host);
      }
    }
  });
});

$(document).on(
  "formSubmissionComplete",
  function (event, isSuccess, $form, $field, data) {
    if (isSuccess) {
      DataLayerGatherers.pushEmailSubmittedData(
        window.myGlobals.clientId,
        window.myGlobals.shopId,
        $form.data("action"),
        "********"
      );
    } else {
      DataLayerGatherers.pushTrackEventError(
        $form.data("action"),
        $form.find("#label").text(),
        "********"
      );
    }
  }
);
