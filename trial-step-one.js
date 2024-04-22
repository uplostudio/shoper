$(document).ready(function () {
  $("[data-app='open_trial_modal_button']").on("click", function () {
    $("[data-app='create_trial_step1_modal']").addClass("modal--open");
    $("body").addClass("overflow-hidden");
  });

  let state = {
    errors: [],
    emailRegex: new RegExp(
      '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    ),
  };

  function setupValidation() {
    const forms = $('[data-action="create_trial_step1"]');
    forms.each(function () {
      const form = $(this);
      const emailField = form.find('[data-type="email"]');

      emailField.on("blur", function () {
        state.errors = validateEmail(this, state.errors, state.emailRegex);
      });

      emailField.on("keydown", function (e) {
        if (e.which === 13) {
          emailField.trigger("blur");
          onSubmitClick(e, emailField, form);
        }
      });

      emailField
        .closest("form")
        .find('[data-form="submit-step-one"]')
        .on("click", function (e) {
          onSubmitClick(e, emailField, form);
        });
    });
  }

  function validateEmail(field, errors, emailRegex) {
    let email = $(field).val();
    let nextElement = $(field).next();
    let nextNextElement = nextElement.next();

    $(field).removeClass("error");
    nextElement.hide();
    nextNextElement.hide();

    if (!email) {
      $(field).addClass("error");
      nextNextElement.css("display", "flex");
      errors.push("Email is required.");
    } else if (!emailRegex.test(email)) {
      $(field).addClass("error");
      nextElement.css("display", "flex");

      errors.push("Email is invalid.");
    }

    return errors;
  }

  function onSubmitClick(e, emailField, form) {
    state.errors = [];
    const wFormFail = form.next().next();
    $(emailField).trigger("blur");

    const statusMessages = {
      2: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj co najmniej godzinę, zanim zrobisz to ponownie.",
      3: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj kilka minut, zanim zrobisz to ponownie.",
      4: "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.",
    };

    if (state.errors.length === 0) {
      const loader = form.find(".loading-in-button.is-inner");
      $.ajax({
        type: "POST",
        url: window.myGlobals.URL,
        data: {
          action: $(form).attr("data-action"),
          email: $(emailField).val(),
          "adwords[gclid]": window.myGlobals.gclidValue,
          "adwords[fbclid]": window.myGlobals.fbclidValue,
          analyticsId: window.myGlobals.analyticsId,
          affiliant: ( $(form).attr("data-affiliant") ) ? $(form).attr("data-affiliant") : '',
        },
        beforeSend: function () {
          loader.show();
          // Show loader
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
            if ( localStorage.getItem("shoper_affiliate") ) {
              localStorage.removeItem("shoper_affiliate");
            }
            $("[data-app='create_trial_step1_modal']").removeClass("modal--open");
            $("[data-app='trial-domain']").text(window.myGlobals.host);
            $('[data-modal="create_trial_step2"]').addClass("modal--open");

            var formTypeValue = $(form).attr("data-item") === "exit" ? "exit_popup" : "";

            DataLayerGatherers.pushEmailSubmittedData(window.myGlobals.clientId, window.myGlobals.shopId, $("#create_trial_step1").attr("data-action"), emailField.val());

            DataLayerGatherers.pushFormSubmitSuccessData($("#create_trial_step1").attr("data-action"), emailField.val(), formTypeValue);

            DataLayerGatherers.pushTrackEventData($("#create_trial_step1").attr("data-action"), $("#create_trial_step1").find("#label").text(), emailField.val());
          } else {
            DataLayerGatherers.pushTrackEventError($("#create_trial_step1").attr("data-action"), $("#create_trial_step1").find("#label").text(), emailField.val());

            DataLayerGatherers.pushSubmitError($("#create_trial_step1").attr("data-action"), $("#create_trial_step1").find("#label").text(), emailField.val());
          }
        },
        error: function (data) {
          console.log("Error: Something went wrong");
          $(wFormFail).hide();
        },
        complete: function () {
          loader.hide();
          // Hide loader
        },
      });
    } else {
      e.preventDefault();
      // console.log(state.errors);
    }
  }

  // $('[data-form="submit-step-one"]').each(function () {
  //   const form = $(this).closest("form");
  //   const emailField = form.find('[data-type="email"]');
  //   $(this).on("click", function (e) {
  //     onSubmitClick(e, emailField, form);
  //   });
  // });

  updateAnalytics();
  setupValidation();
});
