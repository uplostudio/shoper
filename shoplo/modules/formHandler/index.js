import { MESSAGES } from "../formValidation/constansts";
import { API_URL } from "../../constansts";
const forms = $("form");
const condition = () => forms.length > 0;

const initialize = () => {
  $(document).on("submitFormSuccess", function (e, form) {
    sendForm(form);
  });

  $(document).on("submitFormError", function (e, form) {
    $(document).trigger("dataLayerError", form);
    console.error("Error ");
  });
};

const bindDataFromForm = (form) => {
  var formData = $(form).serializeArray();
  var formValues = {};
  $.each(formData, function (index, field) {
    formValues[field.name] = field.value;
  });

  return formValues;
};

const maskedEmail = (email) => {
  let maskedEmail = email.replace(
    /^(.)(.*)(.)@/,
    (match, firstLetter, middlePart, lastLetter) => {
      return firstLetter + "*".repeat(middlePart.length) + lastLetter + "@";
    }
  );

  return maskedEmail;
};

const maskedPhoneNumber = (phoneNumber) => {
  let maskedPhoneNumber = "";
  let firstSpaceIndex = phoneNumber.indexOf(" ");

  for (let i = 0; i < phoneNumber.length - 2; i++) {
    if (i < firstSpaceIndex) {
      maskedPhoneNumber += phoneNumber[i];
    } else {
      if (phoneNumber[i].trim() !== "") {
        maskedPhoneNumber += "*";
      } else {
        maskedPhoneNumber += " ";
      }
    }
  }

  maskedPhoneNumber += phoneNumber[phoneNumber.length - 2];
  maskedPhoneNumber += phoneNumber[phoneNumber.length - 1];

  return maskedPhoneNumber;
};

const sendForm = (form) => {
  let formData = bindDataFromForm($(form));

  if ($(form).find('[name="phone"]').length > 0) {
    formData.phone =
      window.intlTelInputGlobals.instances[
        $($(form).find('[name="phone"]').get(0)).attr("data-intl-tel-input-id")
      ].getNumber();
  }

  if ($(`#${formData.action}`).parent().get(0)) {
    $(`#${formData.action}`).parent().get(0).style.display = "none";
    $(".loader-trial").removeClass("d-none");
  }

  $.ajax({
    url: API_URL,
    method: "POST",
    data: formData,
    success: function (data) {
      $(".loader-trial").addClass("d-none");
      if (data.status === 1) {
        $(document).trigger("dataLayerSuccess", form);
        switch (formData.action) {
          case "create_trial_step1":
            if (data.sid) {
              let LSdata = {
                1: data.sid,
                2: maskedEmail(formData.email),
                3: data.shop_id,
                5: data.host,
                6: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60,
              };
              localStorage.setItem("trial", btoa(JSON.stringify(LSdata)));
              $(document).trigger("trial_EmailSubmitted", [data]);
            }
            if (formData.email && $("#email-3")) {
              $("#email-3").val(maskedEmail(formData.email));
            }

            $("#trial-host").text(data.host);

            $("[id^=create_trial_step]").each((index, trialForm) => {
              if (
                $($(trialForm).get(0)).find('input[name="sid"]').length === 0
              ) {
                $($(trialForm).get(0)).append(
                  '<input name="sid" type="hidden" value="' + data.sid + '" />'
                );
              }
            });
            $("#create_trial_step2").parent().get(0).style.display = "block";
            break;
          case "create_trial_step2":
            if (data.license_id) {
              let LSdata = JSON.parse(atob(localStorage.getItem("trial")));
              if (LSdata[3] === data.license_id) {
                let phone =
                  $($(form).find(".iti__selected-dial-code").get(0)).text() +
                  " " +
                  $($(form).find('[name="phone"]').get(0)).val();
                LSdata[4] = maskedPhoneNumber(phone);
                localStorage.setItem("trial", btoa(JSON.stringify(LSdata)));
              }
              if (formData.phone && $("#phone-3")) {
                $("#phone-3").val(LSdata[4]);
              }
            }
            break;
          case "create_trial_step3":
            localStorage.removeItem("trial");
            break;
          default:
            break;
        }

        if (data.step) {
          $("[id^=create_trial_step]").parent().css("display", "none");
          $(data.step).parent().get(0).style.display = "block";
        }

        if (data.redirect) {
          window.location.href = data.redirect;
        }

        if (data.message) {
          $(form).css("display", "none");
          $(form).next().find("div").text(data.message);
          $(form).next().css("display", "block");
        }
      } else {
        $(document).trigger("dataLayerError", form);
        let error;
        $(`#${formData.action}`).parent().get(0).style.display = "block";
        if ($(`#${formData.action} .w-form-fail`)) {
          $(`#${formData.action} .w-form-fail`).remove();
        }

        error = MESSAGES[$("html").attr("lang")]['default'];
        if (data.code) {
          error = MESSAGES[$("html").attr("lang")][data.code];
        } else {
      
          if (data.message) {
            error = data.message;
          }

          if (data.errors) {
            error = showErrors(data.errors);
            
          }
        }
        $(`#${formData.action}`)
          .eq(0)
          .append('<div class="w-form-fail d-block">' + error + "</div>");
      }
    },
    error: function (data) {
      $(document).trigger("dataLayerError", form);
      $(".loader-trial").addClass("d-block");
      $(`#${formData.action}`).parent().get(0).style.display = "block";
      console.error("Error Connection with API");
    },
  });
};

const showErrors = (errors) => {
  let error = '';

  // Sprawdź, czy errors jest obiektem
  if (errors && typeof errors === 'object') {
    Object.entries(errors).forEach(([key, value]) => {
      // Sprawdź, czy value jest obiektem
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          // Sprawdź, czy subValue jest stringiem
          if (typeof subValue === 'string') {
            error += `${subValue} `;
          }
        });
      }
    });
  }

  // Zwraca sformatowane komunikaty błędów
  return error.trim(); // Użyj trim, aby usunąć nadmiarowe spacje na końcu
};

export default {
  condition,
  initialize,
};
