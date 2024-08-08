window.myGlobals = {
  clientId: null,
  host: null,
  shopId: null,
  analyticsId: null,
  licenseId: null,
  URL: null,
  analyticsId: null,
  fbclidValue: getOrStoreParameter("fbclid"),
  gclidValue: getOrStoreParameter("gclid"),
};

let hostname = window.location.hostname;

window.myGlobals.URL =
  hostname === "www.shoper.pl"
    ? "https://www.shoper.pl/ajax.php"
    : "https://webflow-sandbox.shoper.pl/ajax.php";

function getOrStoreParameter(name) {
  let urlSearchParams = new URLSearchParams(window.location.search);
  let urlValue = urlSearchParams.get(name) || "";
  let storedValue = localStorage.getItem(name);

  if (urlValue) {
    if (urlValue !== storedValue) {
      localStorage.setItem(name, urlValue);
    }
    return urlValue;
  } else if (storedValue) {
    return storedValue;
  }
  return "";
}

function updateAnalytics() {
  setTimeout(function () {
    try {
      const tracker = ga.getAll()[0];
      window.myGlobals.analyticsId = tracker.get("clientId");
      $("[name='analytics_id']").val(window.myGlobals.analyticsId);
    } catch (err) {}
  }, 2000);
}

const DataLayerGatherers = {
  formAbandonEvent: function () {
    const $trialModal = $('.new__trial-modal');
    const $modalSteps = $('[data-element^="modal_trial_"]');
    const $closeButton = $('[data-element="close_trial_wrapper"]');
    let isFormModified = false;
    let lastFocusedInput = null;
    let currentFormId = null;
  
    function getCurrentVisibleForm() {
      const $visibleStep = $modalSteps.filter(function() {
        return $(this).css('display') !== 'none';
      });
      const $form = $visibleStep.find('[data-action^="create_trial_step"]');
      return $form;
    }
  
    // Track input changes
    $trialModal.on("input change", "input, select, textarea", function () {
      isFormModified = true;
    });
  
    // Track focus on form elements
    $trialModal.on("focus", "input, select, textarea", function () {
      lastFocusedInput = $(this);
      currentFormId = getCurrentVisibleForm().attr('data-action');
    });
  
    // Track blur (losing focus) on form elements
    $trialModal.on("blur", "input, select, textarea", function () {
      isFormModified = true;
    });
  
    // Handle modal close button click
    $closeButton.on("click", function (event) {
      if (isFormModified) {
        sendFormAbandonEvent();
      }
    });
  
    // Handle click outside the form
    $(document).on("click", function (event) {
      const $clickedElement = $(event.target);
      
      if (!$clickedElement.closest($trialModal).length && isFormModified) {
        sendFormAbandonEvent();
      }
    });
  
    // Handle ESC key press
    $(document).on("keydown", function (event) {
      if (event.key === "Escape" && isFormModified) {
        sendFormAbandonEvent();
      }
    });
  
    // Reset form state on submission
    $trialModal.on("submit", '[data-action^="create_trial_step"]', function () {
      isFormModified = false;
      lastFocusedInput = null;
      currentFormId = null;
    });
  
    function sendFormAbandonEvent() {
      if (currentFormId && !$(`[data-action="${currentFormId}"]`).data("submitted")) {
        const emailValue = lastFocusedInput.val();
  
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          "event": "formAbandon",
          "formId": currentFormId,
          "email": emailValue,
          "action": currentFormId,
          "website": "shoper",
          "eventLabel": window.location.href
        });
  
        isFormModified = false;
        lastFocusedInput = null;
        currentFormId = null;
      }
    }
  },  
  controlBlur: function () {
    const $formContainer = $('form');


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
    const $formContainer = $('form');


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

  pushFormSubmitSuccessData: function (formId, eventType, formType) {
    window.dataLayer = window.dataLayer || [];
    let data = {
      eventName: "formSubmitSuccess",
      formId: formId,
      eventCategory: "Button form sent",
      eventLabel: window.location.pathname,
      eventType: eventType,
      eventHistory: window.history,
    };
    if (formType) {
      data.formType = formType;
    }
    window.dataLayer.push(data);
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

  pushTrackEventDataModal: function (
    client_id,
    formId,
    shopId,
    eventAction,
    eventType
  ) {
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
  // DL Conversions starts here
  pushClientTypeChangeEvent: function (clientType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "client_type_change",
      client_type: clientType,
    });
  },
  pushFormInteractionEvent: function (
    formId,
    formLocation,
    formType,
    formStep
  ) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "form_interaction",
      form_id: formId,
      form_location: formLocation,
      form_type: formType,
      form_step: formStep,
    });
  },

  // DL Conversions ends here

  checkAndStoreQueryParams: function () {
    const PARAMS = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "adgroup",
      'utm_term'
    ];
    const VALUE_TRACK_KEY = "adwords";
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

    // Helper function to get query parameters from the URL
    function getQueryParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParams = {};

      PARAMS.forEach((param) => {
        if (urlParams.has(param)) {
          queryParams[param] = urlParams.get(param);
        }
      });

      return queryParams;
    }

    // Store the query parameters in localStorage
    function storeParams(params) {
      const data = {
        ...params,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(VALUE_TRACK_KEY, JSON.stringify(data));
    }

    // Check if the stored data is older than 90 days
    function checkExpiry() {
      const data = localStorage.getItem(VALUE_TRACK_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        const currentTime = new Date().getTime();
        if (currentTime - parsedData.timestamp > NINETY_DAYS_MS) {
          localStorage.removeItem(VALUE_TRACK_KEY);
        }
      }
    }

    // Main logic execution
    const queryParams = getQueryParams();
    if (Object.keys(queryParams).length > 0) {
      storeParams(queryParams);
    }
    checkExpiry();
  },

  getValueTrackData: function () {
    const data = localStorage.getItem(VALUE_TRACK_KEY);
    return data ? JSON.parse(data) : null;
  },
};

$(document).ready(function () {
  DataLayerGatherers.formAbandonEvent();
  DataLayerGatherers.controlBlur();
  DataLayerGatherers.controlFocus();
});

$(document).ready(function () {
  $("a[data-app^='open_'], a[data-element^='open_']").click(function () {
    const dataAppValue = $(this).data("app") || $(this).data("element");
    const buttonTextContent = $(this).text();
    const eventType = dataAppValue.split("open_")[1].split("_")[0];

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "myTrackEvent",
      eventCategory: "Button modal opened",
      eventAction: buttonTextContent,
      eventLabel: window.location.href,
      eventType: eventType,
    });
  });
});


//DataLayerGatherers.checkAndStoreQueryParams();

// DL Conversion Functions starts here:
function clientTypeChange() {
  $('input[name="client_type"]').on("change", function () {
    const label = $(this).closest("label");
    const spanText = label.find("span.w-form-label").text().trim();
    DataLayerGatherers.pushClientTypeChangeEvent(spanText);
  });
}

$(window).on("load", function () {
  clientTypeChange();
});

function trackFormInteraction(form, input) {
  if (form.data('interaction-tracked')) return;

  DataLayerGatherers.pushFormInteractionEvent(
      form.attr('id') || 'empty',
      window.location.pathname,
      'on_page',
      input && input.length ? input.attr('data-name') || 'unknown' : 'unknown'
  );

  form.data('interaction-tracked', true);
}

$(document).ready(function() {
  $("form").on("focus", "input, textarea, select", function() {
      trackFormInteraction($(this.form), $(this));
  });
});

// DL Conversion Functions ends here: