import { MESSAGES } from "./constansts";
import './style.css';

const forms = $("form");
const condition = () => forms.length > 0;

const initialize = () => {
  $(forms)
    .children('input[type="submit"]')
    .on("click", async function (e) {
      e.preventDefault();
      let form = $(e.target).parent("form");
      validateForm(form);

      let errorsElemnet = $("div.error-field").prev().filter(':not([disabled])');

      if ($(errorsElemnet).length === 0) {
        $(document).trigger("submitFormSuccess", form);
      } else {
        $(document).trigger("submitFormError", form);
      }
    });

  $("input, textarea").on("focusout", (e) => {
    removeError(e.target);
    validateFieldForm(e.target);
  });
};

const validateForm = (form) => {
  let formFields = $(form).find("input, textarea").filter(':not([disabled])');
  removeErrors(formFields);
  $(formFields).each(function (index, item) {
    validateFieldForm(item);
  });
};

const removeErrors = (formFields) => {
  $(formFields).each(function () {
    removeError(this);
  });
};

const removeError = (field) => {
  if ($(field).attr("type") !== "checkbox") {
    if ($(field).next().is("div.error-field")) {
      $(field).next().remove();
    }
  } else {
    if ($(field).parent().next().is("div.error-field")) {
      $(field).parent().next().remove();
      $(field).prev().removeClass("error-checkbox");
    }
  }
};

const validateFieldForm = (field) => {
  if ($(field).attr("data-required")) {
    validRequired(field);
  }

  switch ($(field).attr("data-valid")) {
    case "email":
      valideEmail(field);
      break;
    case "phone":
      validePhoneNumber(field);
      break;
    case "postcode":
      valideFieldPostcode(field);
      break;
    case "nip":
      valideFieldNip(field);
      break;
    case "text":
      valideFieldText(field);
      break;
    default:
  }
};

const setErrorField = (messege, field) => {
  let htmlMessege = `<div class="error-field"><img loading="lazy" alt="" class="error-field-image" src="https://global-uploads.webflow.com/61910111dc1f692d2eaf3138/64c3a210e743d0c2d6d9bfee_6374d2281cf709d489ffc789_ant-design_exclamation-circle-filled.svg"><div class="text-block-10">${messege}</div></div>`;

  if ($(field).attr("type") === "checkbox") {
    if (!$(field).next().is("div.error-field")) {
      $(field).parent().after(htmlMessege);
      $(field).prev().addClass("error-checkbox");
    }
  } else {
    if (!$(field).next().is("div.error-field")) {
      $(field).after(htmlMessege);
    }
  }
};

// Function check field type email

const valideEmail = (field) => {
  let fieldValue = $(field).val();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fieldValue)) {
    setErrorField(MESSAGES[$("html").attr("lang")].email, field);
  }
};

// Function check field type number

const validePhoneNumber = (field) => {
  let fieldValue = $(field).val();
  const phoneRegex = /^\d{9}|\d{3,4} \d{3,4} \d{3,4}$/;
  if (!phoneRegex.test(fieldValue)) {
    setErrorField(MESSAGES[$("html").attr("lang")].phone, field);
  }
};

// Function check field type text

const valideFieldText = (field) => {
  let fieldValue = $(field).val();
  if (fieldValue.length <= 2) {
    setErrorField(MESSAGES[$("html").attr("lang")].text, field);
  }
};

// Function check field type postcode

const valideFieldPostcode = (field) => {
  let fieldValue = $(field).val();
  const phoneRegex = /^(\d{5}|\d{2}-\d{3})$/;
  if (!phoneRegex.test(fieldValue)) {
    setErrorField(MESSAGES[$("html").attr("lang")].postcode, field);
  }
};

// Function check field type NIP

const valideFieldNip = (field) => {
    let fieldValue = $(field).val();
    const phoneRegex = /^(\d{10}|[A-Z]{2}\d{10})$/;
    if (!phoneRegex.test(fieldValue)) {
      setErrorField(MESSAGES[$("html").attr("lang")].nip, field);
    }
  };

// Function check field type checkbox
const validRequired = (field) => {
  if (!$(field).attr("type") !== "checkbox" && $(field).val().length == 0) {
    setErrorField(MESSAGES[$("html").attr("lang")].required, field);
  }
  if ($(field).attr("type") === "checkbox" && !$(field).prop("checked")) {
    setErrorField(MESSAGES[$("html").attr("lang")].required_checkbox, field);
  }
};

export default {
  condition,
  initialize,
};
