import { TRANSLATE } from "./constansts";

const payNowRadio = $('input[name="pay_now"]');
const condition = () => payNowRadio.length > 0;

const initialize = () => {
  $(payNowRadio).on("change", function () {
    const btn = $(this).closest('form').find('input[type="submit"]').get(0);
    
    if ($(this).val() === "1") {
      $(".input-radio-additional-info").removeClass("d-none");
      $(btn).attr('value', TRANSLATE[$("html").attr("lang")].paidNowBtn);
    } else {
      $(".input-radio-additional-info").addClass("d-none");
      $(btn).attr('value', TRANSLATE[$("html").attr("lang")].trialBtn);
    }
  });
};

export default {
  condition,
  initialize,
};
