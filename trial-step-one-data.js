const DataLayerGatherers = {
  formAbandonEvent: function () {
    const $formContainer = $('[data-action="create_trial_step1"]');

    let isFormModified = false;

    $formContainer.find("input").on("input", function () {
      isFormModified = true;
    });

    $(document).on("click", function (event) {
      if (!$(event.target).closest($formContainer).length) {
        if (isFormModified && !$formContainer.data("submitted")) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "formAbandon",
            formId: $formContainer.attr("data-action"),
            eventHistory: window.history,
          });

          console.log(window.dataLayer);

          isFormModified = false;
        }
      }
    });

    $formContainer.on("submit", function () {
      $(this).data("submitted", true);
    });
  },

  controlBlur: function () {
    const $formContainer = $('[data-action="create_trial_step1"]');

    $formContainer.find("input").on("blur", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "controlBlur",
        formId: $formContainer.attr("data-action"),
        controlName: $(this).attr("data-form"),
        controlType: $(this).attr("type"),
        controlValue: $(this).val(),
      });
    });
  },

  controlFocus: function () {
    const $formContainer = $('[data-action="create_trial_step1"]');

    $formContainer.find("input").on("focus", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "controlFocus",
        formId: $formContainer.attr("data-action"),
        controlName: $(this).attr("data-form"),
        controlType: $(this).attr("type"),
        controlValue: $(this).val(),
      });
    });
  },
};

$(document).ready(function () {
  DataLayerGatherers.formAbandonEvent();
  DataLayerGatherers.controlBlur();
  DataLayerGatherers.controlFocus();
});
