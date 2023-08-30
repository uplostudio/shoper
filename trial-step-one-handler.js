window.myGlobals = {
  clientId: null,
  host: null,
  shopId: null,
};

$(document).ready(function () {
  let state = {
    errors: [],
    analyticsId: "",
    gclidValue: getOrStoreParameter("gclid"),
    fbclidValue: getOrStoreParameter("fbclid"),
    emailRegex: new RegExp(
      '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    ),
  };

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
        state.analyticsId = tracker.get("clientId");
        $("[name='analytics_id']").val(state.analyticsId);
      } catch (err) {}
    }, 2000);
  }

  function setupValidation() {
    const emailField = $('[data-action="create_trial_step1"] [data-type="email"]');
    emailField.on("blur", function () {
      state.errors = validateEmail(this, state.errors, state.emailRegex);
    });

    emailField.on("keydown", function (e) {
      if (e.which === 13) {
        emailField.trigger("blur");
        onSubmitClick(e);
      }
    });
  }

  function validateEmail(field, errors, emailRegex) {
    let email = $(field).val();
    $(field).removeClass("error");

    if (!email) {
      $(field).addClass("error").next(".for-empty").show();
      errors.push("Email is required.");
    } else if (!emailRegex.test(email)) {
      $(field).addClass("error").next(".for-invalid").show();
      errors.push("Email is invalid.");
    }
    return errors;
  }

  function onSubmitClick(e) {
    state.errors = [];

    const statusMessages = {
      2: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj co najmniej godzinę, zanim zrobisz to ponownie.",
      3: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj kilka minut, zanim zrobisz to ponownie.",
      4: "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.",
    };

    let emailField = $('[data-action="create_trial_step1"] [data-type="email"]');
    emailField.trigger("blur");
    const wFormFail = $('[data-app="create_trial_step1"]').find(".w-form-fail")[0];

    if (state.errors.length === 0) {
      $.ajax({
        type: "POST",
        url: "https://www.shoper.pl/ajax.php",
        data: {
          action: $("#create_trial_step1").attr("data-action"),
          email: emailField.val(),
          "adwords[gclid]": state.gclidValue,
          "adwords[fbclid]": state.fbclidValue,
          analyticsId: state.analyticsId,
        },
        success: function (data) {
          if (data.client_id) window.myGlobals.clientId = data.client_id;
          if (data.host) window.myGlobals.host = data.host;
          if (data.shop_id) window.myGlobals.shopId = data.shop_id;

          if (data.code > 0) {
            $(wFormFail).text(statusMessages[data.code]);
            $(wFormFail).show();
          }

          if (data.status === 1) {
            $('[data-app="create_trial_step1_modal"]').addClass("modal--open");

            DataLayerGatherers.pushEmailSubmittedData(window.myGlobals.clientId, window.myGlobals.shopId, $("#create_trial_step1").attr("data-action"), emailField.val());

            DataLayerGatherers.pushFormSubmitSuccessData($("#create_trial_step1").attr("data-action"), emailField.val(), window.history);

            DataLayerGatherers.pushTrackEventData($("#create_trial_step1").attr("data-action"), $("#create_trial_step1").find("#label").text(), emailField.val());
          } else {
            DataLayerGatherers.pushTrackEventError($("#create_trial_step1").attr("data-action"), $("#create_trial_step1").find("#label").text(), emailField.val(), window.history);

            DataLayerGatherers.pushSubmitError($("#create_trial_step1").attr("data-action"), $("#create_trial_step1").find("#label").text(), emailField.val());
          }
        },
        error: function (data) {
          console.log("Error: Something went wrong");
          $(wFormFail).hide();
        },
      });
    } else {
      e.preventDefault();
      console.log(state.errors);
    }
  }

  updateAnalytics();
  setupValidation();

  $('[data-form="submit-step-one"]').on("click", function (e) {
    onSubmitClick(e);
  });
});
