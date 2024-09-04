$(document).ready(function () {
  const $form = $('[data-formid="create_trial_step3"], [data-name="reseller"]');
  const $submitButton = $form.find('[data-form="submit-step-three"]');
  const $clientTypeRadios = $form.find('input[name="address[client_type]"]');
  const $payNowRadios = $form.find('input[name="pay_now"]');
  const $companyWrapper = $('[data-element="company"]');
  const $consumentWrapper = $('[data-element="consument"]');
  const $trialPromoBox = $("#trial-promo-box");

  function setupForm() {
    const $trialForm = $form.filter('[data-formid="create_trial_step3"]');
    if ($trialForm.length) {
      const email = localStorage.getItem("email");
      const phone = localStorage.getItem("phoneNumber");

      $trialForm.find('[data-form="email"]').val(email).prop("disabled", true);
      $trialForm
        .find('[data-form="number_phone"]')
        .val(phone)
        .prop("disabled", true);
    }

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

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(formData);
  }

  function handleFormSubmission() {
    const isPremiumPackage = localStorage.getItem('isPremiumPackage') === 'true';
    const isStandardPlusPackage = localStorage.getItem('isStandardPlusPackage') === 'true';
    validateForm($form[0]).then((errors) => {
      const phone = localStorage.getItem("phoneNumber") || "";
      const formId = $form.data("formid") || "create_trial_step3";
      const eventAction = formId;

      if (errors === 0) {
        const $nipField = $form.find('input[data-type="nip"]:not([data-exclude="true"]):not(:disabled)');
        const shouldValidateNip =
          $nipField.length > 0 && $nipField.attr("data-exclude") !== "true";

        if (shouldValidateNip) {
          performNIPPreflightCheck($form).then((isNipValid) => {
            if (isNipValid) {
              sendFormDataToURL($form[0]);
              console.log(isPremiumPackage, isStandardPlusPackage);

              DataLayerGatherers.pushFormSubmitSuccessData(formId, eventAction);
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: "ecommerce_purchase",
                ecommerce: {
                  trial: true,
                  trial_type: isPremiumPackage ? "Premium" : (isStandardPlusPackage ? "Standard+" : "Standard"),
                  client_type: "Firma",
                },
                eventLabel: window.location.pathname,
              });
            } else {
              formSubmitErrorTrial(formId, eventAction, phone);
              pushDataLayerError();
            }
          });
        } else {
          sendFormDataToURL($form[0]);
          console.log(isPremiumPackage, isStandardPlusPackage);
          DataLayerGatherers.pushFormSubmitSuccessData(formId, eventAction);
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "ecommerce_purchase",
            ecommerce: {
              trial: true,
              trial_type: isPremiumPackage ? "Premium" : (isStandardPlusPackage ? "Standard+" : "Standard"),
              client_type: "Konsument",
            },
            eventLabel: window.location.pathname,
          });
        }
      } else {
        formSubmitErrorTrial(formId, eventAction, phone);
        pushDataLayerError();
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

      if (data.license_id) {
        // Handle license_id if needed
      }
      if (data.host) {
        // Handle host if needed
      }
    }
  });

  const targetNode = document.querySelector('[data-element="modal_trial_two"]');
  const config = { attributes: true, attributeFilter: ["style"] };

  const callback = function (mutationsList) {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const display = window.getComputedStyle(targetNode).display;
        if (display === "none") {
          const $trialForm = $form.filter('[data-formid="create_trial_step3"]');
          if ($trialForm.length) {
            const email = localStorage.getItem("email");
            const phone = localStorage.getItem("phoneNumber");

            $trialForm
              .find('[data-form="email"]')
              .val(email)
              .prop("disabled", true);
            $trialForm
              .find('[data-form="number_phone"]')
              .val(phone)
              .prop("disabled", true);
          }
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
});
