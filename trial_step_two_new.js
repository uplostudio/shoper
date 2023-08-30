$(document).ready(function () {
  let state = {
    errors: [],
    phoneRegex: new RegExp("/^ddddddddd$/"),
  };
  // form's additional styling
  $("form").on("click", ".iti.iti--allow-dropdown.iti--separate-dial-code.iti--show-flags", function () {
    // Check if the window width is below 992 pixels
    if ($(window).width() < 992) {
      // Find the .iti.iti--container element
      var container = $(".iti.iti--container");
      // Check if the container exists and is not already a child of the clicked element
      if (container.length && !container.parent().is(this)) {
        // Set the CSS properties for the container
        container.css({
          top: "48px",
          left: "0",
          position: "absolute",
          height: "50svh",
          "overflow-y": "auto",
        });
        // Append it as the second child of the clicked element
        $(this).append(container);
      }
    }
  });

  const phoneField = $('[data-action="create_trial_step2"] [data-type="phone"]');

  // iti initialization
  var iti = window.intlTelInput(phoneField, {
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
    preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
    autoInsertDialCode: false,
    nationalMode: false,
    separateDialCode: true,
    autoPlaceholder: "off",
    initialCountry: "pl",
  });

  function setupValidation() {
    phoneField.on("blur", function () {
      state.errors = validatePhone(this, state.errors, state.phoneRegex);
    });

    phoneField.on("keydown", function (e) {
      if (e.which === 13) {
        phoneField.trigger("blur");
        onSubmitClick(e);
      }
    });
  }

  function validatePhone(field, errors, phoneRegex) {
    const countryCode = iti.getSelectedCountryData().iso2;

    // Exit function early if the country code isn't "pl"
    if (countryCode !== "pl") {
      return errors;
    }

    let phone = $(field).val();
    $(field).removeClass("error");

    if (!phone) {
      $(field).addClass("error").next(".for-empty").show();
      errors.push("Phone is required.");
    } else if (!phoneRegex.test(phone)) {
      $(field).addClass("error").next(".for-invalid").show();
      errors.push("Phone is invalid.");
    }

    return errors;
  }

  function onSubmitClick(e) {
    state.errors = [];

    let phoneField = $('[data-action="create_trial_step2"] [data-type="phone"]');
    phoneField.trigger("blur");
    const wFormFail = $('[data-app="create_trial_step2"]').find(".w-form-fail")[0];

    if (state.errors.length === 0) {
      $.ajax({
        type: "POST",
        url: "https://www.shoper.pl/ajax.php",
        data: {
          action: $("#create_trial_step2").attr("data-action"),
          phone: iti.getNumber(),
          "adwords[gclid]": state.gclidValue,
          "adwords[fbclid]": state.fbclidValue,
        },
        success: function (data) {
          DataLayerGatherers.pushFormSubmitSuccessData($("#create_trial_step2").attr("data-action"), iti.getNumber());

          DataLayerGatherers.pushTrackEventData($("#create_trial_step2").attr("data-action"), $("#create_trial_step2").find("#label").text(), iti.getNumber());

          if (data.status === 1) {
            console.log("Here should be redirection");
          }
        },
        error: function (data) {
          console.log("Error: Something went wrong");
          DataLayerGatherers.pushTrackEventError($("#create_trial_step2").attr("data-action"), $("#create_trial_step2").find("#label").text(), iti.getNumber());

          DataLayerGatherers.pushSubmitError($("#create_trial_step2").attr("data-action"), $("#create_trial_step2").find("#label").text(), iti.getNumber());
          $(wFormFail).show();
        },
      });
    } else {
      e.preventDefault();
      console.log(state.errors);
    }
  }

  updateAnalytics();
  setupValidation();

  $('[data-form="submit_trial_step_two"]').on("click", function (e) {
    onSubmitClick(e);
  });
});
