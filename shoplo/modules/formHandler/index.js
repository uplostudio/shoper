import { MESSAGES } from "../formValidation/constansts";
import { API_URL } from "../../constansts";
const forms = $("form");
const condition = () => forms.length > 0;

const initialize = () => {
  $(document).on("submitFormSuccess", function (e, form) {
    sendForm(form);
  });

  $(document).on("submitFormError", function (e, form) {
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

const sendForm = (form) => {
  let formData = bindDataFromForm($(form));

  if ($(form).find('[name="phone"]').length > 0) {
    formData.phone =
      window.intlTelInputGlobals.instances[
        $($(form).find('[name="phone"]').get(0)).attr("data-intl-tel-input-id")
      ].getNumber();
  }

  if ( $(`#${formData.action}`).parent().get(0) ) {
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
     
        switch (formData.action) {
          case "create_trial_step1":
            if ( data.sid ) {
              let LSdata = {
                  1: data.sid,
                  2: formData.email,
                  3: data.shop_id,
                  5: data.host,
              };
              localStorage.setItem('trial', btoa(JSON.stringify(LSdata)));
            }
            if (formData.email && $("#email-3")) {
              $("#email-3").val(formData.email);
            }

            $("#trial-host").text(data.host);
            
            $('[id^=create_trial_step]').each( ( index, trialForm ) => {
                if( $($(trialForm).get(0)).find('input[name="sid"]').length === 0 ) {
                  $($(trialForm).get(0)).append('<input name="sid" type="hidden" value="' + data.sid + '" />');
                }
            });
            $("#create_trial_step2").parent().get(0).style.display = "block";
          break;
          case "create_trial_step2":
            if ( data.license_id ) {
            let LSdata = JSON.parse(atob(localStorage.getItem('trial')));
            if( LSdata[3] ===  data.license_id ) {
              LSdata[4] = formData.phone;
              localStorage.setItem('trial', btoa(JSON.stringify(LSdata)));
            }
            if (formData.phone && $("#phone-3")) {
              window.intlTelInputGlobals.instances[
                $($("#phone-3").get(0)).attr("data-intl-tel-input-id")
              ].setNumber(formData.phone);
            }}
          break;
          case "create_trial_step3":
            localStorage.removeItem('trial');
          break;
          default:
            
          break;
        }

        if (data.step) {
          $('[id^=create_trial_step]').parent().css('display', 'none');
          $(data.step).parent().get(0).style.display = "block";
        }

        if (data.redirect) {
          window.location.href = data.redirect;
        }

        if (data.message) {
          $(form).css('display', 'none');
          $(form).next().find('div').text( data.message );
          $(form).next().css('display', 'block');
        }

      } else {
        
        let error;
        $(`#${formData.action}`).parent().get(0).style.display = "block";
        if ( $(`#${formData.action} .w-form-fail`) ) {
          $(`#${formData.action} .w-form-fail`).remove();
        }
        if (data.code) {
          error = MESSAGES[$("html").attr("lang")][data.code];
        } else {
          error = data.message;
        }
        $(`#${formData.action}`).eq(0).append('<div class="w-form-fail d-block">' + error + '</div>');
      }
    },
    error: function (data) {
      $(".loader-trial").addClass("d-block");
      $(`#${formData.action}`).parent().get(0).style.display = "block";
      console.error("Error Connection with API");
    },
  });


};

export default {
  condition,
  initialize,
};
