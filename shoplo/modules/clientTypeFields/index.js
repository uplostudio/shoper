const clientTypeFields = $(".trial-group-radio-client-type");
const condition = () => clientTypeFields.length > 0;

const initialize = () => {
  clientTypeFields.each(function (index, clientTypeField) {
    let inputRadioElements = $(clientTypeField).find('input[type="radio"]');
    $(inputRadioElements).each(function (index, inputRadioElement) {
      $(inputRadioElement).on("change", function () {
        if ($(inputRadioElement).val() === "0") {
          $('[data-client-field="company"]').addClass("d-none");
          $('[data-client-field="company"]')
            .find("input")
            .attr("disabled", "disabled");
          $('[data-client-field="consumer"]').removeClass("d-none");
          $('[data-client-field="consumer"]')
            .find("input")
            .removeAttr("disabled");
        } else {
          $('[data-client-field="consumer"]').addClass("d-none");
          $('[data-client-field="consumer"]')
            .find("input")
            .attr("disabled", "disabled");
          $('[data-client-field="company"]').removeClass("d-none");
          $('[data-client-field="company"]')
            .find("input")
            .removeAttr("disabled");
        }
      });
    });
  });
};

export default {
  condition,
  initialize,
};
