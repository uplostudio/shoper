window.myGlobals = {
  clientId: null,
  host: null,
  shopId: null,
  analyticsId: null,
  licenseId: null,
  URL: null,
  fbclidValue: getOrStoreParameter("fbclid"),
  gclidValue: getOrStoreParameter("gclid"),
  isUsingModal: false,
};

window.myGlobals.URL =
  window.location.hostname === "www.shoper.pl"
    ? "https://www.shoper.pl/ajax.php"
    : "https://webflow-sandbox.shoper.pl/ajax.php";

function getOrStoreParameter(name) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const urlValue = urlSearchParams.get(name) || "";
  const storedValue = localStorage.getItem(name);

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
  setTimeout(() => {
    try {
      const clientId =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("_ga="))
          ?.split(".")
          .slice(2)
          .join(".") || "";

      if (clientId) {
        window.myGlobals.analyticsId = clientId;
        $("[name='analytics_id']").val(clientId);
      }
    } catch (err) {}
  }, 2000);
}

const DataLayerGatherers = {
  pushDataLayerEvent(eventData) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
  },

  formAbandonEvent() {
    const $trialModal = $(".new__trial-modal");
    const $modalSteps = $('[data-element^="modal_trial_"]');
    const $closeButton = $('[data-element="close_trial_wrapper"]');
    let isFormModified = false;
    let lastFocusedInput = null;
    let currentFormId = null;

    function getCurrentVisibleForm() {
      const $visibleStep = $modalSteps.filter(function () {
        return $(this).css("display") !== "none";
      });
      const $form = $visibleStep.find('[data-action^="create_trial_step"]');
      return $form;
    }

    $trialModal.on("input change", "input, select, textarea", function () {
      isFormModified = true;
    });

    $trialModal.on("focus", "input, select, textarea", function () {
      lastFocusedInput = $(this);
      currentFormId = getCurrentVisibleForm().attr("data-action");
    });

    $trialModal.on("blur", "input, select, textarea", function () {
      isFormModified = true;
    });

    $closeButton.on("click", function (event) {
      if (isFormModified) {
        sendFormAbandonEvent();
      }
    });

    $(document).on("click", function (event) {
      const $clickedElement = $(event.target);

      if (!$clickedElement.closest($trialModal).length && isFormModified) {
        sendFormAbandonEvent();
      }
    });

    $(document).on("keydown", function (event) {
      if (event.key === "Escape" && isFormModified) {
        sendFormAbandonEvent();
      }
    });

    $trialModal.on("submit", '[data-action^="create_trial_step"]', function () {
      isFormModified = false;
      lastFocusedInput = null;
      currentFormId = null;
    });

    function sendFormAbandonEvent() {
      if (
        currentFormId &&
        !$(`[data-action="${currentFormId}"]`).data("submitted")
      ) {
        const emailValue = lastFocusedInput.val();

        DataLayerGatherers.pushDataLayerEvent({
          event: "formAbandon",
          formId: currentFormId,
          email: emailValue,
          action: currentFormId,
          website: "shoper",
          eventLabel: window.location.href,
        });

        isFormModified = false;
        lastFocusedInput = null;
        currentFormId = null;
      }
    }
  },

  controlBlur() {
    $(document).on("blur", "form input", function () {
      const $input = $(this);
      const $form = $input.closest("form");

      DataLayerGatherers.pushDataLayerEvent({
        event: "controlBlur",
        formId: $form.attr("data-action"),
        controlName: $input.attr("data-form"),
        controlType: $input.attr("data-type"),
        controlValue: $input.val(),
      });
    });
  },

  controlFocus() {
    $(document).on("focus", "form input", function () {
      const $input = $(this);
      const $form = $input.closest("form");

      DataLayerGatherers.pushDataLayerEvent({
        event: "controlFocus",
        formId: $form.attr("data-action"),
        controlName: $input.attr("data-form"),
        controlType: $input.attr("data-type"),
        controlValue: $input.val(),
      });
    });
  },

  pushEmailSubmittedData(clientId, shopId, formId, email) {
    this.pushDataLayerEvent({
      event: "trial_sign_up",
      client_id: clientId,
      shop_id: shopId,
      formId: formId,
      email: email,
    });
  },

  pushFormSubmitSuccessData(formId, eventType, formType) {
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
    this.pushDataLayerEvent(data);
  },

  pushTrackEventData(formId, eventAction, eventType) {
    this.pushDataLayerEvent({
      event: "myTrackEvent",
      formId: formId,
      eventCategory: "Button form sent",
      eventAction: eventAction,
      eventType: eventType,
      eventLabel: window.location.pathname,
    });
  },

  pushTrackEventDataModal(
    client_id,
    formId,
    shopId,
    eventAction,
    eventType,
    package
  ) {
    this.pushDataLayerEvent({
      event: "formSubmitSuccess",
      eventCategory: "Button modal form sent",
      client_id: client_id,
      formId: formId,
      shop_id: shopId,
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
      eventHistory: window.history,
      package: package,
    });
  },

  pushTrackEventError(formId, eventAction, eventType) {
    this.pushDataLayerEvent({
      eventName: "formSubmitError",
      formId: formId,
      eventCategory: "Button form error",
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
      eventHistory: window.history,
    });
  },

  pushSubmitError(formId, eventAction, eventType) {
    this.pushDataLayerEvent({
      eventName: "myTrackEvent",
      formId: formId,
      eventCategory: "Button form error",
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
    });
  },

  pushTrackEventErrorModal(formId, eventAction, eventType) {
    this.pushDataLayerEvent({
      eventName: "formSubmitError",
      formId: formId,
      eventCategory: "Button modal form error",
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
      eventHistory: window.history,
    });
  },

  pushSubmitErrorModal(formId, eventAction, eventType) {
    this.pushDataLayerEvent({
      eventName: "myTrackEvent",
      formId: formId,
      eventCategory: "Button modal form error",
      eventAction: eventAction,
      eventLabel: window.location.pathname,
      eventType: eventType,
    });
  },

  pushModalClosed() {
    this.pushDataLayerEvent({
      event: "myTrackEvent",
      eventCategory: "Button modal closed",
      eventAction: "",
      eventType: "modal-form",
      eventLabel: window.location.pathname,
    });
  },

  pushClientTypeChangeEvent(clientType) {
    this.pushDataLayerEvent({
      event: "client_type_change",
      client_type: clientType,
    });
  },

  pushFormInteractionEvent(formId, formLocation, formType, formStep) {
    this.pushDataLayerEvent({
      event: "form_interaction",
      form_id: formId,
      form_location: formLocation,
      form_type: formType,
      form_step: formStep,
    });
  },

  checkAndStoreQueryParams() {
    const PARAMS = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "adgroup",
      "utm_term",
    ];
    const VALUE_TRACK_KEY = "adwords";
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

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

    function storeParams(params) {
      const data = {
        ...params,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(VALUE_TRACK_KEY, JSON.stringify(data));
    }

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

    const queryParams = getQueryParams();
    if (Object.keys(queryParams).length > 0) {
      storeParams(queryParams);
    }
    checkExpiry();
  },

  getValueTrackData() {
    const data = localStorage.getItem(VALUE_TRACK_KEY);
    return data ? JSON.parse(data) : null;
  },

  addUtmDataToForm(formData) {
    const storedUtmData = this.getValueTrackData();
    if (storedUtmData) {
      Object.keys(storedUtmData).forEach((key) => {
        if (key !== "timestamp") {
          formData[`adwords[${key}]`] = storedUtmData[key];
        }
      });
    }
    return formData;
  },
};

$(document).ready(function () {
  DataLayerGatherers.formAbandonEvent();
  DataLayerGatherers.controlBlur();
  DataLayerGatherers.controlFocus();
});

$(document).on(
  "closeModalCalled",
  DataLayerGatherers.pushModalClosed.bind(DataLayerGatherers)
);

$(document).ready(function () {
  $("a[data-app^='open_'], a[data-element^='open_']").click(function () {
    const dataAppValue = $(this).data("app") || $(this).data("element");
    const buttonTextContent = $(this).text();
    const eventType = dataAppValue.split("open_")[1].split("_")[0];

    DataLayerGatherers.pushDataLayerEvent({
      event: "myTrackEvent",
      eventCategory: "Button modal opened",
      eventAction: buttonTextContent,
      eventLabel: window.location.href,
      eventType: eventType,
    });
  });
});

function clientTypeChange() {
  $('input[name="address[client_type]"]').on("change", function () {
    const label = $(this).closest("label");
    const spanText = label.find("span.w-form-label").text().trim();
    DataLayerGatherers.pushClientTypeChangeEvent(spanText);
  });
}

$(window).on("load", function () {
  clientTypeChange();
});

function trackFormInteraction(form, input, formType) {
  if (form.data("interaction-tracked")) return;

  const formId = form.attr("id") || "empty";
  const formLocation = window.location.pathname;
  let formStep;

  if (
    formId.toLowerCase().includes("trial") ||
    form.attr("data-form_type") === "modal"
  ) {
    let actualCompletedStep;

    const formAction = form.data("action");
    switch (formAction) {
      case "validate_email":
        actualCompletedStep = 0;
        break;
      case "create_trial_step1_new":
        actualCompletedStep = 1;
        break;
      case "create_trial_step2_new":
        actualCompletedStep = 2;
        break;
      default:
        actualCompletedStep = 0;
    }

    if (window.myGlobals.isUsingModal) {
      // Modal flow
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
  } else {
    formStep =
      input && input.length ? input.attr("data-form") || "unknown" : "unknown";
  }

  DataLayerGatherers.pushFormInteractionEvent(
    formId,
    formLocation,
    window.myGlobals.isUsingModal ? "modal" : "inline",
    formStep
  );

  form.data("interaction-tracked", true);
}

$(document).ready(function () {
  $("form").on("focus", "input, textarea, select", function () {
    const $form = $(this.form);
    const formType = $form.data("form-type") || "inline";
    trackFormInteraction($form, $(this), formType);
  });
});
