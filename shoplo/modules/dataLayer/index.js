const condition = () => true;

const initialize = () => {
  $("[data-event]").on("click", function (e) {
    if ( $(this).data('event') !== "create_trial_step" ) {
      sendDataLayer({
        event: "myTrackEvent",
        eventCategory:
          $(this).data("event-action") === "open"
            ? "Button modal opened"
            : "Button modal closed",
        eventAction: $(this).text(),
        eventType: $(this).data("event"),
      });
    } else {
        if( $(this).data('event-action') === "close" ) {
          const form = $($('[id*="create_trial_step"]').parent(':visible').eq(0).children().eq(0)).get(0);
          sendDataLayer({
            event: "formAbandon",
          }, 
          collectData($(form))
          );
        }
    }
  });

  $(document).on("dataLayerSuccess", function (e, form) {
    form = $(form).closest('form').get(0);
    sendDataLayer({
      event: "myTrackEvent",
      eventCategory: "Button modal form sent",
      eventAction: $($(form).find('input[type="submit"]').get(0)).val(),
      eventType: $(form).attr("id"),
    });
    if ($(form).attr("id").includes("create_trial_step")) {
      sendDataLayer({
        event: "formSubmitSuccess",
      }, 
      collectData($(form))
      );
    }
  });

  $(document).on("dataLayerError", function (e, form) {
    form = $(form).closest('form').get(0);
    sendDataLayer({
      event: "myTrackEvent",
      eventCategory: "Button modal form error",
      eventAction: $($(form).find('input[type="submit"]').get(0)).val(),
      eventType: $(form).attr("id"),
    });
    if ($(form).attr("id").includes("create_trial_step")) {
      sendDataLayer({
        event: "formSubmitError",
      }, 
      collectData($(form))
      );
    }
  });

  $('input:not([type="submit"]), select').each((index, formField) => {
    $(formField).on("blur", () => {
      sendDataLayer({
        event: "controlBlur",
        formId: $(formField).closest("form").attr("id"),
        controlName: $(formField).attr("name"),
        controlType: $(formField).attr("type") || "select",
        controlValue: $(formField).val(),
      });
    });

    $(formField).on("focus", () => {
      sendDataLayer({
        event: "controlFocus",
        formId: $(formField).closest("form").attr("id"),
        controlName: $(formField).attr("name"),
        controlType: $(formField).attr("type") || "select",
        controlValue: $(formField).val(),
      });
    });
  });

  $(document).on("trial_EmailSubmitted", function (e, data) {
    sendDataLayer({
      event: "trial_EmailSubmitted",
      client_id: data.client_id,
      formId: "create_trial_step1",
      'shop-id': data.shop_id,
      email: data.email,
    });
  });
};

// Function send dataLayer

const sendDataLayer = (dl, data = false) => {
  if ( data ) {
    dl = { ...dl, ...data }
  }
  dl.eventLabel = window.location.href;

  if (window.dataLayer && dl) {
    dataLayer.push(dl);
  } else {
    console.log(dl);
  }
};

const collectData = (form) => {
  var data;

  data = {
    formId: form.attr("id"),
  };

  form.find('input:not([type="password"]):not([disabled]):not([type="submit"]), select').each(function () {
    var $el;

    $el = $(this);
    switch ($el.attr("type")) {
      case "checkbox":
      case "radio": {
        if ($el.is(":checked")) {
          data[$el.attr("name")] = $el.val();
        }
        break;
      }
      default: {
        if( $el.attr("name") !== "sid" ) {
          data[$el.attr("name")] = $el.val();
        }
      }
    }
  });

  return data;
};

export default {
  condition,
  initialize,
};
