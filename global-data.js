window.myGlobals = {
  clientId: null,
  host: null,
  shopId: null,
  analyticsId: null,
  licenseId: null,
  URL: null,
};

window.myGlobals.URL = "https://www.shoper.pl/ajax.php";
// window.myGlobals.URL = "https://sandbox.shoper.pl/ajax.php";
// console.log(`Current endpoint: ${window.myGlobals.URL}`);

const DataLayerGatherers = {
  formAbandonEvent: function () {
    const $formContainer = $('[data-action="create_trial_step1"], [data-action="create_trial_step2"]');

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
    const $formContainer = $('[data-action="create_trial_step1"], [data-action="create_trial_step2"]');

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
    const $formContainer = $('[data-action="create_trial_step1"], [data-action="create_trial_step2"]');

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

  pushEmailSubmittedData: function (clientId, shopId, formId, email) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "trial_EmailSubmitted",
      client_id: clientId,
      "shop-id": shopId,
      formId: formId,
      email: email,
    });
  },

  pushFormSubmitSuccessData: function (formId, eventType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      eventName: "formSubmitSuccess",
      formId: formId,
      eventCategory: "Button form sent",
      eventLabel: window.location.pathname,
      eventType: eventType,
      eventHistory: window.history,
    });
  },

  pushTrackEventData: function (formId, eventAction, eventType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "myTrackEvent",
      formId: formId,
      eventCategory: "Button form sent",
      eventAction: eventAction,
      eventType: eventType,
      eventLabel: window.location.pathname,
    });
  },
  pushTrackEventDataModal: function (client_id, formId, shopId, eventAction, eventType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "formSubmitSuccess",
      eventCategory: "Button modal form sent",
      client_id: client_id,
      formId: formId,
      "shop-id": shopId,
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
      eventHistory: window.history,
    });
  },
  pushTrackEventDataModalRegular: function (formId, eventAction) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "myTrackEvent",
      eventCategory: "Button modal form sent",
      formId: formId,
      eventAction: eventAction,
      eventLabel: window.location.pathname,
    });
  },
  pushTrackEventDataModalRegularError: function (formId, eventAction) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "myTrackEvent",
      eventCategory: "Button modal form error",
      formId: formId,
      eventAction: eventAction,
      eventLabel: window.location.pathname,
    });
  },

  pushTrackEventError: function (formId, eventAction, eventType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      eventName: "formSubmitError",
      formId: formId,
      eventCategory: "Button form error",
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
      eventHistory: window.history,
    });
  },
  pushSubmitError: function (formId, eventAction, eventType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      eventName: "myTrackEvent",
      formId: formId,
      eventCategory: "Button form error",
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
    });
  },
  pushTrackEventErrorModal: function (formId, eventAction, eventType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      eventName: "formSubmitError",
      formId: formId,
      eventCategory: "Button modal form error",
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
      eventHistory: window.history,
    });
  },
  pushSubmitErrorModal: function (formId, eventAction, eventType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      eventName: "myTrackEvent",
      formId: formId,
      eventCategory: "Button modal form error",
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
    });
  },
};

$(document).ready(function () {
  DataLayerGatherers.formAbandonEvent();
  DataLayerGatherers.controlBlur();
  DataLayerGatherers.controlFocus();
});
