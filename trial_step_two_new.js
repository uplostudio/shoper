$(document).ready(function () {
  let state = {
    errors: [],
    phoneRegex: new RegExp("^\\+48\\d{9}$"),
  };

  // form's additional styling
  $("form").on("click", ".iti.iti--allow-dropdown.iti--separate-dial-code.iti--show-flags", function () {
    if ($(window).width() < 992) {
      var container = $(".iti.iti--container");
      if (container.length && !container.parent().is(this)) {
        container.css({
          top: "48px",
          left: "0",
          position: "absolute",
          height: "50vh",
          // Changing from 50svh to 50vh
          "overflow-y": "auto",
        });

        $(this).append(container);
      }
    }
  });

  const phoneField = $('[data-action="create_trial_step2"] [data-type="phone"]').get(0);

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
    $(phoneField).on("blur", function () {
      state.errors = validatePhone(this, state.errors, state.phoneRegex);
    });

    $(phoneField).on("keydown", function (e) {
      if (e.which === 13) {
        $(this).trigger("blur");
        onSubmitClick(e);
      }
    });
  }

  function validatePhone(field, errors, phoneRegex) {
    const countryCode = iti.getSelectedCountryData().iso2;
    let phone = iti.getNumber();
    console.log(phone);
    $(field).removeClass("error");
    $("[data-toast]").removeClass("error").css("display", "none");

    if (!phone) {
      $('[data-toast="required"]').addClass("error").css("display", "flex");
      errors.push("Phone is required.");
    } else if (countryCode === "pl" && !phoneRegex.test(phone)) {
      $('[data-toast="regex"]').addClass("error").css("display", "flex");
      errors.push("Phone is invalid.");
    }

    return errors;
  }

  function onSubmitClick(e) {
    let phoneField = $('[data-action="create_trial_step2"] [data-type="phone"]');
    phoneField.trigger("blur");
    const wFormFail = $('[data-app="create_trial_step2"]').find(".w-form-fail");

    if (state.errors.length === 0) {
      $.ajax({
        type: "POST",
        url: "https://www.shoper.pl/ajax.php",
        data: {
          action: $("#create_trial_step2").attr("data-action"),
          phone: iti.getNumber(),
          formid: $("#create_trial_step2").attr("data-action"),
          eventname: "formSubmitSuccess",
          "adwords[gclid]": localStorage.getItem("gclid"),
          "adwords[fbclid]": localStorage.getItem("fbclid"),
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
          wFormFail.show();
        },
      });
    } else {
      e.preventDefault();
      console.log(state.errors);
    }
  }

  setupValidation();

  $('[data-form="submit_trial_step_two"]').on("click", function (e) {
    onSubmitClick(e);
  });
});
