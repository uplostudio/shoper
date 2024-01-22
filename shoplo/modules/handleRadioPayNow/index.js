const payNowRadio = $('input[name="pay_now"]');
const condition = () => payNowRadio.length > 0;

const initialize = () => {
  $(payNowRadio).on("change", function () {
    
    if ($(this).val() === "1") {
      $(".input-radio-additional-info").removeClass("d-none");
    } else {
      $(".input-radio-additional-info").addClass("d-none");
    }
  });
};

export default {
  condition,
  initialize,
};
