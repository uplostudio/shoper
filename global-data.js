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
    const $formContainer = $(
      '[data-action="create_trial_step1"], [data-action="create_trial_step2"]'
    );

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

  controlBlur: function () {
    const $formContainer = $(
      '[data-action="create_trial_step1"], [data-action="create_trial_step2"]'
    );

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
    const $formContainer = $(
      '[data-action="create_trial_step1"], [data-action="create_trial_step2"]'
    );

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

  checkAndStoreQueryParams: function () {
    const PARAMS = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "adgroup",
      "device",
    ];
    const VALUE_TRACK_KEY = "valueTrack";
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
    const data = localStorage.getItem("valueTrack");
    return data ? JSON.parse(data) : null;
  },
};

$(document).ready(function () {
  DataLayerGatherers.formAbandonEvent();
  DataLayerGatherers.controlBlur();
  DataLayerGatherers.controlFocus();
});

$(document).ready(function () {
  $("a[data-app^='open_']").click(function () {
    const dataAppValue = $(this).data("app");
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

DataLayerGatherers.checkAndStoreQueryParams();
