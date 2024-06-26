$(document).ready(function () {
  let state = {
    errors: [],
    phoneRegex: new RegExp("^\\+48\\d{9}$"),
  };

  // form's additional styling
  $("form").on(
    "click",
    ".iti.iti--allow-dropdown.iti--separate-dial-code.iti--show-flags",
    function () {
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
    }
  );

  function setupValidation() {
    const phoneFields = $(
      '[data-action="create_trial_step2"] [data-type="phone"]'
    );
    phoneFields.each(function () {
      let phoneField = $(this);

      var iti = window.intlTelInput(phoneField.get(0), {
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
        preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
        autoInsertDialCode: false,
        nationalMode: false,
        separateDialCode: true,
        autoPlaceholder: "off",
        initialCountry: "pl",
      });

      phoneField.on("blur", function () {
        state.errors = validatePhone(this, state.errors, state.phoneRegex, iti);
      });

      phoneField.on("keydown", function (e) {
        if (e.which === 13) {
          $(this).trigger("blur");
          onSubmitClick(e, phoneField, iti);
        }
      });

      phoneField
        .closest("form")
        .find('[data-form="submit_trial_step_two"]')
        .on("click", function (e) {
          onSubmitClick(e, phoneField, iti);
        });
    });
  }

  function validatePhone(field, errors, phoneRegex, iti) {
    errors = [];
    const countryCode = iti.getSelectedCountryData().iso2;
    let phone = iti.getNumber();
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

  function onSubmitClick(e, phoneField, iti) {
    let form = phoneField.closest("form");
    const wFormFail = form.find(".w-form-fail");
    phoneField.trigger("blur");
    const valueTrack = DataLayerGatherers.getValueTrackData();
    const loader = form.find(".loading-in-button.is-inner");
    if (state.errors.length === 0) {
      $.ajax({
        type: "POST",
        url: window.myGlobals.URL,
        data: (function () {
          var data = {
            action: "create_trial_step2",
            phone: iti.getNumber(),
            formid: "create_trial_step2",
            eventname: "formSubmitSuccess",
            "adwords[gclid]": window.myGlobals.gclidValue,
            "adwords[fbclid]": window.myGlobals.fbclidValue,
            analytics_id: window.myGlobals.analyticsId,
          };

          if (valueTrack) {
            Object.entries(valueTrack).forEach(([key, value]) => {
              if (key !== "timestamp") {
                data[key] = value;
              }
            });
          }

          return data;
        })(),
        beforeSend: function () {
          loader.show();
          // Show loader
        },
        success: function (data) {
          DataLayerGatherers.pushTrackEventDataModal(
            window.myGlobals.clientId,
            $("#create_trial_step2").attr("data-action"),
            window.myGlobals.shopId,
            $("#create_trial_step2").find("#label").text(),
            iti.getNumber()
          );

          DataLayerGatherers.pushTrackEventData(
            form.find("#create_trial_step2").attr("data-action"),
            $("#create_trial_step2").find("#label").text(),
            iti.getNumber()
          );

          if (data.status === 1) {
            if (data.license_id) window.myGlobals.licenseId = data.license_id;
            window.location.href =
              hostname === "www.shoper.pl"
                ? "https://www.shoper.pl/zaloz-sklep"
                : "https://webflow-sandbox.shoper.pl/zaloz-sklep";
          }
        },
        error: function (data) {
          // console.log("Error: Something went wrong");
          DataLayerGatherers.pushTrackEventErrorModal(
            $("#create_trial_step2").attr("data-action"),
            $("#create_trial_step2").find("#label").text(),
            iti.getNumber()
          );

          DataLayerGatherers.pushSubmitErrorModal(
            $("#create_trial_step2").attr("data-action"),
            $("#create_trial_step2").find("#label").text(),
            iti.getNumber()
          );
          wFormFail.show();
        },
        complete: function () {
          loader.hide();
          // Hide loader
        },
      });
    } else {
      e.preventDefault();
    }
  }

  setupValidation();
});
