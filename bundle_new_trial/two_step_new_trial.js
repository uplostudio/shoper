let API_URL_ADDRESS = "https://backend.webflow.prod.shoper.cloud",
  signupFormsActions = ["get_inpost", "get_ssl", "get_app"],
  omittedAttributes = new Set([
    "method",
    "name",
    "id",
    "class",
    "aria-label",
    "fs-formsubmit-element",
    "wf-page-id",
    "wf-element-id",
    "autocomplete",
    "layer",
  ]),
  validationPatterns = {},
  errorMessages = {},
  formType,
  isUsingModal,
  inputsData = {
    inputs: [
      {
        email: {
          active_placeholder: "np. jan.kowalski@domena.pl",
          error:
            "Niepoprawny adres e-mail. Wprowadź adres w formacie: nazwa@domena.pl",
          validationPatterns:
            /^(?=[a-zA-Z0-9@._%+-]{1,254}$)(?=[a-zA-Z0-9._%+-]{1,64}@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
      },
      {
        number_phone: {
          active_placeholder: "w formacie: 123456789",
          error:
            "Niepoprawny numer telefonu. Wprowadź numer składający się z 9 cyfr w formacie: 123456789",
          validationPatterns: /^\d{9}$/,
        },
      },
      {
        phone: {
          active_placeholder: "w formacie: 123456789",
          error:
            "Niepoprawny numer telefonu. Wprowadź numer składający się z 9 cyfr w formacie: 123456789",
          validationPatterns: /^\d{9}$/,
        },
      },
      {
        url: {
          active_placeholder: "np. www.twojsklep.pl",
          error:
            "Podaj poprawny adres www twojego sklepu w formacie: www.twojsklep.pl",
          validationPatterns:
            /^(https?:\/\/)?([a-z\d.-]+)\.([a-z.]{2,6})([\w .-]*)*\/?$/,
        },
      },
      {
        "address1[first_name]": {
          active_placeholder: "",
          error: "Podaj poprawne imię",
          validationPatterns:
            /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
        },
      },
      {
        "address1[last_name]": {
          active_placeholder: "",
          error: "Podaj poprawne nazwisko",
          validationPatterns:
            /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
        },
      },
      {
        name: {
          active_placeholder: "",
          error: "Podaj poprawne imię i nazwisko",
          validationPatterns:
            /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
        },
      },
      {
        "address1[company_name]": {
          active_placeholder: "",
          error: "Podaj poprawną nazwę firmy",
          validationPatterns:
            /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
        },
      },
      {
        "address1[nip]": {
          active_placeholder: "w formacie 1234567890",
          error: "Podaj poprawny numer NIP. Dopuszczalne formaty: 1234567890",
          validationPatterns: /^\d{10}$/,
        },
      },
      {
        "address1[line_1]": {
          active_placeholder: "",
          error: "Podaj poprawny adres",
          validationPatterns:
            /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+(\s+\d+(\s*[a-zA-Z])?(\s*\/\s*\d+)?)?$/,
        },
      },
      {
        "address1[post_code]": {
          active_placeholder: "w formacie 12345",
          error: "Podaj poprawny kod pocztowy",
          validationPatterns: /^(\d{5}|\d{2}-\d{3})$/,
        },
      },
      {
        "address1[city]": {
          active_placeholder: "",
          error: "Podaj poprawny adres",
          validationPatterns:
            /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
        },
      },
    ],
  };
function validateNIPWithAPI(e, a) {
  return $.ajax({
    type: "POST",
    url: API_URL_ADDRESS,
    data: { action: "validate_nip", country: a, nip: e },
  }).then(
    (e) => !0 === e,
    (e) => (console.error("NIP validation API error:", e), !1)
  );
}
function addValidationSVG(e, a) {
  var n = e.closest('[data-element="input-wrapper"]');
  n.length &&
    (n.find(".validation-svg").remove(),
    e.is(":focus") ||
      e.hasClass("active") ||
      ((e = $("<img>", {
        src: a
          ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgOEMwIDMuNTgxNzIgMy41ODE3MiAwIDggMEMxMi40MTgzIDAgMTYgMy41ODE3MiAxNiA4QzE2IDEyLjQxODMgMTIuNDE4MyAxNiA4IDExLjUgNS4yMDVMMTAuNzk1IDQuNUw4IDcuMjk1TDUuMjA1IDQuNUw0LjUgNS4yMDVMNy4yOTUgOEw0LjUgMTAuNzk1TDUuMjA1IDExLjVMOCA4LjcwNUwxMC43OTUgMTEuNUwxMS41IDEwLjc5NUw4LjcwNSA4TDExLjUgNS4yMDVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4="
          : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgOEMwIDMuNTgxNzIgMy41ODE3MiAwIDggMEMxMi40MTgzIDAgMTYgMy41ODE3MiAxNiA4QzE2IDEyLjQxODMgMTIuNDE4MyAxNiA4IDExLjUgNS4yMDVMMTAuNzk1IDQuNUw4IDcuMjk1TDUuMjA1IDQuNUw0LjUgNS4yMDVMNy4yOTUgOEw0LjUgMTAuNzk1TDUuMjA1IDExLjVMOCA4LjcwNUwxMC43OTUgMTEuNUwxMS41IDEwLjc5NUw4LjcwNSA4TDExLjUgNS4yMDVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
        class: "validation-svg",
        css: {
          position: "absolute",
          right: "1rem",
          top: "1.5rem",
          transform: "translateY(-50%)",
          width: "1rem",
          height: "1rem",
          pointerEvents: "none",
        },
      })),
      n.css("position", "relative"),
      n.append(e)));
}
function validateInput(a) {
  var e = a.val().trim(),
    n = a.prop("required"),
    t = a.prop("disabled"),
    o = a.hasClass("active");
  let i = !a.siblings(".new__input-label").length;
  var r = a.data("type") || a.attr("type"),
    l = a.data("form"),
    d = a.attr("name") || a.attr("id");
  if (
    (console.log(
      `[validateInput] Validating input: ${d}, Value: ${e}, Type: ${r}, Required: ` +
        n
    ),
    a.removeClass("invalid error"),
    o || t)
  )
    a.siblings('.error-box, [class*="error-wrapper"]').hide();
  else {
    if ("checkbox" === r || a.closest(".new__trial.is-checkbox").length)
      return (
        (d = a.prop("checked")),
        console.log("[validateInput] Checkbox checked: " + d),
        n && !d
          ? (showError(a, "To pole jest wymagane", i, !0),
            updateInputLabel(a, "invalid"),
            Promise.resolve(!0))
          : (hideError(a, i), updateInputLabel(a, "valid"), Promise.resolve(!1))
      );
    if (n && "" === e)
      return (
        showError(a, "To pole jest wymagane", i, !0),
        updateInputLabel(a, "invalid"),
        Promise.resolve(!0)
      );
    if ("" !== e) {
      o = validationPatterns[r] || validationPatterns[l];
      if (o) {
        if (!o.test(e))
          return (
            showError(
              a,
              errorMessages[r] || errorMessages[l] || errorMessages.default,
              i,
              !1
            ),
            i || addValidationSVG(a, !1),
            Promise.resolve(!0)
          );
        if ("nip" === r || "address1[nip]" === l)
          return validateNIPWithAPI(
            e,
            a
              .closest("form")
              .find('select[data-form="address1[country]"]')
              .val() || "PL"
          )
            .then((e) =>
              e
                ? (hideError(a, i),
                  updateInputLabel(a, "valid"),
                  i || addValidationSVG(a, !0),
                  !1)
                : (showError(a, errorMessages["address1[nip]"], i, !1),
                  updateInputLabel(a, "invalid"),
                  i || addValidationSVG(a, !1),
                  !0)
            )
            .catch(() => (hideError(a, i), updateInputLabel(a, "valid"), !1));
      }
    }
    hideError(a, i),
      i ||
        ("" !== e
          ? addValidationSVG(a, !0)
          : a.siblings(".validation-svg").remove());
  }
  return Promise.resolve(!1);
}
function updateInputLabel(e, a) {
  e = e.closest('[data-element="input-wrapper"]').find(".new__input-label");
  e.length && e.removeClass("valid invalid").addClass(a);
}
function pushFormError(e, a) {
  var n = a.closest("form").attr("id"),
    a = a.attr("data-type") || "undefined";
  DataLayerGatherers.pushDataLayerEvent({
    event: "form_error",
    error_message: e,
    form_id: n,
    form_location: "undefined",
    form_step: a,
    form_type: "undefined",
    lead_offer: "standard",
    lead_type: "new",
  });
}
function showError(a, n, e, t) {
  if (
    (console.log(
      `[showError] Showing error for input: ${
        a.attr("name") || a.attr("id")
      }, Message: ` + n
    ),
    pushFormError(n, a),
    a.addClass("invalid"),
    e || addValidationSVG(a, !1),
    e)
  ) {
    e = a.siblings(".form-input__error-wrapper");
    e.hide(),
      e.eq(t ? 1 : 0).css("display", "flex"),
      ("checkbox" === a.attr("type")
        ? a.prev(".form-checkbox-icon")
        : a
      ).addClass("error");
  } else {
    let e = a.siblings(".error-box");
    (e =
      0 === e.length ? $('<span class="error-box"></span>').insertAfter(a) : e)
      .text(n)
      .show();
  }
}
function hideError(e, a) {
  a
    ? (e.siblings(".form-input__error-wrapper").hide(),
      ("checkbox" === e.attr("type")
        ? e.prev(".form-checkbox-icon")
        : e
      ).removeClass("error"))
    : (e.siblings(".error-box").hide(),
      e.val()
        ? addValidationSVG(e, !0)
        : e.siblings(".validation-svg").remove());
}
function handleBlur(e) {
  let n = $(e.target),
    t =
      (n.data("touched", !0).removeClass("active"),
      !n.siblings(".new__input-label").length);
  validateInput(n).then((e) => {
    var a;
    t ||
      ((a = n.siblings(".new__input-label")).removeClass(
        "active valid invalid"
      ),
      e
        ? (a.addClass("invalid"), addValidationSVG(n, !1))
        : n.val()
        ? (a.addClass("valid"), addValidationSVG(n, !0))
        : n.siblings(".validation-svg").remove(),
      n.attr("placeholder", n.data("initial-placeholder")));
  });
}
function initializeInputs() {
  $("input, textarea").each(function () {
    var e = $(this),
      o = (e.data("touched", !1), !e.siblings(".new__input-label").length);
    if (!o) {
      e.data("initial-placeholder", e.attr("placeholder"));
      let a = e.data("form"),
        n = e.data("type") || e.attr("type");
      var o = inputsData.inputs.find((e) => e[a] || e[n]);
      o &&
        (o = o[a] || o[n]).active_placeholder &&
        "{initial}" !== o.active_placeholder &&
        e.data("active-placeholder", o.active_placeholder),
        e.on({
          focus: function () {
            var e = $(this).siblings(".new__input-label"),
              e =
                ($(this).addClass("active").removeClass("invalid"),
                e.removeClass("valid invalid").addClass("active"),
                $(this).siblings(".error-box").hide(),
                $(this).siblings(".validation-svg").hide(),
                $(this).data("active-placeholder"));
            e && $(this).attr("placeholder", e);
          },
          blur: function () {
            $(this).removeClass("active"),
              $(this).attr("placeholder", $(this).data("initial-placeholder")),
              validateInput($(this)).then((e) => {
                e
                  ? addValidationSVG($(this), !1)
                  : $(this).val()
                  ? addValidationSVG($(this), !0)
                  : $(this).siblings(".validation-svg").remove();
              });
          },
          input: function () {
            let a = $(this).siblings(".new__input-label"),
              n = 0 < $(this).val().length;
            a.removeClass("valid invalid"),
              n ? a.addClass("active") : a.removeClass("active"),
              validateInput($(this)).then((e) => {
                e ? a.addClass("invalid") : n && a.addClass("valid");
              });
          },
          change: function () {
            validateInput($(this)).then((e) => {
              addValidationSVG($(this), !e);
            });
          },
        });
      let t = e.siblings(".new__input-label");
      t.removeClass("active valid invalid"),
        e.val()
          ? validateInput(e).then((e) => {
              e ? t.addClass("invalid") : t.addClass("valid");
            })
          : e.attr("placeholder", e.data("initial-placeholder"));
    }
    e.on("blur", handleBlur);
  }),
    $("input, textarea").removeClass("invalid");
}
function validateForm(e) {
  e = $(e).find(
    "input:not([type='submit']):not([data-exclude='true']):not(:disabled), textarea:not([data-exclude='true']):not(:disabled), select:not([data-exclude='true']):not(:disabled)"
  );
  return Promise.all(
    e
      .filter(function () {
        return !$(this).closest("[data-element]").hasClass("hide");
      })
      .map(function () {
        return validateInput($(this));
      })
      .get()
  ).then(
    (e) => (
      console.log(
        "[validateForm] Number of invalid inputs: " + e.filter(Boolean).length
      ),
      e.filter(Boolean).length
    )
  );
}
function performNIPPreflightCheck(e) {
  let a = e.find(
    'input[data-type="nip"]:not([data-exclude="true"]):not(:disabled), input[data-form="address1[nip]"]:not([data-exclude="true"]):not(:disabled)'
  );
  var n;
  return 0 === a.length
    ? Promise.resolve(!0)
    : ((n = a.val().trim()),
      validationPatterns["address1[nip]"].test(n)
        ? validateNIPWithAPI(
            n,
            e.find('select[data-form="address1[country]"]').val() || "PL"
          )
            .then(
              (e) => (
                e
                  ? hideError(a, !a.siblings(".new__input-label").length)
                  : showError(
                      a,
                      errorMessages["address1[nip]"],
                      !a.siblings(".new__input-label").length,
                      !1
                    ),
                e
              )
            )
            .catch(
              () => (hideError(a, !a.siblings(".new__input-label").length), !0)
            )
        : (showError(
            a,
            errorMessages["address1[nip]"],
            !a.siblings(".new__input-label").length,
            !1
          ),
          Promise.resolve(!1)));
}
function sendFormDataToURL(e) {
  let t = new FormData(),
    a = $(e),
    n = a.find(".loading-in-button.is-inner");
  Array.from(e.attributes).forEach(({ name: e, value: a }) => {
    e = e.replace("data-", "");
    a && !omittedAttributes.has(e) && t.append(e, a);
  });
  e = a.find(
    "input:not([type='submit']):enabled:not([data-exclude='true']), textarea:enabled, select:enabled"
  );
  let o = {},
    i =
      (e.each(function () {
        var e = $(this),
          a = e.attr("name"),
          n = e.attr("type"),
          t = e.attr("data-form") || a;
        console.log(`[sendFormDataToURL] Processing input: ${a}, Type: ` + n),
          "radio" === n
            ? e.is(":checked") && (o[t] = e.val())
            : "checkbox" === n || e.closest(".new__trial.is-checkbox").length
            ? (a = e.attr("name") || e.siblings("label").attr("for")) &&
              ((o[a] = e.is(":checked") ? "1" : "0"),
              console.log(`[sendFormDataToURL] Checkbox ${a} value: ` + o[a]))
            : (n = e.val().trim()) && (o[t] = n);
      }),
      ["marketplace", "country", "create_or_move_shop"]);
  Object.entries(o).forEach(([n, e]) => {
    i.includes(n) && Array.isArray(e)
      ? e.forEach((e, a) => {
          t.append(n + `[${a}]`, e);
        })
      : t.append(n, e);
  });
  DataLayerGatherers.getValueTrackData();
  t.append(
    "front_page",
    window.location.host +
      window.location.pathname +
      (window.location.hash || "")
  ),
    t.append("adwords[gclid]", window.myGlobals.gclidValue),
    t.append("adwords[fbclid]", window.myGlobals.fbclidValue);
  e = DataLayerGatherers.addUtmDataToForm({});
  Object.entries(e).forEach(([e, a]) => {
    t.has(e) || t.append(e, a);
  }),
    console.log("[sendFormDataToURL] Form data prepared:", t),
    $.ajax({
      type: "POST",
      url: API_URL_ADDRESS,
      data: t,
      processData: !1,
      contentType: !1,
      beforeSend: () => {
        n && n.show && n.show();
      },
      complete: () => {
        n && n.hide && n.hide();
      },
      success: (e) => {
        t.has("host")
          ? 1 === e.status
            ? (a.siblings(".error-admin").hide(),
              "get_admin" === a.attr("data-action") &&
                dataLayer.push({
                  event: "login",
                  user_id: "undefined",
                  shop_id: "undefined",
                }),
              (window.location.href = e.redirect))
            : a.siblings(".error-admin").show()
          : "create_trial_step3" === a.data("name") && 1 === e.status
          ? (localStorage.clear(), (window.location.href = e.redirect))
          : 0 !== e.status
          ? (a.hide().next().show(), $(document).trigger("submitSuccess", a))
          : $(document).trigger("submitError", a);
      },
      error: () => {
        a.siblings(".error-message").show();
      },
    });
}
function handleSubmitClick(e) {
  e.preventDefault();
  let n = $(this).closest("form");
  e = n.attr("data-action");
  signupFormsActions.includes(e) &&
    dataLayer.push({
      event: "sign_up",
      user_id: "undefined",
      method: "url",
      shop_id: "undefined",
    }),
    validateForm(n[0]).then((e) => {
      if (0 < e)
        DataLayerGatherers.pushTrackEventErrorModal(
          n.attr("id"),
          $(this).val(),
          n.attr("data-label") || "consult-form"
        );
      else {
        let a = n.find(
          'input[data-type="nip"]:not([data-exclude="true"]):not(:disabled), input[data-form="address1[nip]"]:not([data-exclude="true"]):not(:disabled)'
        );
        0 < a.length
          ? validateNIPWithAPI(
              a.val().trim(),
              n.find('select[data-form="address1[country]"]').val() || "PL"
            )
              .then((e) => {
                e
                  ? sendFormDataToURL(n[0])
                  : showError(
                      a,
                      errorMessages["address1[nip]"],
                      !a.siblings(".new__input-label").length,
                      !1
                    );
              })
              .catch(() => {
                sendFormDataToURL(n[0]);
              })
          : sendFormDataToURL(n[0]);
      }
    });
}
function initializeEventListeners() {
  $("[data-form='submit']").on("click", handleSubmitClick),
    $("[data-app^='open_'], [data-element^='open_']").on("click", function () {
      var e = ($(this).data("app") || $(this).data("element")).replace(
          /^open_|_modal_button$/g,
          ""
        ),
        e = $(`[data-app='${e}'], [data-element='${e}']`),
        e =
          (e.addClass("modal--open"),
          $(document.body).addClass("overflow-hidden"),
          e.find("form:first"));
      0 < e.length && e.find(":input:enabled:visible:first").focus();
    }),
    $("[fs-formsubmit-element='reset']").on("click", () =>
      $(".loading-in-button").hide()
    ),
    $(document).on("submitSuccess submitError", (e, a) => {
      var n = {
        event: "myTrackEvent",
        eventCategory:
          "Button modal form " +
          ("submitSuccess" === e.type ? "sent" : "error"),
        eventAction: $(a).find('[type="submit"]').val(),
        eventType: $(a).attr("data-label"),
        eventLabel: window.location.href,
      };
      DataLayerGatherers.pushDataLayerEvent(n),
        "submitSuccess" === e.type &&
          ((n = $(a).attr("id")),
          DataLayerGatherers.pushDataLayerEvent({
            event: "generate_lead",
            form_id: n,
            form_location: "",
            form_type: "",
            lead_offer: "standard",
            form_step: "complete",
            lead_type: "new",
          }));
    }),
    $('select[data-form="address1[country]"]').on("change", function () {
      let a = $(this)
        .closest("form")
        .find('input[data-type="nip"], input[data-form="address1[nip]"]');
      0 < a.length &&
        "" !== a.val().trim() &&
        validateInput(a).then((e) => {
          updateInputLabel(a, e ? "invalid" : "valid");
        });
    });
}
function cleanObject(e = {}) {
  return Object.fromEntries(
    Object.entries(e).filter(([, e]) => null != e && "" !== e)
  );
}
inputsData.inputs.forEach((e) => {
  var [e, a] = Object.entries(e)[0];
  (validationPatterns[e] = a.validationPatterns), (errorMessages[e] = a.error);
}),
  (window.validationPatterns = validationPatterns),
  $(document).ready(() => {
    initializeInputs(), initializeEventListeners();
  });
class Accordion {
  speed = 400;
  oneOpen = !1;
  accordionId = "";
  style = !1;
  constructor(e) {
    (this.accordionId = e.accordionId),
      (this.style = e.style),
      (this.oneOpen = e.oneOpen);
  }
  create() {
    let a = this;
    var e = $(`#${this.accordionId} .js-accordion`).find(
        ".js-accordion-header"
      ),
      n = $(`#${this.accordionId} .js-accordion-item`);
    e.each((e, a) => {
      $(a).attr("data-sh-bind", e);
    }),
      $(`#${this.accordionId} .accordion__image`).each((e, a) => {
        $(a).attr("data-sh-bind", e);
      }),
      e.on("click", function (e) {
        e = $(e.currentTarget);
        let n = e.attr("data-sh-bind");
        a.oneOpen &&
          e[0] !=
            e
              .closest(".js-accordion")
              .find("> .js-accordion-item.active > .js-accordion-header")[0] &&
          e
            .closest(".js-accordion")
            .find("> .js-accordion-item")
            .removeClass("active")
            .find(".js-accordion-body")
            .slideUp(),
          $(`#${a.accordionId} img[data-sh-bind]`).each((e, a) => {
            $(a).attr("data-sh-bind") === n
              ? $(a).addClass("active")
              : $(a).removeClass("active");
          }),
          e.closest(".js-accordion-item").toggleClass("active"),
          e.next().stop().slideToggle(a.speed);
      }),
      !0 === this.style &&
        n.on("click", function () {
          $(".transparent-border").removeClass("transparent-border"),
            $(this).prev().addClass("transparent-border");
        }),
      this.oneOpen &&
        1 < $(`#${this.accordionId} .js-accordion-item.active`).length &&
        $(
          `#${this.accordionId} .js-accordion-item.active:not(:first)`
        ).removeClass("active"),
      $(`#${this.accordionId} .js-accordion-item.active`)
        .find("> .js-accordion-body")
        .show();
  }
}
window.SharedUtils = window.SharedUtils || {};
let $twoStepTrialsWrapper = $("[data-element='trials-wrapper-two-steps']"),
  currentSID =
    ($('[data-app="trial-domain"]').text(localStorage.getItem("host") || ""),
    (SharedUtils.API_URL = "https://backend.webflow.prod.shoper.cloud"),
    (SharedUtils.statusMessages = Object.freeze({
      2: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj co najmniej godzinę, zanim zrobisz to ponownie.",
      3: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj kilka minut, zanim zrobisz to ponownie.",
      4: "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.",
    })),
    (SharedUtils.enforceDisplay = function (a, n) {
      let t = new MutationObserver((e) => {
        e.forEach((e) => {
          "attributes" === e.type &&
            "style" === e.attributeName &&
            a.css("display") !== n &&
            (a.css("display", n), t.disconnect());
        });
      });
      t.observe(a[0], { attributes: !0, attributeFilter: ["style"] }),
        a.css("display", n);
    }),
    (SharedUtils.handleResponse = function (e, a, n, t, o, i) {
      o
        ? this.handleSuccessResponse(e, a, n, t, i)
        : this.handleErrorResponse(e, a, n, t, i),
        $(document).trigger("formSubmissionComplete", [o, a, n, e]);
    }),
    (SharedUtils.handleSuccessResponse = function (e, a, n, t, o) {
      var i;
      e.client_id && (window.myGlobals.clientId = e.client_id),
        e.host && (window.myGlobals.host = e.host),
        e.shop_id && (window.myGlobals.shopId = e.shop_id),
        e.license_id && (window.myGlobals.licenseId = e.license_id),
        e.sid &&
          ((i = new Date().getTime()),
          localStorage.setItem(
            "sid",
            JSON.stringify({ value: e.sid, timestamp: i })
          ),
          this.setCurrentSID(e.sid),
          $(
            '[data-formid="create_trial_step1_new"], [data-formid="create_trial_step2"], [data-formid="create_trial_step3"]'
          ).attr("data-sid", e.sid)),
        1 === e.status &&
          (e.email && localStorage.setItem("email", this.encodeEmail(e.email)),
          e.host && localStorage.setItem("host", e.host),
          $(document).trigger("trialStepComplete", [o, e]));
    }),
    (SharedUtils.handleErrorResponse = function (e, a, n, t, o) {
      "abort" === e.statusText
        ? console.log("Request was aborted")
        : (console.error("Error:", e),
          t.text("Wystąpił niespodziewany błąd.").show());
    }),
    (SharedUtils.encodeEmail = function (e) {
      var a, n, t;
      return e
        ? (([a, n] = e.split("@")),
          n
            ? a.length <= 2
              ? a + "@" + n
              : ((t = "*".repeat(Math.max(0, a.length - 2))),
                "" + a[0] + t + a[a.length - 1] + "@" + n)
            : e)
        : "";
    }),
    null);
function maskPhoneNumber(e) {
  return e.replace(/(\+48)(\d{7})(\d{2})/, "$1 *** *** *$3");
}
(SharedUtils.checkAndUpdateSID = function () {
  var a = localStorage.getItem("sid");
  if (a) {
    let e;
    try {
      e = JSON.parse(a);
    } catch (e) {
      return (
        console.error("Failed to parse SID data:", e),
        localStorage.removeItem("sid"),
        void this.setCurrentSID(null)
      );
    }
    e && e.value
      ? (new Date().getTime() - e.timestamp) / 36e5 < 24
        ? (this.setCurrentSID(e.value),
          $(
            '[data-formid="create_trial_step1_new"], [data-formid="create_trial_step2"], [data-formid="create_trial_step3"]'
          ).attr("data-sid", e.value))
        : (localStorage.removeItem("sid"),
          $(
            '[data-formid="create_trial_step1_new"], [data-formid="create_trial_step2"], [data-formid="create_trial_step3"]'
          ).removeAttr("data-sid"),
          this.setCurrentSID(null))
      : (localStorage.removeItem("sid"), this.setCurrentSID(null));
  } else this.setCurrentSID(null);
}),
  (SharedUtils.getCurrentSID = function () {
    return currentSID;
  }),
  (SharedUtils.setCurrentSID = function (e) {
    currentSID = e;
  }),
  (SharedUtils.populateCountrySelect = function (t, o = "PL") {
    $.each(this.countriesList, function (e, a) {
      var n = $("<option></option>").text(a.name_pl).val(a.code);
      a.code === o && n.attr("selected", "selected"), $(t).append(n);
    });
  }),
  $(document).on(
    "click",
    ".iti.iti--allow-dropdown.iti--separate-dial-code.iti--show-flags",
    function () {
      var e;
      $(window).width() < 992 &&
        (e = $(".iti.iti--container")).length &&
        !e.parent().is(this) &&
        (e.css({
          top: "48px",
          left: "0",
          position: "absolute",
          height: "50vh",
          "overflow-y": "auto",
        }),
        $(this).append(e));
    }
  ),
  (SharedUtils.countriesList = [
    { name_pl: "Polska", name_en: "Poland", code: "PL" },
    { name_pl: "Afganistan", name_en: "Afghanistan", code: "AF" },
    { name_pl: "Albania", name_en: "Albania", code: "AL" },
    { name_pl: "Algieria", name_en: "Algeria", code: "DZ" },
    { name_pl: "Andora", name_en: "Andorra", code: "AD" },
    { name_pl: "Angola", name_en: "Angola", code: "AO" },
    { name_pl: "Anguilla", name_en: "Anguilla", code: "AI" },
    { name_pl: "Antarktyka", name_en: "Antarctica", code: "AQ" },
    {
      name_pl: "Antigua i Barbuda",
      name_en: "Antigua and Barbuda",
      code: "AG",
    },
    { name_pl: "Arabia Saudyjska", name_en: "Saudi Arabia", code: "SA" },
    { name_pl: "Argentyna", name_en: "Argentina", code: "AR" },
    { name_pl: "Armenia", name_en: "Armenia", code: "AM" },
    { name_pl: "Aruba", name_en: "Aruba", code: "AW" },
    { name_pl: "Australia", name_en: "Australia", code: "AU" },
    { name_pl: "Austria", name_en: "Austria", code: "AT" },
    { name_pl: "Azerbejdżan", name_en: "Azerbaijan", code: "AZ" },
    { name_pl: "Bahamy", name_en: "Bahamas", code: "BS" },
    { name_pl: "Bahrajn", name_en: "Bahrain", code: "BH" },
    { name_pl: "Bangladesz", name_en: "Bangladesh", code: "BD" },
    { name_pl: "Barbados", name_en: "Barbados", code: "BB" },
    { name_pl: "Belgia", name_en: "Belgium", code: "BE" },
    { name_pl: "Belize", name_en: "Belize", code: "BZ" },
    { name_pl: "Benin", name_en: "Benin", code: "BJ" },
    { name_pl: "Bermudy", name_en: "Bermuda", code: "BM" },
    { name_pl: "Bhutan", name_en: "Bhutan", code: "BT" },
    { name_pl: "Białoruś", name_en: "Belarus", code: "BY" },
    {
      name_pl: "Boliwia",
      name_en: "Bolivia, Plurinational State of",
      code: "BO",
    },
    {
      name_pl: "Bonaire, Sint Eustatius i Saba",
      name_en: "Bonaire, Sint Eustatius and Saba",
      code: "BQ",
    },
    {
      name_pl: "Bośnia i Hercegowina",
      name_en: "Bosnia and Herzegovina",
      code: "BA",
    },
    { name_pl: "Botswana", name_en: "Botswana", code: "BW" },
    { name_pl: "Brazylia", name_en: "Brazil", code: "BR" },
    { name_pl: "Brunei", name_en: "Brunei Darussalam", code: "BN" },
    {
      name_pl: "Brytyjskie Terytorium Oceanu Indyjskiego",
      name_en: "British Indian Ocean Territory",
      code: "IO",
    },
    {
      name_pl: "Brytyjskie Wyspy Dziewicze",
      name_en: "Virgin Islands, British",
      code: "VG",
    },
    { name_pl: "Bułgaria", name_en: "Bulgaria", code: "BG" },
    { name_pl: "Burkina Faso", name_en: "Burkina Faso", code: "BF" },
    { name_pl: "Burundi", name_en: "Burundi", code: "BI" },
    { name_pl: "Chile", name_en: "Chile", code: "CL" },
    { name_pl: "Chiny", name_en: "China", code: "CN" },
    { name_pl: "Chorwacja", name_en: "Croatia", code: "HR" },
    { name_pl: "Curaçao", name_en: "Curaçao", code: "CW" },
    { name_pl: "Cypr", name_en: "Cyprus", code: "CY" },
    { name_pl: "Czad", name_en: "Chad", code: "TD" },
    { name_pl: "Czarnogóra", name_en: "Montenegro", code: "ME" },
    { name_pl: "Czechy", name_en: "Czech Republic", code: "CZ" },
    {
      name_pl: "Dalekie Wyspy Mniejsze Stanów Zjednoczonych",
      name_en: "United States Minor Outlying Islands",
      code: "UM",
    },
    { name_pl: "Dania", name_en: "Denmark", code: "DK" },
    {
      name_pl: "Demokratyczna Republika Konga",
      name_en: "Congo, the Democratic Republic of the",
      code: "CD",
    },
    { name_pl: "Dominika", name_en: "Dominica", code: "DM" },
    { name_pl: "Dominikana", name_en: "Dominican Republic", code: "DO" },
    { name_pl: "Dżibuti", name_en: "Djibouti", code: "DJ" },
    { name_pl: "Egipt", name_en: "Egypt", code: "EG" },
    { name_pl: "Ekwador", name_en: "Ecuador", code: "EC" },
    { name_pl: "Erytrea", name_en: "Eritrea", code: "ER" },
    { name_pl: "Estonia", name_en: "Estonia", code: "EE" },
    { name_pl: "Etiopia", name_en: "Ethiopia", code: "ET" },
    {
      name_pl: "Falklandy",
      name_en: "Falkland Islands (Malvinas)",
      code: "FK",
    },
    { name_pl: "Fidżi", name_en: "Fiji", code: "FJ" },
    { name_pl: "Filipiny", name_en: "Philippines", code: "PH" },
    { name_pl: "Finlandia", name_en: "Finland", code: "FI" },
    { name_pl: "Francja", name_en: "France", code: "FR" },
    {
      name_pl: "Francuskie Terytoria Południowe i Antarktyczne",
      name_en: "French Southern Territories",
      code: "TF",
    },
    { name_pl: "Gabon", name_en: "Gabon", code: "GA" },
    { name_pl: "Gambia", name_en: "Gambia", code: "GM" },
    {
      name_pl: "Georgia Południowa i Sandwich Południowy",
      name_en: "South Georgia and the South Sandwich Islands",
      code: "GS",
    },
    { name_pl: "Ghana", name_en: "Ghana", code: "GH" },
    { name_pl: "Gibraltar", name_en: "Gibraltar", code: "GI" },
    { name_pl: "Grecja", name_en: "Greece", code: "GR" },
    { name_pl: "Grenada", name_en: "Grenada", code: "GD" },
    { name_pl: "Grenlandia", name_en: "Greenland", code: "GL" },
    { name_pl: "Gruzja", name_en: "Georgia", code: "GE" },
    { name_pl: "Guam", name_en: "Guam", code: "GU" },
    { name_pl: "Guernsey", name_en: "Guernsey", code: "GG" },
    { name_pl: "Gujana Francuska", name_en: "French Guiana", code: "GF" },
    { name_pl: "Gujana", name_en: "Guyana", code: "GY" },
    { name_pl: "Gwadelupa", name_en: "Guadeloupe", code: "GP" },
    { name_pl: "Gwatemala", name_en: "Guatemala", code: "GT" },
    { name_pl: "Gwinea Bissau", name_en: "Guinea-Bissau", code: "GW" },
    { name_pl: "Gwinea Równikowa", name_en: "Equatorial Guinea", code: "GQ" },
    { name_pl: "Gwinea", name_en: "Guinea", code: "GN" },
    { name_pl: "Haiti", name_en: "Haiti", code: "HT" },
    { name_pl: "Hiszpania", name_en: "Spain", code: "ES" },
    { name_pl: "Holandia", name_en: "Netherlands", code: "NL" },
    { name_pl: "Honduras", name_en: "Honduras", code: "HN" },
    { name_pl: "Hongkong", name_en: "Hong Kong", code: "HK" },
    { name_pl: "Indie", name_en: "India", code: "IN" },
    { name_pl: "Indonezja", name_en: "Indonesia", code: "ID" },
    { name_pl: "Irak", name_en: "Iraq", code: "IQ" },
    { name_pl: "Iran", name_en: "Iran, Islamic Republic of", code: "IR" },
    { name_pl: "Irlandia", name_en: "Ireland", code: "IE" },
    { name_pl: "Islandia", name_en: "Iceland", code: "IS" },
    { name_pl: "Izrael", name_en: "Israel", code: "IL" },
    { name_pl: "Jamajka", name_en: "Jamaica", code: "JM" },
    { name_pl: "Japonia", name_en: "Japan", code: "JP" },
    { name_pl: "Jemen", name_en: "Yemen", code: "YE" },
    { name_pl: "Jersey", name_en: "Jersey", code: "JE" },
    { name_pl: "Jordania", name_en: "Jordan", code: "JO" },
    { name_pl: "Kajmany", name_en: "Cayman Islands", code: "KY" },
    { name_pl: "Kambodża", name_en: "Cambodia", code: "KH" },
    { name_pl: "Kamerun", name_en: "Cameroon", code: "CM" },
    { name_pl: "Kanada", name_en: "Canada", code: "CA" },
    { name_pl: "Katar", name_en: "Qatar", code: "QA" },
    { name_pl: "Kazachstan", name_en: "Kazakhstan", code: "KZ" },
    { name_pl: "Kenia", name_en: "Kenya", code: "KE" },
    { name_pl: "Kirgistan", name_en: "Kyrgyzstan", code: "KG" },
    { name_pl: "Kiribati", name_en: "Kiribati", code: "KI" },
    { name_pl: "Kolumbia", name_en: "Colombia", code: "CO" },
    { name_pl: "Komory", name_en: "Comoros", code: "KM" },
    { name_pl: "Kongo", name_en: "Congo", code: "CG" },
    { name_pl: "Korea Południowa", name_en: "Korea, Republic of", code: "KR" },
    {
      name_pl: "Korea Północna",
      name_en: "Korea, Democratic People's Republic of",
      code: "KP",
    },
    { name_pl: "Kostaryka", name_en: "Costa Rica", code: "CR" },
    { name_pl: "Kuba", name_en: "Cuba", code: "CU" },
    { name_pl: "Kuwejt", name_en: "Kuwait", code: "KW" },
    {
      name_pl: "Laos",
      name_en: "Lao People's Democratic Republic",
      code: "LA",
    },
    { name_pl: "Lesotho", name_en: "Lesotho", code: "LS" },
    { name_pl: "Liban", name_en: "Lebanon", code: "LB" },
    { name_pl: "Liberia", name_en: "Liberia", code: "LR" },
    { name_pl: "Libia", name_en: "Libyan Arab Jamahiriya", code: "LY" },
    { name_pl: "Liechtenstein", name_en: "Liechtenstein", code: "LI" },
    { name_pl: "Litwa", name_en: "Lithuania", code: "LT" },
    { name_pl: "Luksemburg", name_en: "Luxembourg", code: "LU" },
    { name_pl: "Łotwa", name_en: "Latvia", code: "LV" },
    {
      name_pl: "Macedonia",
      name_en: "Macedonia, the former Yugoslav Republic of",
      code: "MK",
    },
    { name_pl: "Madagaskar", name_en: "Madagascar", code: "MG" },
    { name_pl: "Majotta", name_en: "Mayotte", code: "YT" },
    { name_pl: "Makau", name_en: "Macao", code: "MO" },
    { name_pl: "Malawi", name_en: "Malawi", code: "MW" },
    { name_pl: "Malediwy", name_en: "Maldives", code: "MV" },
    { name_pl: "Malezja", name_en: "Malaysia", code: "MY" },
    { name_pl: "Mali", name_en: "Mali", code: "ML" },
    { name_pl: "Malta", name_en: "Malta", code: "MT" },
    {
      name_pl: "Mariany Północne",
      name_en: "Northern Mariana Islands",
      code: "MP",
    },
    { name_pl: "Maroko", name_en: "Morocco", code: "MA" },
    { name_pl: "Martynika", name_en: "Martinique", code: "MQ" },
    { name_pl: "Mauretania", name_en: "Mauritania", code: "MR" },
    { name_pl: "Mauritius", name_en: "Mauritius", code: "MU" },
    { name_pl: "Meksyk", name_en: "Mexico", code: "MX" },
    {
      name_pl: "Mikronezja",
      name_en: "Micronesia, Federated States of",
      code: "FM",
    },
    { name_pl: "Mjanma", name_en: "Myanmar", code: "MM" },
    { name_pl: "Mołdawia", name_en: "Moldova, Republic of", code: "MD" },
    { name_pl: "Monako", name_en: "Monaco", code: "MC" },
    { name_pl: "Mongolia", name_en: "Mongolia", code: "MN" },
    { name_pl: "Montserrat", name_en: "Montserrat", code: "MS" },
    { name_pl: "Mozambik", name_en: "Mozambique", code: "MZ" },
    { name_pl: "Namibia", name_en: "Namibia", code: "NA" },
    { name_pl: "Nauru", name_en: "Nauru", code: "NR" },
    { name_pl: "Nepal", name_en: "Nepal", code: "NP" },
    { name_pl: "Niemcy", name_en: "Germany", code: "DE" },
    { name_pl: "Niger", name_en: "Niger", code: "NE" },
    { name_pl: "Nigeria", name_en: "Nigeria", code: "NG" },
    { name_pl: "Nikaragua", name_en: "Nicaragua", code: "NI" },
    { name_pl: "Niue", name_en: "Niue", code: "NU" },
    { name_pl: "Norfolk", name_en: "Norfolk Island", code: "NF" },
    { name_pl: "Norwegia", name_en: "Norway", code: "NO" },
    { name_pl: "Nowa Kaledonia", name_en: "New Caledonia", code: "NC" },
    { name_pl: "Nowa Zelandia", name_en: "New Zealand", code: "NZ" },
    { name_pl: "Oman", name_en: "Oman", code: "OM" },
    { name_pl: "Pakistan", name_en: "Pakistan", code: "PK" },
    { name_pl: "Palau", name_en: "Palau", code: "PW" },
    {
      name_pl: "Palestyna",
      name_en: "Palestinian Territory, Occupied",
      code: "PS",
    },
    { name_pl: "Panama", name_en: "Panama", code: "PA" },
    { name_pl: "Papua-Nowa Gwinea", name_en: "Papua New Guinea", code: "PG" },
    { name_pl: "Paragwaj", name_en: "Paraguay", code: "PY" },
    { name_pl: "Peru", name_en: "Peru", code: "PE" },
    { name_pl: "Pitcairn", name_en: "Pitcairn", code: "PN" },
    { name_pl: "Polinezja Francuska", name_en: "French Polynesia", code: "PF" },
    { name_pl: "Portoryko", name_en: "Puerto Rico", code: "PR" },
    { name_pl: "Portugalia", name_en: "Portugal", code: "PT" },
    {
      name_pl: "Republika Południowej Afryki",
      name_en: "South Africa",
      code: "ZA",
    },
    {
      name_pl: "Republika Środkowoafrykańska",
      name_en: "Central African Republic",
      code: "CF",
    },
    {
      name_pl: "Republika Zielonego Przylądka",
      name_en: "Cape Verde",
      code: "CV",
    },
    { name_pl: "Reunion", name_en: "Réunion", code: "RE" },
    { name_pl: "Rosja", name_en: "Russian Federation", code: "RU" },
    { name_pl: "Rumunia", name_en: "Romania", code: "RO" },
    { name_pl: "Rwanda", name_en: "Rwanda", code: "RW" },
    { name_pl: "Sahara Zachodnia", name_en: "Western Sahara", code: "EH" },
    {
      name_pl: "Saint Kitts i Nevis",
      name_en: "Saint Kitts and Nevis",
      code: "KN",
    },
    { name_pl: "Saint Lucia", name_en: "Saint Lucia", code: "LC" },
    {
      name_pl: "Saint Vincent i Grenadyny",
      name_en: "Saint Vincent and the Grenadines",
      code: "VC",
    },
    { name_pl: "Saint-Barthélemy", name_en: "Saint Barthélemy", code: "BL" },
    {
      name_pl: "Saint-Martin",
      name_en: "Saint Martin (French part)",
      code: "MF",
    },
    {
      name_pl: "Saint-Pierre i Miquelon",
      name_en: "Saint Pierre and Miquelon",
      code: "PM",
    },
    { name_pl: "Salwador", name_en: "El Salvador", code: "SV" },
    { name_pl: "Samoa Amerykańskie", name_en: "American Samoa", code: "AS" },
    { name_pl: "Samoa", name_en: "Samoa", code: "WS" },
    { name_pl: "San Marino", name_en: "San Marino", code: "SM" },
    { name_pl: "Senegal", name_en: "Senegal", code: "SN" },
    { name_pl: "Serbia", name_en: "Serbia", code: "RS" },
    { name_pl: "Seszele", name_en: "Seychelles", code: "SC" },
    { name_pl: "Sierra Leone", name_en: "Sierra Leone", code: "SL" },
    { name_pl: "Singapur", name_en: "Singapore", code: "SG" },
    {
      name_pl: "Sint Maarten",
      name_en: "Sint Maarten (Dutch part)",
      code: "SX",
    },
    { name_pl: "Słowacja", name_en: "Slovakia", code: "SK" },
    { name_pl: "Słowenia", name_en: "Slovenia", code: "SI" },
    { name_pl: "Somalia", name_en: "Somalia", code: "SO" },
    { name_pl: "Sri Lanka", name_en: "Sri Lanka", code: "LK" },
    { name_pl: "Stany Zjednoczone", name_en: "United States", code: "US" },
    { name_pl: "Suazi", name_en: "Swaziland", code: "SZ" },
    { name_pl: "Sudan", name_en: "Sudan", code: "SD" },
    { name_pl: "Sudan Południowy", name_en: "South Sudan", code: "SS" },
    { name_pl: "Surinam", name_en: "Suriname", code: "SR" },
    {
      name_pl: "Svalbard i Jan Mayen",
      name_en: "Svalbard and Jan Mayen",
      code: "SJ",
    },
    { name_pl: "Syria", name_en: "Syrian Arab Republic", code: "SY" },
    { name_pl: "Szwajcaria", name_en: "Switzerland", code: "CH" },
    { name_pl: "Szwecja", name_en: "Sweden", code: "SE" },
    { name_pl: "Tadżykistan", name_en: "Tajikistan", code: "TJ" },
    { name_pl: "Tajlandia", name_en: "Thailand", code: "TH" },
    { name_pl: "Tajwan", name_en: "Taiwan, Province of China", code: "TW" },
    {
      name_pl: "Tanzania",
      name_en: "Tanzania, United Republic of",
      code: "TZ",
    },
    { name_pl: "Timor Wschodni", name_en: "Timor-Leste", code: "TL" },
    { name_pl: "Togo", name_en: "Togo", code: "TG" },
    { name_pl: "Tokelau", name_en: "Tokelau", code: "TK" },
    { name_pl: "Tonga", name_en: "Tonga", code: "TO" },
    {
      name_pl: "Trynidad i Tobago",
      name_en: "Trinidad and Tobago",
      code: "TT",
    },
    { name_pl: "Tunezja", name_en: "Tunisia", code: "TN" },
    { name_pl: "Turcja", name_en: "Turkey", code: "TR" },
    { name_pl: "Turkmenistan", name_en: "Turkmenistan", code: "TM" },
    {
      name_pl: "Turks i Caicos",
      name_en: "Turks and Caicos Islands",
      code: "TC",
    },
    { name_pl: "Tuvalu", name_en: "Tuvalu", code: "TV" },
    { name_pl: "Uganda", name_en: "Uganda", code: "UG" },
    { name_pl: "Ukraina", name_en: "Ukraine", code: "UA" },
    { name_pl: "Urugwaj", name_en: "Uruguay", code: "UY" },
    { name_pl: "Uzbekistan", name_en: "Uzbekistan", code: "UZ" },
    { name_pl: "Vanuatu", name_en: "Vanuatu", code: "VU" },
    { name_pl: "Wallis i Futuna", name_en: "Wallis and Futuna", code: "WF" },
    {
      name_pl: "Watykan",
      name_en: "Holy See (Vatican City State)",
      code: "VA",
    },
    {
      name_pl: "Wenezuela",
      name_en: "Venezuela, Bolivarian Republic of",
      code: "VE",
    },
    { name_pl: "Węgry", name_en: "Hungary", code: "HU" },
    { name_pl: "Wielka Brytania", name_en: "United Kingdom", code: "GB" },
    { name_pl: "Wietnam", name_en: "Viet Nam", code: "VN" },
    { name_pl: "Włochy", name_en: "Italy", code: "IT" },
    {
      name_pl: "Wybrzeże Kości Słoniowej",
      name_en: "Côte d'Ivoire",
      code: "CI",
    },
    { name_pl: "Wyspa Bouveta", name_en: "Bouvet Island", code: "BV" },
    {
      name_pl: "Wyspa Bożego Narodzenia",
      name_en: "Christmas Island",
      code: "CX",
    },
    { name_pl: "Wyspa Man", name_en: "Isle of Man", code: "IM" },
    {
      name_pl:
        "Wyspa Świętej Heleny, Wyspa Wniebowstąpienia i Tristan da Cunha",
      name_en: "Saint Helena, Ascension and Tristan Cunha",
      code: "SH",
    },
    { name_pl: "Wyspy Alandzkie", name_en: "Åland Islands", code: "AX" },
    { name_pl: "Wyspy Cooka", name_en: "Cook Islands", code: "CK" },
    {
      name_pl: "Wyspy Dziewicze Stanów Zjednoczonych",
      name_en: "Virgin Islands, U.S.",
      code: "VI",
    },
    {
      name_pl: "Wyspy Heard i McDonalda",
      name_en: "Heard Island and McDonald Islands",
      code: "HM",
    },
    {
      name_pl: "Wyspy Kokosowe",
      name_en: "Cocos (Keeling) Islands",
      code: "CC",
    },
    { name_pl: "Wyspy Marshalla", name_en: "Marshall Islands", code: "MH" },
    { name_pl: "Wyspy Owcze", name_en: "Faroe Islands", code: "FO" },
    { name_pl: "Wyspy Salomona", name_en: "Solomon Islands", code: "SB" },
    {
      name_pl: "Wyspy Świętego Tomasza i Książęca",
      name_en: "Sao Tome and Principe",
      code: "ST",
    },
    { name_pl: "Zambia", name_en: "Zambia", code: "ZM" },
    { name_pl: "Zimbabwe", name_en: "Zimbabwe", code: "ZW" },
    {
      name_pl: "Zjednoczone Emiraty Arabskie",
      name_en: "United Arab Emirates",
      code: "AE",
    },
  ]),
  $(document).ready(() => {
    let i = { errors: [], phoneRegex: window.validationPatterns.number_phone },
      s = $('[data-element="trials-wrapper-two-steps"]'),
      c,
      m,
      r,
      p = (isUsingModal = !1),
      u = !1,
      l = (e, a, n) => {
        var t = $("#trial-promo"),
          o = $("#trial-promo-box"),
          a = a
            ? { name: "Premium", key: "premium" }
            : n
            ? { name: "Standard+", key: "standard-plus" }
            : { name: "Standard", key: "standard" },
          n = e.promotion?.price?.[a.key]?.discount,
          i = e.price?.[a.key]?.regular_price_year,
          e = e.promotion?.price?.[a.key]?.[12]?.year?.net,
          n =
            (n && 0 !== n ? t.text(n + "% taniej").show() : t.hide(),
            (e) =>
              parseFloat(e || 0).toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }));
        o.html(
          `Shoper ${a.name} w promocji <del>${n(i)}</del> <strong>${n(
            e
          )} zł</strong> netto / pierwszy rok`
        );
      },
      _ = (e) =>
        ({
          email:
            "Niepoprawny adres e-mail. Wprowadź adres w formacie: nazwa@domena.pl",
          required: "To pole jest wymagane.",
          phone:
            "Niepoprawny numer telefonu. Wprowadź poprawny numer telefonu.",
        }[e] || "To pole jest wymagane."),
      h = (e, a, n, t) => {
        DataLayerGatherers.pushDataLayerEvent({
          event: "formSubmitError",
          formId: e,
          email: n,
          phone: t,
          action: a,
          website: "shoper",
          eventLabel: window.location.pathname,
        });
      },
      e = (e, a) => {
        var n = e.val().trim(),
          t = "email" === a ? validationPatterns.email : i.phoneRegex;
        let o = null;
        return (
          n ? t.test(n) || (o = _(a)) : (o = _("required")),
          e.next(".error-box").remove(),
          o
            ? (e.after(`<span class="error-box">${o}</span>`),
              e.removeClass("valid").addClass("invalid"),
              e
                .siblings(".new__input-label")
                .removeClass("valid active")
                .addClass("invalid"))
            : (e.removeClass("invalid").addClass("valid"),
              e
                .siblings(".new__input-label")
                .removeClass("invalid")
                .addClass("valid")),
          o
        );
      },
      f = (e) => {
        var a = $(e),
          n = window.intlTelInputGlobals.getInstance(e);
        if (!n)
          return (
            console.error("IntlTelInput instance not found for field:", e),
            "IntlTelInput not initialized"
          );
        let t = null;
        var e = n.getSelectedCountryData().iso2,
          o = n.getNumber().trim(),
          i =
            (d(a),
            "Niepoprawny numer telefonu. Wprowadź numer składający się z 9 cyfr w formacie: 123456789");
        return (
          o
            ? "pl" === e
              ? (9 ===
                  ((e = o.replace(/\D/g, "")).startsWith("48") ? e.slice(2) : e)
                    .length &&
                  /^(?:\+48)?(?:(?:[\s-]?\d{3}){3}|\d{9})$/.test(o)) ||
                (t = i)
              : n.isValidNumber() || (t = i)
            : (t = _("required")),
          t ? v(a, t) : g(a, "valid"),
          t
        );
      },
      v = (e, a) => {
        e.addClass("error");
        let n = e.siblings(".error-box");
        (n =
          0 === n.length
            ? $('<div class="error-box"></div>').insertAfter(e)
            : n)
          .text(a)
          .show();
      },
      d = (e) => {
        e.removeClass("error"), e.siblings(".error-box").hide();
      },
      g = (e, a) => {
        e
          .siblings(".new__input-label")
          .removeClass("valid invalid")
          .addClass(a),
          e.removeClass("valid invalid").addClass(a);
      },
      a = () => {
        var e,
          a = localStorage.getItem("phoneNumber");
        a &&
          ((e = $('[data-form="number_phone"]', s)).val(a).prop("disabled", !0),
          (e = window.intlTelInputGlobals.getInstance(e[0]))) &&
          (e.setNumber(a), e.disable());
      },
      w = (e) => {
        s.find('[data-element^="modal_trial_"]').hide(),
          s.find(`[data-element="${e}"]`).show(),
          "modal_trial_three" === e && a();
      },
      n = (a, r) => {
        a.preventDefault();
        let l = r.find('[data-type="email"]'),
          d = r.find('[data-type="phone"]');
        var n = l.length ? e(l, "email") : null,
          t = d.length ? f(d[0]) : null;
        if (n || t) h(r.attr("id"), r.data("action"), l.val(), d.val());
        else {
          let i = r.next().next(),
            e = r.find(".loading-in-button.is-inner");
          e.show(), c && c.abort && c.abort();
          (n = {
            action: r.data("action"),
            email: l.val(),
            "adwords[gclid]": window.myGlobals.gclidValue,
            "adwords[fbclid]": window.myGlobals.fbclidValue,
            analyticsId: window.myGlobals.analyticsId,
            affiliant: shoperAffiliate || "",
            form_source_url: window.location.href.split("?")[0],
            ...DataLayerGatherers.addUtmDataToForm({}),
          }),
            (t =
              (d.length &&
                ((t = window.intlTelInputGlobals.getInstance(d[0]))
                  ? (n.phone = t.getNumber())
                  : console.error(
                      "IntlTelInput instance not found for phone field"
                    )),
              p
                ? ((n.package = 33),
                  (n.period = 12),
                  localStorage.setItem("isPremiumPackage", "true"),
                  localStorage.setItem("isStandardPlusPackage", "false"))
                : u
                ? ((n.package = 38),
                  (n.period = 12),
                  localStorage.setItem("isPremiumPackage", "false"),
                  localStorage.setItem("isStandardPlusPackage", "true"))
                : (localStorage.setItem("isPremiumPackage", "false"),
                  localStorage.setItem("isStandardPlusPackage", "false")),
              localStorage.getItem("sid")));
          if (t)
            try {
              var o = JSON.parse(t);
              o.value && (n.sid = o.value);
            } catch (a) {
              console.error("Failed to parse SID from localStorage:", a);
            }
          m && (n.sid = m),
            (c = $.ajax({
              url: SharedUtils.API_URL,
              method: "POST",
              timeout: 3e4,
              data: n,
            }))
              .then((a) => {
                if (1 === a.status) {
                  var n, t, o;
                  d.length &&
                    (n = window.intlTelInputGlobals.getInstance(d[0])) &&
                    ((n = maskPhoneNumber(n.getNumber())),
                    localStorage.setItem("phoneNumber", n)),
                    SharedUtils.handleResponse(a, r, l, i, !0, 1),
                    DataLayerGatherers.pushEmailSubmittedData(
                      window.myGlobals.clientId,
                      window.myGlobals.shopId,
                      r.data("action"),
                      l.val()
                    ),
                    localStorage.removeItem("shoper_affiliate"),
                    "validate_email" === r.data("action")
                      ? ((n = l.val()),
                        (t = localStorage.getItem("trialEmail")),
                        (o = "true" === localStorage.getItem("trialCompleted")),
                        n === t && o
                          ? w("modal_trial_three")
                          : (localStorage.setItem("trialEmail", n),
                            localStorage.setItem("trialCompleted", "false"),
                            w("modal_trial_one_two")),
                        $('[data-form="email"]', s).val(n).prop("disabled", !0),
                        s.show())
                      : "create_trial_step1_new" === r.data("action") &&
                        (w("modal_trial_three"),
                        localStorage.setItem("trialCompleted", "true"));
                  let e = 0;
                  "#create_trial_step1" === a.step
                    ? (e = 0)
                    : a.hasOwnProperty("client_id")
                    ? ((e = 1),
                      dataLayer.push({
                        event: "sign_up",
                        user_id: a.client_id || "undefined",
                        method: "url",
                        shop_id: a.shop_id || "undefined",
                      }))
                    : a.hasOwnProperty("redirect") && (e = 2),
                    $(document).trigger("actualTrialStepComplete", [e, a, r]),
                    $('[data-app="trial-domain"]').text(a.host);
                } else {
                  let e;
                  (e =
                    a.hasOwnProperty("code") &&
                    SharedUtils.statusMessages.hasOwnProperty(a.code)
                      ? SharedUtils.statusMessages[a.code]
                      : _("email")),
                    v(l, e),
                    h(r.attr("id"), r.data("action"), l.val());
                }
              })
              .catch((e) => {
                console.error("Ajax error:", e),
                  SharedUtils.handleResponse(e, r, l, i, !1, 1);
              })
              .always(() => {
                e.hide(), (c = null);
              });
        }
      };
    let t = $("[data-element='open_trial_two_steps_wrapper']");
    t.length &&
      t.on("click", function () {
        (isUsingModal = !0),
          (formType = isUsingModal ? "modal" : "inline"),
          s.show();
        var e = localStorage.getItem("trialEmail"),
          a = "true" === localStorage.getItem("trialCompleted");
        a ? w("modal_trial_three") : w("modal_trial_one_two"),
          e && $('[data-form="email"]', s).val(e).prop("disabled", !0),
          $(document).trigger("trialModalOpened", ["new_flow"]),
          $(document).trigger("trialStepStarted", [a ? 3 : 1]),
          $(document).trigger("trialStepViewed", [a ? 3 : 1]),
          $("body").addClass("overflow-hidden"),
          (p = !0 === $(this).data("premium")),
          (u = !0 === $(this).data("standard-plus"));
        let n;
        (n = p
          ? {
              trial_type: "Premium",
              item_id: "Premium",
              item_name: "Premium",
              price: "499",
            }
          : u
          ? {
              trial_type: "Standard+",
              item_id: "Standard+",
              item_name: "Standard+",
              price: "35",
            }
          : {
              trial_type: "Standard",
              item_id: "Standard",
              item_name: "Standard",
              price: "35",
            }),
          DataLayerGatherers.pushDataLayerEvent({
            event: "begin_checkout",
            formId: "create_trial_button",
            formType: formType,
            ecommerce: {
              value: "420",
              items: [
                {
                  ...n,
                  item_category: "Global Header",
                  currency: "PLN",
                  item_variant: "12",
                },
              ],
            },
            eventLabel: window.location.pathname,
          }),
          window.ShoperPricing.addLoadCallback(function (e) {
            l(e, p, u);
          });
      });
    var o = $("[data-element='close_trial_wrapper']");
    o.length &&
      o.on("click", () => {
        s.hide(), $("body").removeClass("overflow-hidden");
      });
    let y = ((a, n) => {
      let t;
      return function (...e) {
        clearTimeout(t),
          (t = setTimeout(() => {
            clearTimeout(t), a(...e);
          }, n));
      };
    })(function (e, a, n, t) {
      console.log("$form:", t), console.log("actualCompletedStep:", a);
      let o;
      o = p
        ? {
            trial_type: "Premium",
            item_id: "Premium",
            item_name: "Premium",
            price: "499",
          }
        : u
        ? {
            trial_type: "Standard+",
            item_id: "Standard+",
            item_name: "Standard+",
            price: "35",
          }
        : {
            trial_type: "Standard",
            item_id: "Standard",
            item_name: "Standard",
            price: "35",
          };
      t = t && t.length ? t.attr("id") : "unknown";
      0 === a
        ? (console.log("Step 0 " + formType),
          DataLayerGatherers.pushDataLayerEvent({
            event: "begin_checkout",
            formId: t,
            formType: formType,
            ecommerce: {
              value: "420",
              items: [
                {
                  ...o,
                  item_category: "Global Header",
                  currency: "PLN",
                  item_variant: "12",
                },
              ],
            },
            eventLabel: window.location.pathname,
          }))
        : 1 === a &&
          DataLayerGatherers.pushDataLayerEvent({
            event: "add_payment_info",
            formStep: "phone",
            formId: t,
            formType: formType,
            ecommerce: {
              value: "420",
              items: [
                {
                  ...o,
                  item_category: "Global Header",
                  currency: "PLN",
                  item_variant: "12",
                },
              ],
            },
            eventLabel: window.location.pathname,
          }),
        JSON.stringify(n) !== JSON.stringify(r) &&
          ((r = n),
          window.ShoperPricing.addLoadCallback(function (e) {
            l(e, p, u);
          }));
    }, 250);
    $(document)
      .off("actualTrialStepComplete")
      .on("actualTrialStepComplete", function (e, a, n, t) {
        switch ((console.log("Actual trial step completed:", a), a)) {
          case 0:
            console.log("Step 0 completed: Email validation"), y(e, a, n, t);
            break;
          case 1:
            console.log("Step 1 completed: Client ID received"), y(e, a, n, t);
            break;
          case 2:
            console.log("Step 2 completed: Redirect received");
            break;
          default:
            console.log("Unknown step completed");
        }
      }),
      $(document).on(
        "blur",
        '[data-action="create_trial_step1_new"] [data-type="email"], [data-action="validate_email"] [data-type="email"]',
        function () {
          e($(this), "email");
        }
      ),
      $(document).on("blur", '[data-type="phone"]', function () {
        f(this);
      }),
      $(document).on(
        "keydown",
        '[data-action="create_trial_step1_new"] [data-type="email"], [data-action="validate_email"] [data-type="email"], [data-type="phone"]',
        function (e) {
          "Enter" === e.key &&
            (e.preventDefault(), n(e, $(this).closest("form")));
        }
      ),
      $(document).on(
        "click",
        '[data-form="submit-step-one-two"], [data-form="validate_email"]',
        function (e) {
          n(e, $(this).closest("form"));
        }
      ),
      $(document).on(
        "submit",
        '[data-action="create_trial_step1_new"], [data-action="validate_email"]',
        function (e) {
          n(e, $(this));
        }
      ),
      $('[data-type="phone"]').each(function () {
        window.intlTelInput(this, {
          utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
          preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
          autoInsertDialCode: !1,
          nationalMode: !1,
          separateDialCode: !0,
          autoPlaceholder: "off",
          initialCountry: "pl",
        });
      }),
      SharedUtils.checkAndUpdateSID(),
      setInterval(SharedUtils.checkAndUpdateSID, 36e5),
      "function" == typeof updateAnalytics
        ? updateAnalytics()
        : console.warn("updateAnalytics function is not defined");
    $(window).on("beforeunload", () => {
      c && c.abort(),
        $(document).off(
          "blur",
          '[data-action="create_trial_step1_new"] [data-type="email"], [data-action="validate_email"] [data-type="email"]'
        ),
        $(document).off("blur", '[data-type="phone"]'),
        $(document).off(
          "keydown",
          '[data-action="create_trial_step1_new"] [data-type="email"], [data-action="validate_email"] [data-type="email"], [data-type="phone"]'
        ),
        $(document).off(
          "click",
          '[data-form="submit-step-one-two"], [data-form="validate_email"]'
        ),
        $(document).off(
          "submit",
          '[data-action="create_trial_step1_new"], [data-action="validate_email"]'
        ),
        t.off("click"),
        $(document).off("actualTrialStepComplete");
    }),
      $(document).ready(function () {
        let r = $('[data-formid="create_trial_step3"], [data-name="reseller"]'),
          a = r.find('[data-form="submit-step-three"]'),
          n = r.find('input[name="address[client_type]"]'),
          t = r.find('input[name="pay_now"]'),
          o = $('[data-element="company"]'),
          i = $('[data-element="consument"]'),
          l = $("#trial-promo-box");
        function e() {
          var e = "1" === n.filter(":checked").val();
          o
            .toggleClass("hide", !e)
            .find("input")
            .prop("disabled", !e)
            .attr("data-exclude", e ? null : "true"),
            i
              .toggleClass("hide", e)
              .find("input")
              .prop("disabled", e)
              .attr("data-exclude", e ? "true" : null),
            r.find(".invalid").removeClass("invalid"),
            r.find(".error-box").remove();
        }
        function d() {
          var e = "1" === t.filter(":checked").val();
          l.toggle(e),
            a
              .find("#label")
              .text(e ? "Zapłać teraz" : "Rozpocznij darmowy okres próbny");
        }
        function s(e, a) {
          e = {
            event: "formSubmitError",
            formid: e || "",
            action: a || "",
            "address1[client_type]":
              r.find('input[name="address[client_type]"]:checked').val() || "",
            "address1[first_name]":
              r.find('input[name="address[first_name]"]').val() || "",
            "address1[last_name]":
              r.find('input[name="address[last_name]"]').val() || "",
            "address1[line_1]":
              r.find('input[name="address[line_1]"]').val() || "",
            "address1[post_code]":
              r.find('input[name="address[post_code]"]').val() || "",
            "address1[city]": r.find('input[name="address[city]"]').val() || "",
            "address1[country]":
              r.find('select[name="address[country]"]').val() || "",
            pay_now: r.find('input[name="pay_now"]:checked').val() || "",
            accept: 1,
            website: "shoper",
            eventLabel: window.location.pathname || "",
          };
          DataLayerGatherers.pushDataLayerEvent(e);
        }
        var c, m, p;
        (p = r.filter('[data-formid="create_trial_step3"]')).length &&
          ((c = localStorage.getItem("email")),
          (m = localStorage.getItem("phoneNumber")),
          p.find('[data-form="email"]').val(c).prop("disabled", !0),
          p.find('[data-form="number_phone"]').val(m).prop("disabled", !0)),
          SharedUtils.populateCountrySelect("#address1\\[country\\]"),
          n
            .filter('[value="1"]')
            .prop("checked", !0)
            .closest("label")
            .addClass("is-checked"),
          e(),
          n.on("change", function () {
            n.closest("label").removeClass("is-checked"),
              $(this).closest("label").addClass("is-checked"),
              e();
          }),
          t.on("change", d),
          a.on("click", function (e) {
            e.preventDefault();
            {
              let o = "true" === localStorage.getItem("isPremiumPackage"),
                i = "true" === localStorage.getItem("isStandardPlusPackage");
              validateForm(r[0]).then((e) => {
                let a = localStorage.getItem("phoneNumber") || "",
                  n = r.data("formid"),
                  t = n;
                0 === e
                  ? 0 <
                      (e = r.find(
                        'input[data-type="nip"]:not([data-exclude="true"]):not(:disabled)'
                      )).length && "true" !== e.attr("data-exclude")
                    ? performNIPPreflightCheck(r).then((e) => {
                        e
                          ? (sendFormDataToURL(r[0]),
                            DataLayerGatherers.pushFormSubmitSuccessData(n, t),
                            DataLayerGatherers.pushDataLayerEvent({
                              event: "ecommerce_purchase",
                              ecommerce: {
                                trial: !0,
                                trial_type: o
                                  ? "Premium"
                                  : i
                                  ? "Standard+"
                                  : "Standard",
                                client_type: "Firma",
                              },
                              eventLabel: window.location.pathname,
                              formType: formType,
                            }))
                          : (s(n, t, a), pushDataLayerError());
                      })
                    : (sendFormDataToURL(r[0]),
                      DataLayerGatherers.pushFormSubmitSuccessData(n, t),
                      DataLayerGatherers.pushDataLayerEvent({
                        event: "ecommerce_purchase",
                        ecommerce: {
                          trial: !0,
                          trial_type: o
                            ? "Premium"
                            : i
                            ? "Standard+"
                            : "Standard",
                          client_type: "Konsument",
                        },
                        eventLabel: window.location.pathname,
                        formType: formType,
                      }))
                  : (s(n, t, a), pushDataLayerError());
              });
            }
          }),
          r.find("input, select, textarea").each(function () {
            var e = $(this);
            e.data("touched", !1),
              e.data("initial-placeholder", e.attr("placeholder"));
          }),
          $(document).on("actualTrialStepComplete", function (e, a, n) {
            var t;
            2 === a &&
              ((a = $('[data-element="modal_trial_three"]')),
              (t = $('[data-element="modal_trial_success"]')),
              a.length && a.hide(),
              t.length) &&
              t.show();
          });
      });
  }),
  $(document).on("formSubmissionComplete", function (e, a, n, t, o) {
    if (a) {
      let e = "";
      "true" === localStorage.getItem("isPremiumPackage")
        ? (e = 33)
        : "true" === localStorage.getItem("isStandardPlusPackage") && (e = 38),
        DataLayerGatherers.pushTrackEventDataModal(
          window.myGlobals.clientId,
          n.data("action"),
          window.myGlobals.shopId,
          n.data("action"),
          t.val(),
          e
        );
    } else DataLayerGatherers.pushTrackEventError(n.data("action"), n.find("#label").text(), t.val());
  }),
  $(document).ready(function () {
    updateDisclaimer(), changeSubmitValue();
  });
let pathnameGroups = {
  group2: [
    "/systemy-platnosci",
    "/kurierzy",
    "/domena",
    "/certyfikaty-ssl",
    "/klarna",
    "/systemy-platnosci/google-pay",
    "/systemy-platnosci/paypo",
    "/shoper-connect",
    "/apilo",
    "/autopay",
    "/przelewy24",
  ],
};
function getGroupForPathname(a) {
  for (var [e, n] of Object.entries(pathnameGroups))
    if (
      n
        .map((e) => (e.endsWith("/") ? e.slice(0, -1) : e))
        .some((e) => a.startsWith(e))
    )
      return e;
}
function updateDisclaimer() {
  var e = getGroupForPathname(window.location.pathname),
    a = $("[data-item='disclaimer']");
  "group2" === e &&
    a.html(
      '<div>Nie masz jeszcze sklepu? <a href="/cennik-sklepu-shoper" class="inline-link">Wypróbuj go za darmo</a></div>'
    );
}
function changeSubmitValue() {
  var e = $("[data-app='login']").find("input[type='submit']");
  e.length && e.val("Zaloguj się");
}
function getOrStoreParameter(e) {
  var a = new URLSearchParams(window.location.search).get(e) || "",
    n = localStorage.getItem(e);
  return a ? (a !== n && localStorage.setItem(e, a), a) : n || "";
}
function updateAnalytics() {
  setTimeout(() => {
    try {
      var e = ga.getAll()[0];
      (window.myGlobals.analyticsId = e.get("clientId")),
        $("[name='analytics_id']").val(window.myGlobals.analyticsId);
    } catch (e) {}
  }, 2e3);
}
(window.myGlobals = {
  clientId: null,
  host: null,
  shopId: null,
  analyticsId: null,
  licenseId: null,
  URL: null,
  fbclidValue: getOrStoreParameter("fbclid"),
  gclidValue: getOrStoreParameter("gclid"),
}),
  (window.myGlobals.URL =
    "www.shoper.pl" === window.location.hostname
      ? "https://www.shoper.pl/ajax.php"
      : "https://webflow-sandbox.shoper.pl/ajax.php");
let DataLayerGatherers = {
  pushDataLayerEvent(e) {
    (window.dataLayer = window.dataLayer || []), window.dataLayer.push(e);
  },
  formAbandonEvent() {
    let a = $(".new__trial-modal"),
      e = $('[data-element^="modal_trial_"]');
    var n = $('[data-element="close_trial_wrapper"]');
    let t = !1,
      o = null,
      i = null;
    function r() {
      var e;
      i &&
        !$(`[data-action="${i}"]`).data("submitted") &&
        ((e = o.val()),
        DataLayerGatherers.pushDataLayerEvent({
          event: "formAbandon",
          formId: i,
          email: e,
          action: i,
          website: "shoper",
          eventLabel: window.location.href,
        }),
        (t = !1),
        (o = null),
        (i = null));
    }
    a.on("input change", "input, select, textarea", function () {
      t = !0;
    }),
      a.on("focus", "input, select, textarea", function () {
        (o = $(this)),
          (i = e
            .filter(function () {
              return "none" !== $(this).css("display");
            })
            .find('[data-action^="create_trial_step"]')
            .attr("data-action"));
      }),
      a.on("blur", "input, select, textarea", function () {
        t = !0;
      }),
      n.on("click", function (e) {
        t && r();
      }),
      $(document).on("click", function (e) {
        !$(e.target).closest(a).length && t && r();
      }),
      $(document).on("keydown", function (e) {
        "Escape" === e.key && t && r();
      }),
      a.on("submit", '[data-action^="create_trial_step"]', function () {
        (t = !1), (o = null), (i = null);
      });
  },
  controlBlur() {
    $(document).on("blur", "form input", function () {
      var e = $(this),
        a = e.closest("form");
      DataLayerGatherers.pushDataLayerEvent({
        event: "controlBlur",
        formId: a.attr("data-action"),
        controlName: e.attr("data-form"),
        controlType: e.attr("data-type"),
        controlValue: e.val(),
      });
    });
  },
  controlFocus() {
    $(document).on("focus", "form input", function () {
      var e = $(this),
        a = e.closest("form");
      DataLayerGatherers.pushDataLayerEvent({
        event: "controlFocus",
        formId: a.attr("data-action"),
        controlName: e.attr("data-form"),
        controlType: e.attr("data-type"),
        controlValue: e.val(),
      });
    });
  },
  pushEmailSubmittedData(e, a, n, t) {
    this.pushDataLayerEvent({
      event: "trial_EmailSubmitted",
      client_id: e,
      "shop-id": a,
      formId: n,
      email: t,
    });
  },
  pushFormSubmitSuccessData(e, a, n) {
    e = {
      eventName: "formSubmitSuccess",
      formId: e,
      eventCategory: "Button form sent",
      eventLabel: window.location.pathname,
      eventType: a,
      eventHistory: window.history,
    };
    n && (e.formType = n), this.pushDataLayerEvent(e);
  },
  pushTrackEventData(e, a, n) {
    this.pushDataLayerEvent({
      event: "myTrackEvent",
      formId: e,
      eventCategory: "Button form sent",
      eventAction: a,
      eventType: n,
      eventLabel: window.location.pathname,
    });
  },
  pushTrackEventDataModal(e, a, n, t, o, i) {
    this.pushDataLayerEvent({
      event: "formSubmitSuccess",
      eventCategory: "Button modal form sent",
      client_id: e,
      formId: a,
      "shop-id": n,
      eventAction: t,
      eventLabel: window.location.pathname,
      eventType: o,
      eventHistory: window.history,
      package: i,
    });
  },
  pushTrackEventError(e, a, n) {
    this.pushDataLayerEvent({
      eventName: "formSubmitError",
      formId: e,
      eventCategory: "Button form error",
      eventAction: a,
      eventLabel: window.location.pathname,
      eventType: n,
      eventHistory: window.history,
    });
  },
  pushSubmitError(e, a, n) {
    this.pushDataLayerEvent({
      eventName: "myTrackEvent",
      formId: e,
      eventCategory: "Button form error",
      eventAction: a,
      eventLabel: window.location.pathname,
      eventType: n,
    });
  },
  pushTrackEventErrorModal(e, a, n) {
    this.pushDataLayerEvent({
      eventName: "formSubmitError",
      formId: e,
      eventCategory: "Button modal form error",
      eventAction: a,
      eventLabel: window.location.pathname,
      eventType: n,
      eventHistory: window.history,
    });
  },
  pushSubmitErrorModal(e, a, n) {
    this.pushDataLayerEvent({
      eventName: "myTrackEvent",
      formId: e,
      eventCategory: "Button modal form error",
      eventAction: a,
      eventLabel: window.location.pathname,
      eventType: n,
    });
  },
  pushModalClosed() {
    this.pushDataLayerEvent({
      event: "myTrackEvent",
      eventCategory: "Button modal closed",
      eventAction: "",
      eventType: "modal-form",
      eventLabel: window.location.pathname,
    });
  },
  pushClientTypeChangeEvent(e) {
    this.pushDataLayerEvent({ event: "client_type_change", client_type: e });
  },
  pushFormInteractionEvent(e, a, n, t) {
    this.pushDataLayerEvent({
      event: "form_interaction",
      form_id: e,
      form_location: a,
      form_type: n,
      form_step: t,
    });
  },
  checkAndStoreQueryParams() {
    let e = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "adgroup",
        "utm_term",
      ],
      a = "adwords";
    var n = (function () {
      let a = new URLSearchParams(window.location.search),
        n = {};
      return (
        e.forEach((e) => {
          a.has(e) && (n[e] = a.get(e));
        }),
        n
      );
    })();
    0 < Object.keys(n).length &&
      ((n = { ...(n = n), timestamp: new Date().getTime() }),
      localStorage.setItem(a, JSON.stringify(n))),
      (n = localStorage.getItem(a)) &&
        ((n = JSON.parse(n)), 7776e6 < new Date().getTime() - n.timestamp) &&
        localStorage.removeItem(a);
  },
  getValueTrackData() {
    var e = localStorage.getItem(VALUE_TRACK_KEY);
    return e ? JSON.parse(e) : null;
  },
  addUtmDataToForm(a) {
    let n = this.getValueTrackData();
    return (
      n &&
        Object.keys(n).forEach((e) => {
          "timestamp" !== e && (a[`adwords[${e}]`] = n[e]);
        }),
      a
    );
  },
};
function clientTypeChange() {
  $('input[name="address[client_type]"]').on("change", function () {
    var e = $(this).closest("label").find("span.w-form-label").text().trim();
    DataLayerGatherers.pushClientTypeChangeEvent(e);
  });
}
function trackFormInteraction(e, a) {
  e.data("interaction-tracked") ||
    (DataLayerGatherers.pushFormInteractionEvent(
      e.attr("id") || "empty",
      window.location.pathname,
      formType,
      (a && a.length && a.attr("data-form")) || "unknown"
    ),
    e.data("interaction-tracked", !0));
}
$(document).ready(function () {
  DataLayerGatherers.formAbandonEvent(),
    DataLayerGatherers.controlBlur(),
    DataLayerGatherers.controlFocus();
}),
  $(document).on(
    "closeModalCalled",
    DataLayerGatherers.pushModalClosed.bind(DataLayerGatherers)
  ),
  $(document).ready(function () {
    $("a[data-app^='open_'], a[data-element^='open_']").click(function () {
      var e = $(this).data("app") || $(this).data("element"),
        a = $(this).text(),
        e = e.split("open_")[1].split("_")[0];
      DataLayerGatherers.pushDataLayerEvent({
        event: "myTrackEvent",
        eventCategory: "Button modal opened",
        eventAction: a,
        eventLabel: window.location.href,
        eventType: e,
      });
    });
  }),
  $(window).on("load", function () {
    clientTypeChange();
  }),
  $(document).ready(function () {
    $("form").on("focus", "input, textarea, select", function () {
      trackFormInteraction($(this.form), $(this));
    });
  });
let lineAnimationTime = 1e3;
function closeModal() {
  $(".modal--open").removeClass("modal--open"),
    $(document.body).toggleClass("overflow-hidden", !1),
    (isFromBanner = !1),
    (formLocation = ""),
    (formType = "inline"),
    (isUsingModal = !1),
    $(".checkbox-multi.is-trigger").length &&
      $(".checkbox-multi.is-trigger").each(function () {
        if ($(this).hasClass("w--redirected-checked"))
          return (
            $(".checkbox-multi.is-trigger").removeClass(
              "w--redirected-checked"
            ),
            !1
          );
      });
  var e = window.location.href.split("#")[0];
  history.pushState(null, null, e), $(document).trigger("closeModalCalled");
}
setTimeout(() => {
  $("#line-load-animate").addClass("animate");
}, lineAnimationTime),
  $(".nav__burger-inner").on("click", function () {
    $("body").toggleClass("overflow-hidden");
  }),
  $(
    ".modal__close, .modal__close-area, [data-trigger='close-modal'], [data-element='close_trial_wrapper']"
  ).on("click", closeModal),
  $(document).on("keyup", function (e) {
    27 === e.which && closeModal();
  }),
  $("[fs-formsubmit-element='reset']").on("click", function () {
    $(".checkbox-multi.is-trigger").each(function () {
      if ($(this).hasClass("w--redirected-checked"))
        return (
          $(".checkbox-multi.is-trigger").removeClass("w--redirected-checked"),
          !1
        );
    });
  }),
  $(".show-in-editor").each(function () {
    $(this).removeClass("show-in-editor");
  });
try {
  let e = document.querySelector(".nav-secondary"),
    a = new IntersectionObserver(
      ([e]) =>
        e.target.classList.toggle("is-pinned", e.boundingClientRect.top < 0),
      { threshold: [1] }
    );
  a.observe(e);
} catch (e) {}
let vh = 0.01 * window.innerHeight;
function isScrolledIntoView(e) {
  var a = $(window).scrollTop(),
    n = a + $(window).height(),
    t = $(e).offset().top;
  return t + $(e).height() <= n && a <= t;
}
function wrapKeywordInSpan(a, n, o, i) {
  $(document).ready(function () {
    let t = $(`[${n}]`).attr(n);
    if (t && "" !== t.trim()) {
      var e = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let n = new RegExp("" + e, "gi");
      $(a).html(function (e, a) {
        return a.replace(n, `<span id="${o}" class="${i}">${t}</span>`);
      });
    }
  });
}
document.documentElement.style.setProperty("--vh", vh + "px"),
  window.addEventListener("resize", () => {
    var e = 0.01 * window.innerHeight;
    document.documentElement.style.setProperty("--vh", e + "px");
  }),
  $(window).scroll(function () {
    $(".is-in-view").each(function () {
      setTimeout(() => {
        !0 === isScrolledIntoView(this) && $(this).addClass("animate");
      }, 2e3);
    });
  }),
  wrapKeywordInSpan("h1", "data-span", "line-load-animate", "mark animate"),
  $(function () {
    window.location.href;
    var a = window.location.hostname,
      e = window.location.pathname,
      n = ["q5mb64jfuh3c6ngf.webflow.io", "selium.eu"].some(function (e) {
        return a === e || a.endsWith("." + e);
      }),
      e =
        -1 !==
        [
          "/rodo",
          "/zmien-oprogramowanie-sklepu",
          "/regulamin-kampanii/microsoft-advert",
          "/regulamin-kampanii/google-ads",
          "/oferta-shoper-plus",
          "/oferta-symfonia",
          "/oferta-sklep-polaczony-z-allegro",
          "/sklep-internetowy-abonament",
          "/witajwshoper",
          "/storefront",
          "/kampanie-ppc",
          "/pozycjonowanie-sklepow-internetowych",
          "/cennik-sklepu-shoper",
          "/pelny-cennik-uslug-shoper",
          "/program-partnerski",
          "/program-partnerski/reseller",
          "/program-partnerski/afiliant",
          "/program-partnerski/tworca-aplikacji",
          "/new-components/forms",
        ].indexOf(e);
    n ||
      e ||
      $("body").append(
        '<script src="https://development--shoper-web.netlify.app/intercom.js"></script>'
      );
  }),
  (function () {
    let t = $(".nav").find(".nav__menu"),
      n = "dropdown--open",
      o = "tab--open",
      i = "nav--open",
      r = !1,
      l = !1,
      d = 1,
      s = !1,
      c = "";
    var e;
    let a = "",
      m = () => $("#userAgent").is(":hidden"),
      p = () => {
        return m() ? ((a = "Mobile"), !0) : !(a = "Desktop");
      };
    function u(e, a) {
      let n = $(e.target);
      e = e.changedTouches[0];
      let t = parseInt(e.clientX);
      $(this).off("touchend"),
        $(this).on("touchend", function (e) {
          e = e.changedTouches[0];
          parseInt(e.clientX) > t + 50 && a(n);
        });
    }
    function _(e) {
      var a,
        n = $(".nav__burger-inner");
      return (
        $('[data-app="custom-banner"]').css("display", "flex"),
        h(),
        !1 === s
          ? ($('[data-app="custom-banner"]').css("display", "none"),
            (a = $("<div>")
              .addClass("nav__mobile-menu-wrapper")
              .attr("data-sh-state", "temp")),
            t.children().wrapAll(a),
            t.addClass(i).attr("data-sh-state", "open"),
            n.children().each(function () {
              $(this).addClass(i),
                $(this)
                  .children()
                  .each(function () {
                    $(this).addClass(i);
                  });
            }),
            (s = !0))
          : !0 === s
          ? ($('[data-app="custom-banner"]').css("display", "flex"),
            $('[data-sh-state="temp"]').children().unwrap(),
            t.removeClass(i).attr("data-sh-state", "closed"),
            n.children().each(function () {
              $(this).removeClass(i),
                $(this)
                  .children()
                  .each(function () {
                    $(this).removeClass(i);
                  });
            }),
            (s = !1))
          : void 0
      );
    }
    function h() {
      if (!1 !== r)
        return (
          $(".dropdown--open").each(function () {
            $(this).removeClass(n);
          }),
          (r = !1)
        );
    }
    function f(e) {
      var a = e.attr("data-tab-group");
      if (p()) {
        if (1 === d)
          return (
            $(a).each(function () {
              $(this).addClass(o);
            }),
            $(`.nav__dropdown-tab[data-tab-group=${a}]`).addClass(o),
            e
              .closest(".nav__dropdown-list-wrapper.type-two")
              .find(".nav__dropdown-content-left.type-two")
              .addClass(o),
            e
              .closest(".nav__dropdown-list-wrapper.type-two")
              .find(".nav__dropdown-content-right.type-two")
              .addClass(o),
            (l = !0),
            void (d = 2)
          );
        if (2 === d)
          return (
            $("." + o).each(function () {
              $(this).removeClass(o);
            }),
            (l = !1),
            void (d = 1)
          );
      }
      $("." + o).each(function () {
        $(this).removeClass(o);
      }),
        $(a).each(function () {
          $(this).toggleClass(o);
        }),
        $(`.nav__dropdown-tab[data-tab-group=${a}]`).toggleClass(o),
        e
          .closest(".nav__dropdown-list-wrapper.type-two")
          .find(".nav__dropdown-content-left.type-two")
          .toggleClass(o),
        e
          .closest(".nav__dropdown-list-wrapper.type-two")
          .find(".nav__dropdown-content-right.type-two")
          .toggleClass(o);
    }
    $("body").append($("<div>").attr("id", "userAgent")),
      p(),
      a,
      $(".nav__dropdown").each(function (e, a) {
        $(this).attr("data-sh-index", e);
      }),
      $(".nav__dropdown-tab").each(function (e, a) {
        $(this).attr("data-sh-dropdown-nested", e);
      }),
      $(".nav__dropdown-tab-link").each(function (e, a) {
        $(this).attr("data-sh-index", e);
      }),
      (jQuery.event.special.touchstart = {
        setup: function (e, a, n) {
          this.addEventListener("touchstart", n, {
            passive: !a.includes("noPreventDefault"),
          });
        },
      }),
      (jQuery.event.special.touchend = {
        setup: function (e, a, n) {
          this.addEventListener("touchend", n, {
            passive: !a.includes("noPreventDefault"),
          });
        },
      }),
      $(".nav__link").on("click", function () {
        var e = $(this).closest(".nav__dropdown"),
          a =
            ($('[data-sh-state="current"]').each(function () {
              $(this).removeAttr("data-sh-state");
            }),
            e.attr("data-sh-index"));
        if (($(`[data-sh-dropdown="${a}"]`).attr("data-sh-dropdown"), !1 === r))
          (p()
            ? ($('[data-sh-index="0"]').find(".nav__dropdown-list").addClass(n),
              $(`[data-sh-dropdown="${a}"]`).addClass(n),
              $(".nav__logo-wrapper").addClass(n),
              $(".nav__tab-back"))
            : e.find(".nav__dropdown-list")
          ).addClass(n),
            e.attr("data-sh-state", "current"),
            $(".nav__column").each(function () {
              $(this).addClass(n);
            }),
            (r = !0);
        else if (!0 === r)
          $(".nav__column").each(function () {
            $(this).removeClass(n);
          }),
            (p()
              ? ($('[data-sh-index="0"]')
                  .find(".nav__dropdown-list")
                  .removeClass(n),
                $(`[data-sh-dropdown="${a}"]`).removeClass(n),
                $(".nav__logo-wrapper").removeClass(n),
                $(".nav__tab-back"))
              : e.find(".nav__dropdown-list")
            ).removeClass(n),
            e.find(".nav__dropdown-list").removeClass(n),
            (r = !1);
      }),
      $(".nav__dropdown-tab-link").on("click", function () {
        var e;
        !1 === p()
          ? console.log("Click denied")
          : ((e = $(this)), (r = !0), f(e));
      }),
      $(".nav__dropdown-tab").on("touchstart", function (e) {
        u(e, f);
      }),
      $(".nav__menu").on("touchstart", function (e) {
        2 !== d && u(e, h);
      }),
      $(".nav__tab-back").on("click", function () {
        var e = $(this);
        2 === d ? f(e) : r && h();
      }),
      $('[data-sh-action="trigger-nav"]').on("click", _),
      $(".nav__dropdown-tab-link").hover(function (e) {
        var a;
        p() ||
          ((a = $(this).attr("data-tab-group")),
          c !== a &&
            (f($(this)),
            (c = $(this).attr("data-tab-group")),
            $(this)
              .children()
              .each(function () {
                $(this).toggleClass(o);
              })));
      }),
      p() &&
        ((e = $("[data-sh-dropdown]")),
        $('[data-sh-mount="mainDropdown"]').append(e));
  })();
try {
  let e = document.querySelector("#footer-year");
  e.innerHTML = new Date().getFullYear();
} catch (e) {}
$(document).ready(function () {
  function e() {
    991 < $(window).width()
      ? $('[data-trigger="open"]').addClass("tab--open")
      : $('[data-trigger="open"]').removeClass("tab--open");
  }
  e(),
    $(window).resize(function () {
      e();
    });
}),
  $(document).ready(function () {
    {
      var [{ navSelector: e, subnavSelector: l, distanceThreshold: d = 75 }] = [
        {
          navSelector: "[data-item='navigation']",
          subnavSelector: "[data-item='subnav']",
        },
      ];
      let i = $(e),
        r = $(l);
      if (0 !== r.length) {
        let a = 0;
        (e = i.css("position")), (l = r.css("padding-top"));
        let n = { nav: { position: "static" }, subnav: { "padding-top": "0" } },
          t = { nav: { position: e }, subnav: { "padding-top": l } },
          o = !1;
        $(window).on("scroll", function () {
          var e = $(window).scrollTop();
          0 === e
            ? (i.css(t.nav), r.css(t.subnav))
            : o ||
              Math.abs(a - e) < d ||
              ((o = !0),
              e > a
                ? (i.css(n.nav), r.css(n.subnav))
                : e < a && (i.css(t.nav), r.css(t.subnav)),
              (a = e),
              setTimeout(function () {
                o = !1;
              }, 500));
        });
      }
    }
  });
let urlSearchParams = new URLSearchParams(window.location.search),
  tagAffiliate = urlSearchParams.get("afiliant") || "",
  shoperAffiliate;
var currentData, timeStamp, expirationDate, referer;
if (
  (tagAffiliate &&
    ((timeStamp =
      (currentData = new Date()).getTime() +
      Math.abs(60 * currentData.getTimezoneOffset() * 1e3)),
    (referer = document.referrer),
    (shoperAffiliate = {
      tag: tagAffiliate,
      expirationDate: (expirationDate = timeStamp + 2592e6),
      timeStamp: timeStamp,
    }),
    referer && (shoperAffiliate.referer = referer),
    (shoperAffiliate = btoa(JSON.stringify(shoperAffiliate))),
    localStorage.setItem("shoper_affiliate", shoperAffiliate)),
  (shoperAffiliate = localStorage.getItem("shoper_affiliate")))
) {
  let e = JSON.parse(atob(shoperAffiliate));
  if (e.expirationDate < Date.now())
    localStorage.removeItem("shoper_affiliate");
  else {
    let e = document.querySelectorAll("#create_trial_step1");
    e.forEach((e, a) => {
      e.setAttribute("data-affiliant", shoperAffiliate);
    });
  }
}
let PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "adgroup",
    "utm_term",
  ],
  VALUE_TRACK_KEY = "adwords",
  NINETY_DAYS_MS = 7776e6;
function getQueryParams() {
  let a = new URLSearchParams(window.location.search),
    n = {};
  return (
    PARAMS.forEach((e) => {
      a.has(e) && (n[e] = a.get(e));
    }),
    n
  );
}
function storeParams(e) {
  e = { ...e, timestamp: new Date().getTime() };
  localStorage.setItem(VALUE_TRACK_KEY, JSON.stringify(e));
}
function checkExpiry() {
  var e,
    a = localStorage.getItem(VALUE_TRACK_KEY);
  a &&
    ((e = JSON.parse(a)),
    new Date().getTime() - e.timestamp > NINETY_DAYS_MS
      ? localStorage.removeItem(VALUE_TRACK_KEY)
      : setHiddenInputs(a));
}
function setHiddenInputs(t) {
  for (let n in (t = JSON.parse(t)))
    t.hasOwnProperty(n) &&
      PARAMS.includes(n) &&
      document.querySelectorAll("form").forEach(function (e, a) {
        e.insertAdjacentHTML(
          "beforeend",
          `<input data-name="${VALUE_TRACK_KEY}[${n}]" type="hidden" name="${VALUE_TRACK_KEY}[${n}]" value="${t[n]}"/>`
        );
      });
}
window.addEventListener("DOMContentLoaded", () => {
  var e = getQueryParams();
  0 < Object.keys(e).length && storeParams(e), checkExpiry();
});
