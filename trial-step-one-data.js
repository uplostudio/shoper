const DataLayerGatherers = {
  formAbandonEvent: function () {
    const $formContainer = $('[data-action="create_trial_step1"]');

    console.log("abandon");

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

          isFormModified = false;
        }
      }
    });

    $formContainer.on("submit", function () {
      $(this).data("submitted", true);
    });
  },

  // Add other dataLayer gathering functions as needed
  // anotherDataLayerEvent: function() {...},
  // someOtherDataLayerEvent: function() {...},
};

$(document).ready(function () {
  DataLayerGatherers.formAbandonEvent();

  // Call other dataLayer gathering functions
  // DataLayerGatherers.anotherDataLayerEvent();
  // DataLayerGatherers.someOtherDataLayerEvent();
});
