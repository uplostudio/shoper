import { API_URL } from "../../constansts";
const fieldsNip = $('[data-valid="nip"]');
const condition = () => fieldsNip.length > 0;

const initialize = () => {
  fieldsNip.each((index, item) => {
    const countryField = $(item)
      .closest("form")
      .find('[name="address1[country]"]');
    $(item).on("input", () => {
      checkNipNumber(item, countryField);
    });

    $(countryField).on("change", () => {
        checkNipNumber(item, countryField);
    });
  });
};

const checkNipNumber = (nipField, countryField) => {
  if ($(nipField).val().length > 2) {
    let data = {
      action: "validate_nip",
      country: $(countryField).val(),
    };
    data[$(nipField).attr("name")] = $(nipField).val();

    $.ajax({
      url: API_URL,
      method: "POST",
      data: data,
      success: function (data) {
        $(nipField).attr("data-valid-nip", data);
      },
      error: function (data) {
        console.error("Error Connection with API");
        $(nipField).attr("data-valid-nip", "false");
      },
    });
  }
};

export default {
  condition,
  initialize,
};
