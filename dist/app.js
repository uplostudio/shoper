class Accordion {
  speed = 400;
  oneOpen = false;
  accordionId = "";
  style = false;

  constructor(_settings) {
    this.accordionId = _settings.accordionId;
    this.style = _settings.style;
    this.oneOpen = _settings.oneOpen;
  }

  create() {
    let self = this;
    let $accordion = $(`#${this.accordionId} .js-accordion`);
    let $accordion_header = $accordion.find(`.js-accordion-header`);
    let $accordion_item = $(`#${this.accordionId} .js-accordion-item`);

    $accordion_header.each((i, el) => {
      $(el).attr("data-sh-bind", i);
    });

    $(`#${this.accordionId} .accordion__image`).each((i, el) => {
      $(el).attr("data-sh-bind", i);
    });

    $accordion_header.on("click", function (event) {
      let $this = $(event.currentTarget);
      let boundGroup = $this.attr("data-sh-bind");
      if (
        self.oneOpen &&
        $this[0] !=
          $this
            .closest(`.js-accordion`)
            .find("> .js-accordion-item.active > .js-accordion-header")[0]
      ) {
        $this
          .closest(`.js-accordion`)
          .find("> .js-accordion-item")
          .removeClass("active")
          .find(".js-accordion-body")
          .slideUp();
      }

      // show/hide the clicked accordion item and image
      $(`#${self.accordionId} img[data-sh-bind]`).each((i, el) => {
        let group = $(el).attr("data-sh-bind");
        if (group === boundGroup) {
          $(el).addClass("active");
        } else {
          $(el).removeClass("active");
        }
      });
      $this.closest(`.js-accordion-item`).toggleClass("active");
      $this.next().stop().slideToggle(self.speed);
    });

    if (this.style === true) {
      $accordion_item.on("click", function () {
        $(".transparent-border").removeClass("transparent-border");
        $(this).prev().addClass("transparent-border");
      });
    }

    // ensure only one accordion is active if oneOpen is true
    if (
      this.oneOpen &&
      $(`#${this.accordionId} .js-accordion-item.active`).length > 1
    ) {
      $(
        `#${this.accordionId} .js-accordion-item.active:not(:first)`
      ).removeClass("active");
    }

    // reveal the active accordion bodies
    $(`#${this.accordionId} .js-accordion-item.active`)
      .find("> .js-accordion-body")
      .show();
  }
}

let lineAnimationTime = 1000;
if (window.location.pathname === "/webflow-development-landing") {
  lineAnimationTime = 2500;
}
setTimeout(() => {
  $("#line-load-animate").addClass("animate");
}, lineAnimationTime);

// overflow hidden when nav is open
$(".nav__burger-inner").on("click", function () {
  $("body").toggleClass("overflow-hidden");
});

//close modal
$(".modal__close, .modal__close-area").on("click", function () {
  $(".modal--open").removeClass("modal--open");
  $(document.body).css("overflow", "auto");
  isFromBanner = false;
});
$(".show-in-editor").each(function () {
  $(this).removeClass("show-in-editor");
});

// since sticky doesn't show on all subpages let's play try&catch for any errors
try {
  // get the sticky element
  const stickyElm = document.querySelector(".nav-secondary");

  const observer = new IntersectionObserver(
    ([e]) =>
      e.target.classList.toggle("is-pinned", e.boundingClientRect.top < 0),
    { threshold: [1] }
  );

  observer.observe(stickyElm);
} catch (err) {
  // do nothing - don't show error if element is not found
}

//recalculate available space on mobile
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);

// We listen to the resize event
window.addEventListener("resize", () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

//line animation when scrolled into view
function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return elemBottom <= docViewBottom && elemTop >= docViewTop;
}

$(window).scroll(function () {
  $(".is-in-view").each(function () {
    setTimeout(() => {
      if (isScrolledIntoView(this) === true) {
        $(this).addClass("animate");
      }
    }, 2000);
  });
});

// Custom banner & custom modal
try {
  let customBanner = document.querySelector("[app='custom_banner']");

  customBanner.addEventListener("click", () => {
    let customModal = document.querySelector("[app='bannerModal']");
    customModal.classList.add("modal--open");
    $(document.body).css("overflow", "hidden");
  });
} catch (err) {}
//  grab form
formWrapper = document.querySelector("[app='custom_form']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='bcm-submit']");
// grab all input fields from form without checkboxes
phoneInput = formWrapper.querySelector("[app='phone_campaign']");
emailInput = formWrapper.querySelector("[app='email_campaign']");

// Attach EventListeners to inputs

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

phoneInput.addEventListener("blur", function () {
  checkPhoneBlur();
});

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  checkEmailBlur();
  checkPhoneBlur();

  if (checkEmailBlur() && checkPhoneBlur()) {
    $.ajax({
      url: "https://www.shoper.pl/ajax.php",
      headers: {},
      method: "POST",
      data: {
        action: "bcm22-2",
        subject: "Gotowy sklep i konsultacja Shoper",
        send: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS9iMGs3cnBxLw==",
        phone: phoneInputValue,
        email: emailValue,
      },
      success: function (data) {
        formWrapper.querySelector("form").style.display = "none";
        formWrapper.parentElement.querySelector(".w-form-done").style.display =
          "block";
        formWrapper.querySelector("form").reset();
      },
      error: function (data) {
        formWrapper.parentElement.querySelector(".w-form-fail").style.display =
          "block";
        formWrapper.parentElement.querySelector(".w-form-fail").textContent =
          "Coś poszło nie tak, spróbuj ponownie.";
      },
    });
  } else {
  }
});

$("[app='open_consultation_modal_button']").on("click", function () {
  $("[app='campaign_modal']").addClass("modal--open");
});

//  grab form
formWrappers = document.querySelectorAll("[app='campaign']");
// grab form trigger

formWrappers.forEach((n) => {
  phoneInput = n.querySelector("[app='phone_campaign']");
  emailInput = n.querySelector("[app='email_campaign']");
  urlInput = n.querySelector("[app='url_campaign']");
  formTrigger = n.querySelector("[app='consult-submit']");
  let action = n.getAttribute("action");

  phoneInput.addEventListener("blur", checkPhoneBlurTwo);

  emailInput.addEventListener("blur", checkMailBlurTwo);

  urlInput.addEventListener("blur", checkUrlBlurTwoNonRequired);

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    formWrapper = this.form;
    phoneInput = formWrapper.querySelector("[app='phone_campaign']");
    emailInput = formWrapper.querySelector("[app='email_campaign']");
    urlInput = formWrapper.querySelector("[app='url_campaign']");

    checkUrlBlurNonRequired();
    checkPhoneBlur();
    checkEmailBlur();

    if (outcomeOne && outcomeTwo && outcomeThree) {
      if (window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "Button modal form sent",
          eventAction: formTrigger.value,
          eventLabel: window.location.pathname,
        };

        dataLayer.push(data);
      }
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: action,
          email: emailValue,
          phone: phoneInputValue,
          url: urlValue,
          thulium_id: this.closest("form").getAttribute("thulium_id"),
          zapier: this.closest("form").getAttribute("zapier"),
        },
        success: function (data) {
          // notification attribute goes in ms ads form

          if (data.status === 1 && formWrapper.parentElement.hasAttribute("notification")) {
            n.parentElement.querySelector(".w-form-fail").style.background = "#4faf3f";
            n.parentElement.querySelector(".w-form-fail").style.display = "block";
            n.parentElement.querySelector(".w-form-fail").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            n.querySelector("form").reset();
          } else {
            n.querySelector("form").style.display = "none";
            n.parentElement.querySelector(".w-form-done").style.display = "block";
            n.parentElement.querySelector(".w-form-done").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            n.querySelector("form").reset();
          }
        },
        error: function () {
          n.parentElement.querySelector(".w-form-fail").style.display = "block";
          n.parentElement.querySelector(".w-form-fail").style.background = "#ff2c00";
        },
      });
    } else {
      if (window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "Button modal form error",
          eventAction: formTrigger.value,
          eventLabel: window.location.pathname,
        };

        dataLayer.push(data);
      }
    }
  });
});

//  grab form
formWrapper = document.querySelector("[app='send_contact']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='submit-contact']");
// grab all input fields from form without checkboxes
firstNameInput = formWrapper.querySelector("[app='name_contact']");
phoneInput = formWrapper.querySelector("[app='phone_contact']");
emailInput = formWrapper.querySelector("[app='email_contact']");
urlInput = formWrapper.querySelector("[app='url_contact']");
textArea = formWrapper.querySelector("[app='body_contact']");
let subjectInput = formWrapper.querySelector("[app='subject_contact']");
let subjectValue = subjectInput.value;
let successInfo = formWrapper.querySelector(".w-form-done");
let errorInfo = formWrapper.querySelector(".w-form-fail");

// Attach EventListeners to inputs

firstNameInput.addEventListener("blur", function () {
  checkFirstNameBlur();
});

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

phoneInput.addEventListener("blur", function () {
  checkPhoneBlur();
});

textArea.addEventListener("blur", function () {
  checkTextAreaBlur();
});

urlInput.addEventListener("blur", function () {
  checkUrlBlurRegex();
});

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  checkFirstNameBlur();
  checkEmailBlur();
  checkPhoneBlur();
  checkTextAreaBlur();
  checkUrlBlurRegex();

  if (
    checkFirstNameBlur() &&
    checkEmailBlur() &&
    checkPhoneBlur() &&
    checkTextAreaBlur() &&
    checkUrlBlurRegex()
  ) {
    $.ajax({
      url: "https://www.shoper.pl/ajax.php",
      headers: {},
      method: "POST",
      data: {
        action: "send_contact",
        name: firstNameValue,
        phone: phoneInputValue,
        email: emailValue,
        url: urlValue,
        subject: subjectValue,
        body: textArea.value,
      },
      success: function (data) {
        if (data.status === 1) {
          formWrapper.querySelector("form").style.display = "none";
          formWrapper.parentElement.querySelector(
            ".w-form-done"
          ).style.display = "block";
          formWrapper.querySelector("form").reset();
        } else {
          formWrapper.parentElement.querySelector(
            ".w-form-fail"
          ).style.display = "block";
        }
      },
      error: function (data) {},
    });
  } else {
  }
});

//  grab form
formWrapper = document.querySelector("[app='booste_form']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='booste_submit']");
// grab all input fields from form without checkboxes
firstNameInput = formWrapper.querySelector("[app='firstName']");
lastNameInput = formWrapper.querySelector("[app='lastName']");
emailInput = formWrapper.querySelector("[app='email']");
urlInput = formWrapper.querySelector("[app='url']");

// Attach EventListeners to inputs

firstNameInput.addEventListener("blur", function () {
  checkFirstNameBlur();
});

lastNameInput.addEventListener("blur", function () {
  checkLastNameBlur();
});

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

urlInput.addEventListener("blur", function () {
  checkUrlBlur();
});

// Attach EventListener to submit button

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  checkFirstNameBlur();
  checkLastNameBlur();
  checkEmailBlur();
  checkUrlBlur();

  let shoperTermsEmail = formWrapper.querySelector(
    "[name='shoper_terms_email']"
  );
  let shoperTermsSms = formWrapper.querySelector("[name='shoper_terms_sms']");
  let shoperTermsTel = formWrapper.querySelector("[name='shoper_terms_tel']");
  let acceptAgree = formWrapper.querySelector("[name='accept_agree']");
  let boosteTermsEmail = formWrapper.querySelector(
    "[name='booste_terms_email']"
  );
  let boosteTermsSms = formWrapper.querySelector("[name='booste_terms_sms']");
  let boosteTermsTel = formWrapper.querySelector("[name='booste_terms_tel']");

  if (!acceptAgree.checked) {
    acceptAgree.parentElement.children[0].style.border = errorBorderColor;
    acceptAgree.parentElement.parentElement.nextElementSibling.style.display =
      "flex";
  } else {
    acceptAgree.parentElement.children[0].style.border = initialBorderColor;
    acceptAgree.parentElement.parentElement.nextElementSibling.style.display =
      "none";
  }

  if (shoperTermsEmail.checked) {
    shoperTermsEmail.value = 1;
  } else {
    shoperTermsEmail.value = "";
  }

  if (shoperTermsSms.checked) {
    shoperTermsSms.value = 1;
  } else {
    shoperTermsSms.value = "";
  }

  if (shoperTermsTel.checked) {
    shoperTermsTel.value = 1;
  } else {
    shoperTermsTel.value = "";
  }

  if (boosteTermsEmail.checked) {
    boosteTermsEmail.value = 1;
  } else {
    boosteTermsEmail.value = "";
  }

  if (boosteTermsSms.checked) {
    boosteTermsSms.value = 1;
  } else {
    boosteTermsSms.value = "";
  }

  if (boosteTermsTel.checked) {
    boosteTermsTel.value = 1;
  } else {
    boosteTermsTel.value = "";
  }

  const body = new FormData();
  body.append("firstname", firstNameValue);
  body.append("lastname", lastNameValue);
  body.append("email", emailValue);
  body.append("website", urlValue);
  body.append("shoper_terms_email", shoperTermsEmail.value);
  body.append("shoper_terms_sms", shoperTermsSms.value);
  body.append("shoper_terms_tel", shoperTermsTel.value);
  body.append("booste_terms_email", boosteTermsEmail.value);
  body.append("booste_terms_sms", boosteTermsSms.value);
  body.append("booste_terms_tel", boosteTermsTel.value);
  body.append("accept_agree", "1");
  body.append("country", "PL");
  body.append("referer_url", "https://shoper.pl/finansowanie/booste");

  if (
    checkFirstNameBlur() &&
    checkLastNameBlur() &&
    checkEmailBlur() &&
    checkUrlBlur() &&
    acceptAgree.checked
  ) {
    fetch(`https://hooks.zapier.com/hooks/catch/492789/bke9mgj/`, {
      body: body,
      action: "https://app.booste.com/sign-up",
      headers: {
        Accept: "*/*",
      },
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        let status = data.status;
        if (status === "success") {
          formWrapper.querySelector("form").reset();
          window.location.href = `https://app.booste.com/sign-up?firstname=${firstNameValue}&lastname=${lastNameValue}&email=${emailValue}&website=${urlValue}`;
        } else {
          formWrapper.querySelector("form").style.display = "none";
          formWrapper.querySelector(".w-form-fail").style.display = "block";
        }
      });
  }
});

//  grab form
formWrapper = document.querySelector("[app='brutto_form']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='brutto_submit']");
// grab all input fields from form without checkboxes
nipInput = formWrapper.querySelector("[app='nipNumber']");
phoneInput = formWrapper.querySelector("[app='phone']");
emailInput = formWrapper.querySelector("[app='email']");
urlInput = formWrapper.querySelector("[app='url']");

// Attach EventListeners to inputs

nipInput.addEventListener("blur", function () {
  checkNipBlur();
});

phoneInput.addEventListener("blur", function () {
  checkPhoneBlur();
});

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

urlInput.addEventListener("blur", function () {
  checkUrlBlur();
});

formWrapper.setAttribute("action", "loan_decision_contact");

// Attach EventListener to submit button

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  checkNipBlur();
  checkPhoneBlur();
  checkEmailBlur();
  checkUrlBlur();

  let bruttoTerms = formWrapper.querySelector("[name='brutto_terms']");
  let bruttoClause = formWrapper.querySelector("[name='brutto_info_clause']");
  let shoperPersonalData = formWrapper.querySelector("[name='shoper_personal_data']");

  if (!bruttoTerms.checked) {
    bruttoTerms.previousElementSibling.style.border = errorBorderColor;
    bruttoTerms.parentNode.nextElementSibling.style.display = "flex";
    bruttoTerms.value = 0;
  } else {
    bruttoTerms.previousElementSibling.style.border = initialBorderColor;
    bruttoTerms.parentNode.nextElementSibling.style.display = "none";
    bruttoTerms.value = 1;
  }
  if (!bruttoClause.checked) {
    bruttoClause.previousElementSibling.style.border = errorBorderColor;
    bruttoClause.parentNode.nextElementSibling.style.display = "flex";
    bruttoClause.value = 0;
  } else {
    bruttoClause.previousElementSibling.style.border = initialBorderColor;
    bruttoClause.parentNode.nextElementSibling.style.display = "none";
    bruttoClause.value = 1;
  }
  if (!shoperPersonalData.checked) {
    shoperPersonalData.previousElementSibling.style.border = errorBorderColor;
    shoperPersonalData.parentNode.nextElementSibling.style.display = "flex";
    shoperPersonalData.value = 0;
  } else {
    shoperPersonalData.previousElementSibling.style.border = initialBorderColor;
    shoperPersonalData.parentNode.nextElementSibling.style.display = "none";
    shoperPersonalData.value = 1;
  }

  const body = new FormData();
  body.append("nip", nipValue);
  body.append("url", urlValue);
  body.append("phone", phoneInputValue);
  body.append("email", emailValue);
  body.append("brutto_terms", bruttoTerms.value);
  body.append("brutto_info_clause", bruttoClause.value);
  body.append("shoper_personal_data", shoperPersonalData.value);
  body.append("action", formWrapper.getAttribute("action"));

  if (checkNipBlur() && checkPhoneBlur() && checkEmailBlur() && checkUrlBlur() && bruttoTerms.checked && bruttoClause.checked && shoperPersonalData.checked) {
    fetch(`https://www.shoper.pl/ajax.php`, {
      body,
      headers: {
        Accept: "*/*",
      },
      method: "POST",
    }).then(function (response) {
      formWrapper.querySelector("form").style.display = "none";
      formWrapper.querySelector(".w-form-done").style.display = "block";
    });
  } else {
  }
});

window.addEventListener("load", () => {
  let bruttoForm = document.querySelector("#wf-form-brutto-form");
  var slider = document.getElementById("brutto_slider");
  let totalCost = document.querySelector("[app='total_cost']");
  let repaymentAmmount = document.querySelector("[app='repayment_amount']");
  let monthlyCost = document.querySelector("[app='monthly_cost']");
  let rrso = document.querySelector("[app='annual_percentage_rate_of_charge']");
  let installmentRadios = document.querySelectorAll(
    "input[name='installment_amount']"
  );
  let manualInput = document.querySelector("input[name='manual-input']");
  let amountValue = 5000;
  installmentRadios[4].checked = true;

  bruttoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  noUiSlider.create(slider, {
    start: [5000],
    connect: true,
    step: 500,
    format: {
      to: (v) => v | 0,
      from: (v) => v | 0,
    },
    range: {
      min: 5000,
      max: 50000,
    },
  });

  let stepSliderValueElement = document.getElementById("slider-step-value");

  slider.noUiSlider.on("update", function (values, handle) {
    stepSliderValueElement.innerHTML = `${values[handle]} zł`;
    manualInput.value = values[handle];
    amountValue = values[handle];
    let installmentPeriod = document.querySelector(
      'input[name="installment_amount"]:checked'
    ).value;

    fetch(
      `https://www.brutto.pl/api/v3/simulation/purchase?partner=e8694f3a-45fe-5fa6-bb74-ccc1e8f16d32&currency=PLN&amount=${amountValue}`,
      {
        headers: {
          Accept: "*/*",
        },
        method: "GET",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data)
        let obj = data.purchase_simulation.results;
        let picked = Object.fromEntries(
          Object.entries(obj).filter(([key]) =>
            key.includes(`${installmentPeriod}`)
          )
        );
        let pickedByPeriod = picked[`${installmentPeriod}`];
        let roundedTotalCost = Math.round(pickedByPeriod.total_cost);
        let roundedRepaymentAmount = Math.round(
          pickedByPeriod.repayment_amount
        );
        let roundedMonthlyCost = Math.round(pickedByPeriod.monthly_cost);
        let rrsoVal = pickedByPeriod.annual_percentage_rate_of_charge;

        totalCost.innerHTML = `${roundedTotalCost} zł`;
        repaymentAmmount.innerHTML = `${roundedRepaymentAmount} zł`;
        monthlyCost.innerHTML = `${roundedMonthlyCost} zł`;
        rrso.innerHTML = `${rrsoVal} %`;
      });
  });

  bruttoForm.addEventListener("change", () => {
    try {
      let installmentPeriod = document.querySelector(
        'input[name="installment_amount"]:checked'
      ).value;
      fetch(
        `https://www.brutto.pl/api/v3/simulation/purchase?partner=e8694f3a-45fe-5fa6-bb74-ccc1e8f16d32&currency=PLN&amount=${amountValue}`,
        {
          headers: {
            Accept: "*/*",
          },
          method: "GET",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let obj = data.purchase_simulation.results;
          let picked = Object.fromEntries(
            Object.entries(obj).filter(([key]) =>
              key.includes(`${installmentPeriod}`)
            )
          );
          let pickedByPeriod = picked[`${installmentPeriod}`];
          let roundedTotalCost = Math.round(pickedByPeriod.total_cost);
          let roundedRepaymentAmount = Math.round(
            pickedByPeriod.repayment_amount
          );
          let roundedMonthlyCost = Math.round(pickedByPeriod.monthly_cost);
          let rrsoVal = pickedByPeriod.annual_percentage_rate_of_charge;

          totalCost.innerHTML = `${roundedTotalCost} zł`;
          repaymentAmmount.innerHTML = `${roundedRepaymentAmount} zł`;
          monthlyCost.innerHTML = `${roundedMonthlyCost} zł`;
          rrso.innerHTML = `${rrsoVal} %`;
        });
    } catch (err) {}
  });

  manualInput.addEventListener("change", (e) => {
    if (manualInput.value < 5000 || manualInput.value > 50000) {
      manualInput.nextElementSibling.style.display = "flex";
    } else {
      manualInput.nextElementSibling.style.display = "none";
    }
    slider.noUiSlider.set(manualInput.value);
    stepSliderValueElement.innerHTML = `${manualInput.value} zł`;
    try {
      let installmentPeriod = document.querySelector(
        'input[name="installment_amount"]:checked'
      ).value;

      fetch(
        `https://www.brutto.pl/api/v3/simulation/purchase?partner=e8694f3a-45fe-5fa6-bb74-ccc1e8f16d32&currency=PLN&amount=${amountValue}`,
        {
          headers: {
            Accept: "*/*",
          },
          method: "GET",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let obj = data.purchase_simulation.results;
          let picked = Object.fromEntries(
            Object.entries(obj).filter(([key]) =>
              key.includes(`${installmentPeriod}`)
            )
          );
          let pickedByPeriod = picked[`${installmentPeriod}`];

          let roundedTotalCost = Math.round(pickedByPeriod.total_cost);
          let roundedRepaymentAmount = Math.round(
            pickedByPeriod.repayment_amount
          );
          let roundedMonthlyCost = Math.round(pickedByPeriod.monthly_cost);
          let rrsoVal = pickedByPeriod.annual_percentage_rate_of_charge;

          totalCost.innerHTML = `${roundedTotalCost} zł`;
          repaymentAmmount.innerHTML = `${roundedRepaymentAmount} zł`;
          monthlyCost.innerHTML = `${roundedMonthlyCost} zł`;
          rrso.innerHTML = `${rrsoVal} %`;
        });
    } catch (err) {}
  });

  function checkLowest() {
    if (manualInput.value < 5000 || manualInput.value > 50000) {
      manualInput.nextElementSibling.style.display = "flex";
    } else {
      manualInput.nextElementSibling.style.display = "none";
    }
  }

  setInterval(checkLowest, 100);
});

let countrySelect = document.querySelector("#country");

let monthlyIncomeInputForCheck = document.querySelector("[multi='monthly_euro_income']");

monthlyIncomeInputForCheck.addEventListener("change", function () {
  if (monthlyIncomeInputForCheck.value === "30") {
    this.nextElementSibling.style.display = "flex";
  } else {
    this.nextElementSibling.style.display = "none";
  }
});

let countriesList = [
  {
    name_pl: "Polska",
    name_en: "Poland",
    code: "PL",
  },
  {
    name_pl: "Afganistan",
    name_en: "Afghanistan",
    code: "AF",
  },
  {
    name_pl: "Albania",
    name_en: "Albania",
    code: "AL",
  },
  {
    name_pl: "Algieria",
    name_en: "Algeria",
    code: "DZ",
  },
  {
    name_pl: "Andora",
    name_en: "Andorra",
    code: "AD",
  },
  {
    name_pl: "Angola",
    name_en: "Angola",
    code: "AO",
  },
  {
    name_pl: "Anguilla",
    name_en: "Anguilla",
    code: "AI",
  },
  {
    name_pl: "Antarktyka",
    name_en: "Antarctica",
    code: "AQ",
  },
  {
    name_pl: "Antigua i Barbuda",
    name_en: "Antigua and Barbuda",
    code: "AG",
  },
  {
    name_pl: "Arabia Saudyjska",
    name_en: "Saudi Arabia",
    code: "SA",
  },
  {
    name_pl: "Argentyna",
    name_en: "Argentina",
    code: "AR",
  },
  {
    name_pl: "Armenia",
    name_en: "Armenia",
    code: "AM",
  },
  {
    name_pl: "Aruba",
    name_en: "Aruba",
    code: "AW",
  },
  {
    name_pl: "Australia",
    name_en: "Australia",
    code: "AU",
  },
  {
    name_pl: "Austria",
    name_en: "Austria",
    code: "AT",
  },
  {
    name_pl: "Azerbejdżan",
    name_en: "Azerbaijan",
    code: "AZ",
  },
  {
    name_pl: "Bahamy",
    name_en: "Bahamas",
    code: "BS",
  },
  {
    name_pl: "Bahrajn",
    name_en: "Bahrain",
    code: "BH",
  },
  {
    name_pl: "Bangladesz",
    name_en: "Bangladesh",
    code: "BD",
  },
  {
    name_pl: "Barbados",
    name_en: "Barbados",
    code: "BB",
  },
  {
    name_pl: "Belgia",
    name_en: "Belgium",
    code: "BE",
  },
  {
    name_pl: "Belize",
    name_en: "Belize",
    code: "BZ",
  },
  {
    name_pl: "Benin",
    name_en: "Benin",
    code: "BJ",
  },
  {
    name_pl: "Bermudy",
    name_en: "Bermuda",
    code: "BM",
  },
  {
    name_pl: "Bhutan",
    name_en: "Bhutan",
    code: "BT",
  },
  {
    name_pl: "Białoruś",
    name_en: "Belarus",
    code: "BY",
  },
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
  {
    name_pl: "Botswana",
    name_en: "Botswana",
    code: "BW",
  },
  {
    name_pl: "Brazylia",
    name_en: "Brazil",
    code: "BR",
  },
  {
    name_pl: "Brunei",
    name_en: "Brunei Darussalam",
    code: "BN",
  },
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
  {
    name_pl: "Bułgaria",
    name_en: "Bulgaria",
    code: "BG",
  },
  {
    name_pl: "Burkina Faso",
    name_en: "Burkina Faso",
    code: "BF",
  },
  {
    name_pl: "Burundi",
    name_en: "Burundi",
    code: "BI",
  },
  {
    name_pl: "Chile",
    name_en: "Chile",
    code: "CL",
  },
  {
    name_pl: "Chiny",
    name_en: "China",
    code: "CN",
  },
  {
    name_pl: "Chorwacja",
    name_en: "Croatia",
    code: "HR",
  },
  {
    name_pl: "Curaçao",
    name_en: "Curaçao",
    code: "CW",
  },
  {
    name_pl: "Cypr",
    name_en: "Cyprus",
    code: "CY",
  },
  {
    name_pl: "Czad",
    name_en: "Chad",
    code: "TD",
  },
  {
    name_pl: "Czarnogóra",
    name_en: "Montenegro",
    code: "ME",
  },
  {
    name_pl: "Czechy",
    name_en: "Czech Republic",
    code: "CZ",
  },
  {
    name_pl: "Dalekie Wyspy Mniejsze Stanów Zjednoczonych",
    name_en: "United States Minor Outlying Islands",
    code: "UM",
  },
  {
    name_pl: "Dania",
    name_en: "Denmark",
    code: "DK",
  },
  {
    name_pl: "Demokratyczna Republika Konga",
    name_en: "Congo, the Democratic Republic of the",
    code: "CD",
  },
  {
    name_pl: "Dominika",
    name_en: "Dominica",
    code: "DM",
  },
  {
    name_pl: "Dominikana",
    name_en: "Dominican Republic",
    code: "DO",
  },
  {
    name_pl: "Dżibuti",
    name_en: "Djibouti",
    code: "DJ",
  },
  {
    name_pl: "Egipt",
    name_en: "Egypt",
    code: "EG",
  },
  {
    name_pl: "Ekwador",
    name_en: "Ecuador",
    code: "EC",
  },
  {
    name_pl: "Erytrea",
    name_en: "Eritrea",
    code: "ER",
  },
  {
    name_pl: "Estonia",
    name_en: "Estonia",
    code: "EE",
  },
  {
    name_pl: "Etiopia",
    name_en: "Ethiopia",
    code: "ET",
  },
  {
    name_pl: "Falklandy",
    name_en: "Falkland Islands (Malvinas)",
    code: "FK",
  },
  {
    name_pl: "Fidżi",
    name_en: "Fiji",
    code: "FJ",
  },
  {
    name_pl: "Filipiny",
    name_en: "Philippines",
    code: "PH",
  },
  {
    name_pl: "Finlandia",
    name_en: "Finland",
    code: "FI",
  },
  {
    name_pl: "Francja",
    name_en: "France",
    code: "FR",
  },
  {
    name_pl: "Francuskie Terytoria Południowe i Antarktyczne",
    name_en: "French Southern Territories",
    code: "TF",
  },
  {
    name_pl: "Gabon",
    name_en: "Gabon",
    code: "GA",
  },
  {
    name_pl: "Gambia",
    name_en: "Gambia",
    code: "GM",
  },
  {
    name_pl: "Georgia Południowa i Sandwich Południowy",
    name_en: "South Georgia and the South Sandwich Islands",
    code: "GS",
  },
  {
    name_pl: "Ghana",
    name_en: "Ghana",
    code: "GH",
  },
  {
    name_pl: "Gibraltar",
    name_en: "Gibraltar",
    code: "GI",
  },
  {
    name_pl: "Grecja",
    name_en: "Greece",
    code: "GR",
  },
  {
    name_pl: "Grenada",
    name_en: "Grenada",
    code: "GD",
  },
  {
    name_pl: "Grenlandia",
    name_en: "Greenland",
    code: "GL",
  },
  {
    name_pl: "Gruzja",
    name_en: "Georgia",
    code: "GE",
  },
  {
    name_pl: "Guam",
    name_en: "Guam",
    code: "GU",
  },
  {
    name_pl: "Guernsey",
    name_en: "Guernsey",
    code: "GG",
  },
  {
    name_pl: "Gujana Francuska",
    name_en: "French Guiana",
    code: "GF",
  },
  {
    name_pl: "Gujana",
    name_en: "Guyana",
    code: "GY",
  },
  {
    name_pl: "Gwadelupa",
    name_en: "Guadeloupe",
    code: "GP",
  },
  {
    name_pl: "Gwatemala",
    name_en: "Guatemala",
    code: "GT",
  },
  {
    name_pl: "Gwinea Bissau",
    name_en: "Guinea-Bissau",
    code: "GW",
  },
  {
    name_pl: "Gwinea Równikowa",
    name_en: "Equatorial Guinea",
    code: "GQ",
  },
  {
    name_pl: "Gwinea",
    name_en: "Guinea",
    code: "GN",
  },
  {
    name_pl: "Haiti",
    name_en: "Haiti",
    code: "HT",
  },
  {
    name_pl: "Hiszpania",
    name_en: "Spain",
    code: "ES",
  },
  {
    name_pl: "Holandia",
    name_en: "Netherlands",
    code: "NL",
  },
  {
    name_pl: "Honduras",
    name_en: "Honduras",
    code: "HN",
  },
  {
    name_pl: "Hongkong",
    name_en: "Hong Kong",
    code: "HK",
  },
  {
    name_pl: "Indie",
    name_en: "India",
    code: "IN",
  },
  {
    name_pl: "Indonezja",
    name_en: "Indonesia",
    code: "ID",
  },
  {
    name_pl: "Irak",
    name_en: "Iraq",
    code: "IQ",
  },
  {
    name_pl: "Iran",
    name_en: "Iran, Islamic Republic of",
    code: "IR",
  },
  {
    name_pl: "Irlandia",
    name_en: "Ireland",
    code: "IE",
  },
  {
    name_pl: "Islandia",
    name_en: "Iceland",
    code: "IS",
  },
  {
    name_pl: "Izrael",
    name_en: "Israel",
    code: "IL",
  },
  {
    name_pl: "Jamajka",
    name_en: "Jamaica",
    code: "JM",
  },
  {
    name_pl: "Japonia",
    name_en: "Japan",
    code: "JP",
  },
  {
    name_pl: "Jemen",
    name_en: "Yemen",
    code: "YE",
  },
  {
    name_pl: "Jersey",
    name_en: "Jersey",
    code: "JE",
  },
  {
    name_pl: "Jordania",
    name_en: "Jordan",
    code: "JO",
  },
  {
    name_pl: "Kajmany",
    name_en: "Cayman Islands",
    code: "KY",
  },
  {
    name_pl: "Kambodża",
    name_en: "Cambodia",
    code: "KH",
  },
  {
    name_pl: "Kamerun",
    name_en: "Cameroon",
    code: "CM",
  },
  {
    name_pl: "Kanada",
    name_en: "Canada",
    code: "CA",
  },
  {
    name_pl: "Katar",
    name_en: "Qatar",
    code: "QA",
  },
  {
    name_pl: "Kazachstan",
    name_en: "Kazakhstan",
    code: "KZ",
  },
  {
    name_pl: "Kenia",
    name_en: "Kenya",
    code: "KE",
  },
  {
    name_pl: "Kirgistan",
    name_en: "Kyrgyzstan",
    code: "KG",
  },
  {
    name_pl: "Kiribati",
    name_en: "Kiribati",
    code: "KI",
  },
  {
    name_pl: "Kolumbia",
    name_en: "Colombia",
    code: "CO",
  },
  {
    name_pl: "Komory",
    name_en: "Comoros",
    code: "KM",
  },
  {
    name_pl: "Kongo",
    name_en: "Congo",
    code: "CG",
  },
  {
    name_pl: "Korea Południowa",
    name_en: "Korea, Republic of",
    code: "KR",
  },
  {
    name_pl: "Korea Północna",
    name_en: "Korea, Democratic People's Republic of",
    code: "KP",
  },
  {
    name_pl: "Kostaryka",
    name_en: "Costa Rica",
    code: "CR",
  },
  {
    name_pl: "Kuba",
    name_en: "Cuba",
    code: "CU",
  },
  {
    name_pl: "Kuwejt",
    name_en: "Kuwait",
    code: "KW",
  },
  {
    name_pl: "Laos",
    name_en: "Lao People's Democratic Republic",
    code: "LA",
  },
  {
    name_pl: "Lesotho",
    name_en: "Lesotho",
    code: "LS",
  },
  {
    name_pl: "Liban",
    name_en: "Lebanon",
    code: "LB",
  },
  {
    name_pl: "Liberia",
    name_en: "Liberia",
    code: "LR",
  },
  {
    name_pl: "Libia",
    name_en: "Libyan Arab Jamahiriya",
    code: "LY",
  },
  {
    name_pl: "Liechtenstein",
    name_en: "Liechtenstein",
    code: "LI",
  },
  {
    name_pl: "Litwa",
    name_en: "Lithuania",
    code: "LT",
  },
  {
    name_pl: "Luksemburg",
    name_en: "Luxembourg",
    code: "LU",
  },
  {
    name_pl: "Łotwa",
    name_en: "Latvia",
    code: "LV",
  },
  {
    name_pl: "Macedonia",
    name_en: "Macedonia, the former Yugoslav Republic of",
    code: "MK",
  },
  {
    name_pl: "Madagaskar",
    name_en: "Madagascar",
    code: "MG",
  },
  {
    name_pl: "Majotta",
    name_en: "Mayotte",
    code: "YT",
  },
  {
    name_pl: "Makau",
    name_en: "Macao",
    code: "MO",
  },
  {
    name_pl: "Malawi",
    name_en: "Malawi",
    code: "MW",
  },
  {
    name_pl: "Malediwy",
    name_en: "Maldives",
    code: "MV",
  },
  {
    name_pl: "Malezja",
    name_en: "Malaysia",
    code: "MY",
  },
  {
    name_pl: "Mali",
    name_en: "Mali",
    code: "ML",
  },
  {
    name_pl: "Malta",
    name_en: "Malta",
    code: "MT",
  },
  {
    name_pl: "Mariany Północne",
    name_en: "Northern Mariana Islands",
    code: "MP",
  },
  {
    name_pl: "Maroko",
    name_en: "Morocco",
    code: "MA",
  },
  {
    name_pl: "Martynika",
    name_en: "Martinique",
    code: "MQ",
  },
  {
    name_pl: "Mauretania",
    name_en: "Mauritania",
    code: "MR",
  },
  {
    name_pl: "Mauritius",
    name_en: "Mauritius",
    code: "MU",
  },
  {
    name_pl: "Meksyk",
    name_en: "Mexico",
    code: "MX",
  },
  {
    name_pl: "Mikronezja",
    name_en: "Micronesia, Federated States of",
    code: "FM",
  },
  {
    name_pl: "Mjanma",
    name_en: "Myanmar",
    code: "MM",
  },
  {
    name_pl: "Mołdawia",
    name_en: "Moldova, Republic of",
    code: "MD",
  },
  {
    name_pl: "Monako",
    name_en: "Monaco",
    code: "MC",
  },
  {
    name_pl: "Mongolia",
    name_en: "Mongolia",
    code: "MN",
  },
  {
    name_pl: "Montserrat",
    name_en: "Montserrat",
    code: "MS",
  },
  {
    name_pl: "Mozambik",
    name_en: "Mozambique",
    code: "MZ",
  },
  {
    name_pl: "Namibia",
    name_en: "Namibia",
    code: "NA",
  },
  {
    name_pl: "Nauru",
    name_en: "Nauru",
    code: "NR",
  },
  {
    name_pl: "Nepal",
    name_en: "Nepal",
    code: "NP",
  },
  {
    name_pl: "Niemcy",
    name_en: "Germany",
    code: "DE",
  },
  {
    name_pl: "Niger",
    name_en: "Niger",
    code: "NE",
  },
  {
    name_pl: "Nigeria",
    name_en: "Nigeria",
    code: "NG",
  },
  {
    name_pl: "Nikaragua",
    name_en: "Nicaragua",
    code: "NI",
  },
  {
    name_pl: "Niue",
    name_en: "Niue",
    code: "NU",
  },
  {
    name_pl: "Norfolk",
    name_en: "Norfolk Island",
    code: "NF",
  },
  {
    name_pl: "Norwegia",
    name_en: "Norway",
    code: "NO",
  },
  {
    name_pl: "Nowa Kaledonia",
    name_en: "New Caledonia",
    code: "NC",
  },
  {
    name_pl: "Nowa Zelandia",
    name_en: "New Zealand",
    code: "NZ",
  },
  {
    name_pl: "Oman",
    name_en: "Oman",
    code: "OM",
  },
  {
    name_pl: "Pakistan",
    name_en: "Pakistan",
    code: "PK",
  },
  {
    name_pl: "Palau",
    name_en: "Palau",
    code: "PW",
  },
  {
    name_pl: "Palestyna",
    name_en: "Palestinian Territory, Occupied",
    code: "PS",
  },
  {
    name_pl: "Panama",
    name_en: "Panama",
    code: "PA",
  },
  {
    name_pl: "Papua-Nowa Gwinea",
    name_en: "Papua New Guinea",
    code: "PG",
  },
  {
    name_pl: "Paragwaj",
    name_en: "Paraguay",
    code: "PY",
  },
  {
    name_pl: "Peru",
    name_en: "Peru",
    code: "PE",
  },
  {
    name_pl: "Pitcairn",
    name_en: "Pitcairn",
    code: "PN",
  },
  {
    name_pl: "Polinezja Francuska",
    name_en: "French Polynesia",
    code: "PF",
  },
  {
    name_pl: "Portoryko",
    name_en: "Puerto Rico",
    code: "PR",
  },
  {
    name_pl: "Portugalia",
    name_en: "Portugal",
    code: "PT",
  },
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
  {
    name_pl: "Reunion",
    name_en: "Réunion",
    code: "RE",
  },
  {
    name_pl: "Rosja",
    name_en: "Russian Federation",
    code: "RU",
  },
  {
    name_pl: "Rumunia",
    name_en: "Romania",
    code: "RO",
  },
  {
    name_pl: "Rwanda",
    name_en: "Rwanda",
    code: "RW",
  },
  {
    name_pl: "Sahara Zachodnia",
    name_en: "Western Sahara",
    code: "EH",
  },
  {
    name_pl: "Saint Kitts i Nevis",
    name_en: "Saint Kitts and Nevis",
    code: "KN",
  },
  {
    name_pl: "Saint Lucia",
    name_en: "Saint Lucia",
    code: "LC",
  },
  {
    name_pl: "Saint Vincent i Grenadyny",
    name_en: "Saint Vincent and the Grenadines",
    code: "VC",
  },
  {
    name_pl: "Saint-Barthélemy",
    name_en: "Saint Barthélemy",
    code: "BL",
  },
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
  {
    name_pl: "Salwador",
    name_en: "El Salvador",
    code: "SV",
  },
  {
    name_pl: "Samoa Amerykańskie",
    name_en: "American Samoa",
    code: "AS",
  },
  {
    name_pl: "Samoa",
    name_en: "Samoa",
    code: "WS",
  },
  {
    name_pl: "San Marino",
    name_en: "San Marino",
    code: "SM",
  },
  {
    name_pl: "Senegal",
    name_en: "Senegal",
    code: "SN",
  },
  {
    name_pl: "Serbia",
    name_en: "Serbia",
    code: "RS",
  },
  {
    name_pl: "Seszele",
    name_en: "Seychelles",
    code: "SC",
  },
  {
    name_pl: "Sierra Leone",
    name_en: "Sierra Leone",
    code: "SL",
  },
  {
    name_pl: "Singapur",
    name_en: "Singapore",
    code: "SG",
  },
  {
    name_pl: "Sint Maarten",
    name_en: "Sint Maarten (Dutch part)",
    code: "SX",
  },
  {
    name_pl: "Słowacja",
    name_en: "Slovakia",
    code: "SK",
  },
  {
    name_pl: "Słowenia",
    name_en: "Slovenia",
    code: "SI",
  },
  {
    name_pl: "Somalia",
    name_en: "Somalia",
    code: "SO",
  },
  {
    name_pl: "Sri Lanka",
    name_en: "Sri Lanka",
    code: "LK",
  },
  {
    name_pl: "Stany Zjednoczone",
    name_en: "United States",
    code: "US",
  },
  {
    name_pl: "Suazi",
    name_en: "Swaziland",
    code: "SZ",
  },
  {
    name_pl: "Sudan",
    name_en: "Sudan",
    code: "SD",
  },
  {
    name_pl: "Sudan Południowy",
    name_en: "South Sudan",
    code: "SS",
  },
  {
    name_pl: "Surinam",
    name_en: "Suriname",
    code: "SR",
  },
  {
    name_pl: "Svalbard i Jan Mayen",
    name_en: "Svalbard and Jan Mayen",
    code: "SJ",
  },
  {
    name_pl: "Syria",
    name_en: "Syrian Arab Republic",
    code: "SY",
  },
  {
    name_pl: "Szwajcaria",
    name_en: "Switzerland",
    code: "CH",
  },
  {
    name_pl: "Szwecja",
    name_en: "Sweden",
    code: "SE",
  },
  {
    name_pl: "Tadżykistan",
    name_en: "Tajikistan",
    code: "TJ",
  },
  {
    name_pl: "Tajlandia",
    name_en: "Thailand",
    code: "TH",
  },
  {
    name_pl: "Tajwan",
    name_en: "Taiwan, Province of China",
    code: "TW",
  },
  {
    name_pl: "Tanzania",
    name_en: "Tanzania, United Republic of",
    code: "TZ",
  },
  {
    name_pl: "Timor Wschodni",
    name_en: "Timor-Leste",
    code: "TL",
  },
  {
    name_pl: "Togo",
    name_en: "Togo",
    code: "TG",
  },
  {
    name_pl: "Tokelau",
    name_en: "Tokelau",
    code: "TK",
  },
  {
    name_pl: "Tonga",
    name_en: "Tonga",
    code: "TO",
  },
  {
    name_pl: "Trynidad i Tobago",
    name_en: "Trinidad and Tobago",
    code: "TT",
  },
  {
    name_pl: "Tunezja",
    name_en: "Tunisia",
    code: "TN",
  },
  {
    name_pl: "Turcja",
    name_en: "Turkey",
    code: "TR",
  },
  {
    name_pl: "Turkmenistan",
    name_en: "Turkmenistan",
    code: "TM",
  },
  {
    name_pl: "Turks i Caicos",
    name_en: "Turks and Caicos Islands",
    code: "TC",
  },
  {
    name_pl: "Tuvalu",
    name_en: "Tuvalu",
    code: "TV",
  },
  {
    name_pl: "Uganda",
    name_en: "Uganda",
    code: "UG",
  },
  {
    name_pl: "Ukraina",
    name_en: "Ukraine",
    code: "UA",
  },
  {
    name_pl: "Urugwaj",
    name_en: "Uruguay",
    code: "UY",
  },
  {
    name_pl: "Uzbekistan",
    name_en: "Uzbekistan",
    code: "UZ",
  },
  {
    name_pl: "Vanuatu",
    name_en: "Vanuatu",
    code: "VU",
  },
  {
    name_pl: "Wallis i Futuna",
    name_en: "Wallis and Futuna",
    code: "WF",
  },
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
  {
    name_pl: "Węgry",
    name_en: "Hungary",
    code: "HU",
  },
  {
    name_pl: "Wielka Brytania",
    name_en: "United Kingdom",
    code: "GB",
  },
  {
    name_pl: "Wietnam",
    name_en: "Viet Nam",
    code: "VN",
  },
  {
    name_pl: "Włochy",
    name_en: "Italy",
    code: "IT",
  },
  {
    name_pl: "Wybrzeże Kości Słoniowej",
    name_en: "Côte d'Ivoire",
    code: "CI",
  },
  {
    name_pl: "Wyspa Bouveta",
    name_en: "Bouvet Island",
    code: "BV",
  },
  {
    name_pl: "Wyspa Bożego Narodzenia",
    name_en: "Christmas Island",
    code: "CX",
  },
  {
    name_pl: "Wyspa Man",
    name_en: "Isle of Man",
    code: "IM",
  },
  {
    name_pl: "Wyspa Świętej Heleny, Wyspa Wniebowstąpienia i Tristan da Cunha",
    name_en: "Saint Helena, Ascension and Tristan Cunha",
    code: "SH",
  },
  {
    name_pl: "Wyspy Alandzkie",
    name_en: "Åland Islands",
    code: "AX",
  },
  {
    name_pl: "Wyspy Cooka",
    name_en: "Cook Islands",
    code: "CK",
  },
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
  {
    name_pl: "Wyspy Marshalla",
    name_en: "Marshall Islands",
    code: "MH",
  },
  {
    name_pl: "Wyspy Owcze",
    name_en: "Faroe Islands",
    code: "FO",
  },
  {
    name_pl: "Wyspy Salomona",
    name_en: "Solomon Islands",
    code: "SB",
  },
  {
    name_pl: "Wyspy Świętego Tomasza i Książęca",
    name_en: "Sao Tome and Principe",
    code: "ST",
  },
  {
    name_pl: "Zambia",
    name_en: "Zambia",
    code: "ZM",
  },
  {
    name_pl: "Zimbabwe",
    name_en: "Zimbabwe",
    code: "ZW",
  },
  {
    name_pl: "Zjednoczone Emiraty Arabskie",
    name_en: "United Arab Emirates",
    code: "AE",
  },
];

for (let key of countriesList) {
  let option = document.createElement("option");
  countrySelect.appendChild(option);
  option.innerHTML = `${key.name_pl}`;
  option.value = `${key.code}`;
}

let formNextStepBtn = document.querySelector("[multi='next_step']");
let formPrevStepBtn = document.querySelector("[multi='prev_step']");
let prevSlideBtn = document.querySelector("[multi='arrow_prev']");
let nextSlideBtn = document.querySelector("[multi='arrow_next']");

//  grab form
formWrapper = document.querySelector("[app='uncapped_form']");
// grab form trigger
formTrigger = formWrapper.querySelector("[multi='submit']");
// grab all input fields from form without checkboxes
let companyNameInput = formWrapper.querySelector("[app='company_name']");
urlInput = formWrapper.querySelector("[app='url']");
firstNameInput = formWrapper.querySelector("[app='firstName']");
lastNameInput = formWrapper.querySelector("[app='lastName']");
emailInput = formWrapper.querySelector("[app='email']");
phoneInput = formWrapper.querySelector("[app='phone']");

formWrapper.setAttribute("action", "financing_uncapped");

let positive = false;

urlInput.addEventListener("blur", function () {
  checkUrlBlur();
});

companyNameInput.addEventListener("blur", function () {
  checkCompanyNameBlur();
});

firstNameInput.addEventListener("blur", function () {
  checkFirstNameBlur();
});

lastNameInput.addEventListener("blur", function () {
  checkLastNameBlur();
});

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

phoneInput.addEventListener("blur", function () {
  checkPhoneBlur();
});

formPrevStepBtn.addEventListener("click", () => {
  prevSlideBtn.click();
});

formNextStepBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  checkUrlBlur();
  checkCompanyNameBlur();
});

formTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  // first step
  let countryInput = formWrapper.querySelector("[multi='country']");
  let countryValue = countryInput.value;
  let monthlyIncomeInput = formWrapper.querySelector("[multi='monthly_euro_income']");
  let monthlyIncomeValue = monthlyIncomeInput.value;
  let businessTypeInput = formWrapper.querySelector("[multi='business_activity_type']");
  let businessTypeValue = businessTypeInput.value;
  // second step

  let privacyTerms = formWrapper.querySelector("[name='privacy']");
  let overallTerms = formWrapper.querySelector("[name='terms']");

  if (!privacyTerms.checked) {
    privacyTerms.parentElement.children[0].style.border = errorBorderColor;
    privacyTerms.parentElement.parentElement.children[1].style.display = "flex";
    privacyTerms.value = 0;
  } else {
    privacyTerms.parentElement.children[0].style.border = initialBorderColor;
    privacyTerms.parentElement.parentElement.children[1].style.display = "none";
    privacyTerms.value = 1;
  }

  if (!overallTerms.checked) {
    overallTerms.parentElement.children[0].style.border = errorBorderColor;
    overallTerms.parentElement.parentElement.children[1].style.display = "flex";
    overallTerms.value = 0;
  } else {
    overallTerms.parentElement.children[0].style.border = initialBorderColor;
    overallTerms.parentElement.parentElement.children[1].style.display = "none";
    overallTerms.value = 1;
  }

  checkFirstNameBlur();
  checkLastNameBlur();
  checkUrlBlur();
  checkPhoneBlur();
  checkCompanyNameBlur();
  checkEmailBlur();

  const body = new FormData();
  body.append("company_name", companyValue);
  body.append("url", urlValue);
  body.append("country", countryValue);
  body.append("monthly_euro_income", monthlyIncomeValue);
  body.append("business_activity_type", businessTypeValue);
  body.append("first_name", firstNameValue);
  body.append("last_name", lastNameValue);
  body.append("email", emailValue);
  body.append("phone", phoneInputValue);
  body.append("accept_agree", privacyTerms.value);
  body.append("accept_info", overallTerms.value);
  body.append("action", formWrapper.getAttribute("action"));

  if (companyValue !== "" && checkUrlBlur() && checkFirstNameBlur() && checkLastNameBlur() && checkEmailBlur() && checkPhoneBlur() && privacyTerms.checked) {
    fetch(`https://www.shoper.pl/ajax.php`, {
      body,
      headers: {
        Accept: "*/*",
      },
      method: "POST",
    }).then(function () {
      formWrapper.querySelector("form").style.display = "none";
      formWrapper.querySelector(".w-form-done").style.display = "block";
    });
  } else {
  }
});

setInterval(function checkFirstStep() {
  let companyNameInput = formWrapper.querySelector("[app='company_name']");
  let companyValue = companyNameInput.value;
  let urlInput = formWrapper.querySelector("[app='url']");
  let urlValue = urlInput.value;
  let countryInput = formWrapper.querySelector("[multi='country']");
  let countryValue = countryInput.value;
  let monthlyIncomeInput = formWrapper.querySelector("[multi='monthly_euro_income']");
  let monthlyIncomeValue = monthlyIncomeInput.value;
  let businessTypeInput = formWrapper.querySelector("[multi='business_activity_type']");
  let businessTypeValue = businessTypeInput.value;

  if (useRegexUrl(urlValue) && companyValue !== "" && monthlyIncomeInputForCheck.value !== "0" && monthlyIncomeInputForCheck.value !== "30" && countryValue !== "0") {
    formNextStepBtn.classList.remove("inactive");
    positive = true;
  } else {
    formNextStepBtn.classList.add("inactive");
    positive = false;
  }

  if (positive) {
    formNextStepBtn.style.pointerEvents = "auto";
    formNextStepBtn.addEventListener("click", () => {
      nextSlideBtn.click();
    });
  } else {
    // formNextStepBtn.style.pointerEvents = "none";
  }
}, 700);

// without this, dataLayer sometimes gets 'undefined'

window.dataLayer = window.dataLayer || [];

window.addEventListener("load", () => {
  try {
    let gtmBanner = document.querySelector("#top-bar-header");

    gtmBanner.addEventListener("click", () => {
      let bf = document.querySelector("[app='blackFriday']");
      bf.classList.add("modal--open");
      $(document.body).css("overflow", "hidden");
    });
  } catch (err) {}
});

// remove sites from intercom

window.addEventListener("load", () => {
  let subpage = window.location.pathname;
  let body = document.querySelector("body");

  if (subpage !== "/rodo" && subpage !== "/rodo/" && subpage !== "/zmien-oprogramowanie-sklepu" && subpage !== "/zmien-oprogramowanie-sklepu/") {
    let intercomSrc = "https://shoper-web.netlify.app/intercom.js";
    let intercomScript = document.createElement("script");
    intercomScript.src = intercomSrc;
    body.append(intercomScript);
  } else {
  }
});

const gulp = require( 'gulp' );
const concat = require( 'gulp-concat' );
const minifyJs = require( 'gulp-uglify' );
const sourcemaps = require('gulp-sourcemaps');


const watchJS = () => {
    return gulp.src( '*.js' )
    .pipe(sourcemaps.init())
        .pipe( concat( 'app.js' ) )
    .pipe(sourcemaps.write(''))
    .pipe( gulp.dest( 'dist/') );
}

const watch = () => {
    gulp.watch( '*.js', watchJS);
}

const build = () => {
    return gulp.src( '*.js' )
    .pipe( minifyJs() )
    .pipe( concat( 'app.min.js' ) )
    .pipe( gulp.dest( 'dist/') );
}


exports.watch = watch;
exports.build = build;
var intercomLoader = function () {
  (function () {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic("reattach_activator");
      ic("update", w.intercomSettings);
    } else {
      var d = document;
      var i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var l = function () {
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.intercom.io/widget/w3fwiuib";
        var x = d.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === "complete") {
        l();
      } else if (w.attachEvent) {
        w.attachEvent("onload", l);
      } else {
        w.addEventListener("load", l, false);
      }
    }
  })();
  window.Intercom("boot", {
    app_id: "w3fwiuib",
  });
  window.removeEventListener("scroll", intercomLoader);
};
window.addEventListener("scroll", intercomLoader);

// Required Attributes: form[app='login'], input[app='host']

$("[app='open_login_modal_button']").on("click", function () {
  $("[app='login_modal'").addClass("modal--open");
});
try {
  //  grab form
  formWrapper = document.querySelector("[app='login']");
  // grab form trigger
  formTrigger = formWrapper.querySelector("[app='login_submit']");
  // grab all input fields from form without checkboxes
  hostInput = formWrapper.querySelector("[app='host']");

  // Attach EventListeners to inputs

  hostInput.addEventListener("blur", function () {
    checkHostBlur();
  });

  // Attach EventListener to submit button

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    checkHostBlur();

    let rawValue = hostInput.value;
    let validDomain;
    const regex = /www.*/gm;
    let match = rawValue.match(regex);

    if (match !== null) {
      let rawSplittedValue = match[0].split(".");
      let rawShifted = rawSplittedValue.shift();
      validDomain = rawSplittedValue.join(".");
    } else {
      validDomain = rawValue;
    }

    if (checkHostBlur()) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: $("[app='login']").attr("action"),
          host: validDomain,
        },

        success: function (data) {
          if (data.status === 1) {
            window.location.href = data.redirect;
          } else {
            formWrapper.parentElement.querySelector(
              ".w-form-fail"
            ).style.display = "block";
            formWrapper.parentElement.querySelector(
              ".w-form-fail"
            ).textContent = "Podaj poprawny adres sklepu lub domeny roboczej";
          }
        },
      });
    } else {
    }
  });
} catch (err) {}

window.addEventListener("load", () => {
  $("[app='open_migrate_modal_button']").on("click", function () {
    $("[app='migration_modal']").addClass("modal--open");
  });

  //  grab form
  formWrappers = document.querySelectorAll("[app='migration']");
  // grab form trigger

  formWrappers.forEach((n) => {
    phoneInput = n.querySelector("[app='phone_campaign']");
    emailInput = n.querySelector("[app='email_campaign']");
    formTrigger = n.querySelector("[app='migration-submit']");
    let action = n.getAttribute("action");

    phoneInput.addEventListener("blur", checkPhoneBlurTwo);

    emailInput.addEventListener("blur", checkMailBlurTwo);

    formTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      formWrapper = this.form;
      phoneInput = formWrapper.querySelector("[app='phone_campaign']");
      emailInput = formWrapper.querySelector("[app='email_campaign']");

      checkPhoneBlur();
      checkEmailBlur();

      if (outcomeOne && outcomeTwo) {
        if (window.dataLayer) {
          data = {
            event: "myTrackEvent",
            eventCategory: "Button modal form sent",
            eventAction: formTrigger.value,
            eventLabel: window.location.pathname,
          };

          dataLayer.push(data);
        }

        $.ajax({
          url: "https://www.shoper.pl/ajax.php",
          headers: {},
          method: "POST",
          data: {
            action: action,
            email: emailValue,
            phone: phoneInputValue,
          },
          success: function (data) {
            if (data.status === 1) {
              n.querySelector("form").style.display = "none";
              n.parentElement.querySelector(".w-form-done").style.display = "block";
              n.parentElement.querySelector(".w-form-done").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
              n.querySelector("form").reset();
            } else {
              n.parentElement.querySelector(".w-form-fail").style.display = "block";
            }
          },
        });
      } else {
        if (window.dataLayer) {
          data = {
            event: "myTrackEvent",
            eventCategory: "Button modal form error",
            eventAction: formTrigger.value,
            eventLabel: window.location.pathname,
          };

          dataLayer.push(data);
        }
      }
    });
  });
});

$("[app='open_multisales_modal_button']").on("click", function () {
  $("[app='multisales_modal']").addClass("modal--open");
});

//  grab form
formWrappers = document.querySelectorAll("[app='form_lp']");
// grab form trigger

formWrappers.forEach((n) => {
  phoneInput = n.querySelector("[app='phone']");
  emailInput = n.querySelector("[app='email']");
  urlInput = n.querySelector("[app='url']");
  formTrigger = n.querySelector("[app='form_lp-submit']");
  let action = n.getAttribute("action");
  let name = n.children[0].getAttribute("data-name");

  phoneInput.addEventListener("blur", checkPhoneBlurTwo);

  emailInput.addEventListener("blur", checkMailBlurTwo);

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    formWrapper = this.form;
    phoneInput = formWrapper.querySelector("[app='phone']");
    emailInput = formWrapper.querySelector("[app='email']");
    urlInput = formWrapper.querySelector("[app='url']");

    checkPhoneBlur();
    checkEmailBlur();

    if (outcomeOne && outcomeTwo) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: action,
          email: emailValue,
          phone: phoneInputValue,
          url: urlInput.value,
          form_name: name,
          thulium_id: 54,
          zapier: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS8zM2xobWtjLw==",
          fbclid: fbclidValue,
          gclid: gclidValue,
        },
        success: function (data) {
          if (data.status === 1) {
            n.querySelector("form").style.display = "none";
            n.parentElement.querySelector(".w-form-done").style.display = "block";
            n.parentElement.querySelector(".w-form-done").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            n.querySelector("form").reset();
          } else {
            n.parentElement.querySelector(".w-form-fail").style.display = "block";
          }
        },
      });
    } else {
    }
  });
});

// caculate menu height based on black friday's banner

setInterval(function () {
  try {
    let menu = document.querySelector(".nav__menu");
    let banner = document.querySelector("[app='custom_banner']");
    bannerHeightString = window.getComputedStyle(banner).height;
    bannerHeightValue = parseInt(bannerHeightString);

    if (window.innerWidth <= 991 && window.scrollY < 30) {
      menu.style.height = `${window.innerHeight - bannerHeightValue}px`;
    } else {
      return;
    }
  } catch (e) {
    return;
  }
}, 100);

(function () {
  const $nav = $(".nav");
  const $nav_menu = $nav.find(".nav__menu");
  const dropdownDirective = "dropdown--open";
  const tabDirective = "tab--open";
  const navDirective = "nav--open";

  let dropdownState = false;
  let tabState = false;
  let tabLevel = 1;
  let navState = false;
  let activeTab = "";
  let originViewport = "";
  let currentViewport = "";

  const isMobile = () => {
    return $("#userAgent").is(":hidden");
  };

  const checkIfMobile = () => {
    let state = isMobile();

    if (state) {
      currentViewport = "Mobile";
      return true;
    } else {
      currentViewport = "Desktop";
      return false;
    }
  };

  $("body").append($("<div>").attr("id", "userAgent"));

  checkIfMobile();
  originViewport = currentViewport;

  $(window).resize(function () {
    checkIfMobile();
    if (currentViewport != originViewport) {
      location.reload();
    }
  });

  function initNav() {
    /** Set data */
    $(".nav__dropdown").each(function (i, e) {
      $(this).attr("data-sh-index", i);
    });

    $(".nav__dropdown-tab").each(function (i, e) {
      $(this).attr("data-sh-dropdown-nested", i);
    });

    $(".nav__dropdown-tab-link").each(function (i, e) {
      $(this).attr("data-sh-index", i);
    });

    jQuery.event.special.touchstart = {
      setup: function (_, ns, handle) {
        this.addEventListener("touchstart", handle, {
          passive: !ns.includes("noPreventDefault"),
        });
      },
    };

    jQuery.event.special.touchend = {
      setup: function (_, ns, handle) {
        this.addEventListener("touchend", handle, {
          passive: !ns.includes("noPreventDefault"),
        });
      },
    };
    /** -end Set data */

    /** Events */
    $(".nav__link").on("click", function () {
      const target = $(this).closest(".nav__dropdown");
      $('[data-sh-state="current"]').each(function () {
        $(this).removeAttr("data-sh-state");
      });
      toggleNavDropdown(target);
    });

    $(".nav__dropdown-tab-link").on("click", function () {
      if (checkIfMobile() === false) {
        console.log("Click denied");
        return;
      }
      const target = $(this);
      dropdownState = true;
      toggleNavTab(target);
    });

    $(".nav__dropdown-tab").on("touchstart", function (event) {
      swipeRight(event, toggleNavTab);
    });

    $(".nav__menu").on("touchstart", function (event) {
      if (tabLevel === 2) return;
      swipeRight(event, closeAllDropdowns);
    });

    $(".nav__tab-back").on("click", function () {
      const target = $(this);
      if (tabLevel === 2) {
        toggleNavTab(target);
        return;
      }
      if (dropdownState) {
        closeAllDropdowns();
        return;
      }
    });

    $('[data-sh-action="trigger-nav"]').on("click", toggleNav);

    $(".nav__dropdown-tab-link").hover(function (event) {
      if (checkIfMobile()) {
        return;
      }

      let group = $(this).attr("data-tab-group");

      if (activeTab === group) {
        return;
      }

      toggleNavTab($(this));
      activeTab = $(this).attr("data-tab-group");

      $(this)
        .children()
        .each(function () {
          $(this).toggleClass(tabDirective);
        });
    });

    if (checkIfMobile()) {
      let dropdownContent = $("[data-sh-dropdown]");
      let target = $('[data-sh-mount="mainDropdown"]');
      target.append(dropdownContent);
    }
    /** end Events */
  }

  function swipeRight(event, action) {
    const target = $(event.target);
    const touchObjStart = event.changedTouches[0];
    const startX = parseInt(touchObjStart.clientX);

    $(this).off("touchend");
    $(this).on("touchend", function (event) {
      const touchObjEnd = event.changedTouches[0];
      const endX = parseInt(touchObjEnd.clientX);
      if (endX > startX + 50) {
        action(target);
      }
    });
  }

  function toggleNav(event) {
    const burger = $(".nav__burger-inner");
    closeAllDropdowns();
    if (navState === false) {
      const wrapper = $("<div>").addClass("nav__mobile-menu-wrapper").attr("data-sh-state", "temp");
      $nav_menu.children().wrapAll(wrapper);
      $nav_menu.addClass(navDirective).attr("data-sh-state", "open");
      burger.children().each(function () {
        $(this).addClass(navDirective);
        $(this)
          .children()
          .each(function () {
            $(this).addClass(navDirective);
          });
      });
      return (navState = true);
    }

    if (navState === true) {
      $('[data-sh-state="temp"]').children().unwrap();
      $nav_menu.removeClass(navDirective).attr("data-sh-state", "closed");
      burger.children().each(function () {
        $(this).removeClass(navDirective);
        $(this)
          .children()
          .each(function () {
            $(this).removeClass(navDirective);
          });
      });
      return (navState = false);
    }
  }

  function toggleNavDropdown(target) {
    const targetIndex = target.attr("data-sh-index");
    const tempDropdownIndex = $(`[data-sh-dropdown="${targetIndex}"]`).attr("data-sh-dropdown");

    if (dropdownState === false) {
      if (checkIfMobile()) {
        $('[data-sh-index="0"]').find(".nav__dropdown-list").addClass(dropdownDirective);
        $(`[data-sh-dropdown="${targetIndex}"]`).addClass(dropdownDirective);
        $(".nav__logo-wrapper").addClass(dropdownDirective);
        $(".nav__tab-back").addClass(dropdownDirective);
      } else {
        target.find(".nav__dropdown-list").addClass(dropdownDirective);
      }
      target.attr("data-sh-state", "current");
      $(".nav__column").each(function () {
        $(this).addClass(dropdownDirective);
      });

      return (dropdownState = true);
    }

    if (dropdownState === true) {
      $(".nav__column").each(function () {
        $(this).removeClass(dropdownDirective);
      });
      if (checkIfMobile()) {
        $('[data-sh-index="0"]').find(".nav__dropdown-list").removeClass(dropdownDirective);
        $(`[data-sh-dropdown="${targetIndex}"]`).removeClass(dropdownDirective);
        $(".nav__logo-wrapper").removeClass(dropdownDirective);
        $(".nav__tab-back").removeClass(dropdownDirective);
      } else {
        target.find(".nav__dropdown-list").removeClass(dropdownDirective);
      }
      target.find(".nav__dropdown-list").removeClass(dropdownDirective);

      return (dropdownState = false);
    }
  }

  function closeAllDropdowns() {
    if (dropdownState === false) return;
    $(".dropdown--open").each(function () {
      $(this).removeClass(dropdownDirective);
    });
    return (dropdownState = false);
  }

  function toggleNavTab(target) {
    let bindGroup = target.attr("data-tab-group");

    // Mobile
    if (checkIfMobile()) {
      if (tabLevel === 1) {
        $(bindGroup).each(function () {
          $(this).addClass(tabDirective);
        });
        $(`.nav__dropdown-tab[data-tab-group=${bindGroup}]`).addClass(tabDirective);
        target.closest(".nav__dropdown-list-wrapper.type-two").find(".nav__dropdown-content-left.type-two").addClass(tabDirective);
        target.closest(".nav__dropdown-list-wrapper.type-two").find(".nav__dropdown-content-right.type-two").addClass(tabDirective);
        tabState = true;
        tabLevel = 2;
        return;
      }
      if (tabLevel === 2) {
        $(`.${tabDirective}`).each(function () {
          $(this).removeClass(tabDirective);
        });
        tabState = false;
        tabLevel = 1;

        return;
      }
    }

    $(`.${tabDirective}`).each(function () {
      $(this).removeClass(tabDirective);
    });

    $(bindGroup).each(function () {
      $(this).toggleClass(tabDirective);
    });
    $(`.nav__dropdown-tab[data-tab-group=${bindGroup}]`).toggleClass(tabDirective);
    target.closest(".nav__dropdown-list-wrapper.type-two").find(".nav__dropdown-content-left.type-two").toggleClass(tabDirective);
    target.closest(".nav__dropdown-list-wrapper.type-two").find(".nav__dropdown-content-right.type-two").toggleClass(tabDirective);
  }

  initNav();
})();

// footer year update
try {
  let footerYear = document.querySelector("#footer-year");
  footerYear.innerHTML = new Date().getFullYear();
} catch (e) {}

window.addEventListener("load", () => {
  $("[app='open_create_trial_step1_modal_button']").on("click", function () {
    $("[app='create_trial_step1_modal']").addClass("modal--open");
    $(document.body).css("overflow", "hidden");
  });
  $("[app='open_custom_modal_button']").on("click", function () {
    $("[app='bannerModal']").addClass("modal--open");
    let cardType = this.parentElement.getAttribute("card");
    this.parentElement.style.display = "grid";
    if (cardType === "enterprise") {
      document.querySelector("[app='custom_form']").setAttribute("package", "31");
      document.querySelector("[app='custom_form']").setAttribute("form", "enterprise-form");

      if (window.dataLayer) {
        data = {
          event: "myTrackEvent”",
          eventCategory: "Button modal opened",
          eventAction: this.textContent,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
        console.log(dataLayer);
      }
    } else {
      document.querySelector("[app='custom_form']").setAttribute("package", "7");
      document.querySelector("[app='custom_form']").setAttribute("form", "premium-form");

      if (window.dataLayer) {
        data = {
          event: "myTrackEvent”",
          eventCategory: "Button modal opened",
          eventAction: this.textContent,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
      }
    }
    $(document.body).css("overflow", "hidden");
  });
  // form + checkbox
  let toggleForm = document.querySelector("[app='toggle_form']");
  let togglePrice = document.querySelector("[app='toggle_button']");
  let checkboxPrice = toggleForm.querySelector("input[type='checkbox']");
  let toggleFormYear = document.querySelector("[app='yearly_form']");
  let toggleYear = document.querySelector("[app='yearlyToggle']");
  let checkboxYear = toggleFormYear.querySelector("input[type='checkbox']");
  // promo prices
  let priceBoxStandard = document.querySelector("[pricebox='standard']").children[0];
  let priceBoxPremium = document.querySelector("[pricebox='premium']").children[0];
  let priceBoxEnterprise = document.querySelector("[pricebox='enterprise']").children[0];
  // clones
  let priceBoxStandardClone = document.querySelector("[pricebox='standardClone']").children[0];
  let priceBoxPremiumClone = document.querySelector("[pricebox='premiumClone']").children[0];
  let priceBoxEnterpriseClone = document.querySelector("[pricebox='enterpriseClone']").children[0];
  // price boxes
  let boxStandard;
  let boxPremium;
  let boxEnterprise;
  // price boxes clones
  let boxStandardClone = document.querySelector("#box-standard-clone");
  let boxPremiumClone = document.querySelector("#box-premium-clone");
  let boxEnterpriseClone = document.querySelector("#box-enterprise-clone");
  // regular prices
  let priceBoxStandardRegular = document.querySelector("[regular='standard']");
  let priceBoxPremiumRegular = document.querySelector("[regular='premium']");
  let priceBoxEnterpriseRegular = document.querySelector("[regular='enterprise']");
  let priceBoxStandardRegularMini = document.querySelector("[regular='standard_mini']");
  let priceBoxPremiumRegularMini = document.querySelector("[regular='premium_mini']");
  let priceBoxEnterpriseRegularMini = document.querySelector("[regular='enterprise_mini']");

  // labels
  let boxLabelStandard = document.querySelector("[pricelabel='standard']");
  let boxLabelPremium = document.querySelector("[pricelabel='premium']");
  let boxLabelEnterprise = document.querySelector("[pricelabel='enterprise']");

  // badges
  let standardBadge = document.querySelector("[standard='badge']");
  let premiumBadge = document.querySelector("[premium='badge']");
  let enterpriseBadge = document.querySelector("[enterprise='badge']");

  let net = "netto miesięcznie";
  let gross = "brutto miesięcznie";

  //  grab form
  formWrapper = document.querySelector("[app='custom_form']");
  // grab form trigger
  formTrigger = formWrapper.querySelector("[app='bcm-submit']");
  // grab all input fields from form without checkboxes
  phoneInput = formWrapper.querySelector("[app='phone_campaign']");
  emailInput = formWrapper.querySelector("[app='email_campaign']");

  // Attach EventListeners to inputs

  emailInput.addEventListener("blur", function () {
    checkEmailBlur();
  });

  phoneInput.addEventListener("blur", function () {
    checkPhoneBlur();
  });

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    checkEmailBlur();
    checkPhoneBlur();

    if (!checkEmailBlur() && window.dataLayer) {
      data = {
        event: "myTrackEvent",
        eventCategory: "errorFormEvent",
        eventValue: "",
        eventLabel: "email",
      };

      dataLayer.push(data);
      console.log(dataLayer);
    }

    if (!checkPhoneBlur() && window.dataLayer) {
      data = {
        event: "myTrackEvent",
        eventCategory: "errorFormEvent",
        eventValue: "",
        eventLabel: "phone",
      };

      dataLayer.push(data);
      console.log(dataLayer);
    }

    const body = new FormData();
    body.append("action", formWrapper.getAttribute("action"));
    body.append("type", formWrapper.getAttribute("type"));
    body.append("source_id", formWrapper.getAttribute("source_id"));
    body.append("package", formWrapper.getAttribute("package"));
    body.append("email", phoneInputValue);
    body.append("phone", emailValue);

    if (checkEmailBlur() && checkPhoneBlur()) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: formWrapper.getAttribute("action"),
          type: formWrapper.getAttribute("type"),
          source_id: formWrapper.getAttribute("source_id"),
          package: formWrapper.getAttribute("package"),
          phone: phoneInputValue,
          email: emailValue,
        },
        success: function (data) {
          formWrapper.querySelector("form").style.display = "none";
          formWrapper.parentElement.querySelector(".w-form-done").style.display = "block";
          formWrapper.querySelector("form").reset();
        },
        error: function (data) {
          formWrapper.parentElement.querySelector(".w-form-fail").style.display = "block";
          formWrapper.parentElement.querySelector(".w-form-fail").textContent = "Coś poszło nie tak, spróbuj ponownie.";
        },
      });

      if (window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "Button modal form sent",
          eventAction: this.value,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
        console.log(dataLayer);
      }
    } else {
      if (window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "Button modal form error",
          eventAction: this.value,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
        console.log(dataLayer);
      }
    }
  });

  // fetch

  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "get_prices_list",
    },
    success: function (data) {
      let regular = data.price;
      let promotion = data.promotion;

      // Standard Gross 1 month price
      let standardWholePriceGross = regular.standard[1].gross;
      let standardMainPartGross = standardWholePriceGross.toString().split(".")[0];
      let standardSparePartGross = standardWholePriceGross.toString().split(".")[1];
      // Standard Net 1 month price
      let standardWholePriceNet = regular.standard[1].net;
      let standardMainPartNet = standardWholePriceNet.toString().split(".")[0];
      let standardSparePartNet = standardWholePriceNet.toString().split(".")[1];
      // Premium  Gross 1 month price
      let premiumWholePriceGross = regular.premium[1].gross;
      let premiumMainPartGross = premiumWholePriceGross.toString().split(".")[0];
      let premiumSparePartGross = premiumWholePriceGross.toString().split(".")[1];
      // Premium  Net 1 month price
      let premiumWholePriceNet = regular.premium[1].net;
      let premiumMainPartNet = premiumWholePriceNet.toString().split(".")[0];
      let premiumSparePartNet = premiumWholePriceNet.toString().split(".")[1];
      // Enterprise Gross 1 month price
      let enterpriseWholePriceGross = regular.enterprise[1].gross;
      let enterpriseMainPartGross = enterpriseWholePriceGross.toString().split(".")[0];
      let enterpriseSparePartGross = enterpriseWholePriceGross.toString().split(".")[1];
      // Enterprise Net 1 month price
      let enterpriseWholePriceNet = regular.enterprise[1].net;
      let enterpriseMainPartNet = enterpriseWholePriceNet.toString().split(".")[0];
      let enterpriseSparePartNet = enterpriseWholePriceNet.toString().split(".")[1];

      // Standard Gross year price
      let standardWholePriceGrossY = promotion.price.standard[12].month.gross;
      let standardMainPartGrossY = standardWholePriceGrossY.toString().split(".")[0];
      let standardSparePartGrossY = standardWholePriceGrossY.toString().split(".")[1];
      // Standard Net year price
      let standardWholePriceNetY = promotion.price.standard[12].month.net;
      let standardMainPartNetY = standardWholePriceNetY.toString().split(".")[0];
      let standardSparePartNetY = standardWholePriceNetY.toString().split(".")[1];
      // Premium  Gross year price
      let premiumWholePriceGrossY = regular.premium[12].month.gross;
      let premiumMainPartGrossY = premiumWholePriceGrossY.toString().split(".")[0];
      let premiumSparePartGrossY = premiumWholePriceGrossY.toString().split(".")[1];
      // Premium  Net year price
      let premiumWholePriceNetY = regular.premium[12].month.net;
      let premiumMainPartNetY = premiumWholePriceNetY.toString().split(".")[0];
      let premiumSparePartNetY = premiumWholePriceNetY.toString().split(".")[1];
      // Enterprise Gross year price
      let enterpriseWholePriceGrossY = regular.enterprise[12].month.gross;
      let enterpriseMainPartGrossY = enterpriseWholePriceGrossY.toString().split(".")[0];
      let enterpriseSparePartGrossY = enterpriseWholePriceGrossY.toString().split(".")[1];
      // Enterprise Net year price
      let enterpriseWholePriceNetY = regular.enterprise[12].month.net;
      let enterpriseMainPartNetY = enterpriseWholePriceNetY.toString().split(".")[0];
      let enterpriseSparePartNetY = enterpriseWholePriceNetY.toString().split(".")[1];
      // initial values
      priceBoxStandard.textContent = standardWholePriceNet;
      priceBoxPremium.textContent = premiumWholePriceNet;
      priceBoxEnterprise.textContent = enterpriseWholePriceNet;

      priceBoxStandardClone.textContent = standardWholePriceNet;
      priceBoxPremiumClone.textContent = premiumWholePriceNet;
      priceBoxEnterpriseClone.textContent = enterpriseWholePriceNet;

      priceBoxStandardRegular.textContent = "";
      priceBoxPremiumRegular.textContent = "";
      priceBoxEnterpriseRegular.textContent = "";

      priceBoxStandardRegularMini.textContent = "";
      priceBoxPremiumRegularMini.textContent = "";
      priceBoxEnterpriseRegularMini.textContent = "";

      standardBadge.style.display = "none";
      premiumBadge.style.display = "none";
      enterpriseBadge.style.display = "none";

      function checkValues() {
        boxStandard = document.querySelector("#pricebox-standard");
        boxPremium = document.querySelector("#pricebox-premium");
        boxEnterprise = document.querySelector("#pricebox-enterprise");
        // gross & monthly
        if (checkboxPrice.checked && !checkboxYear.checked) {
          boxLabelStandard.textContent = gross;
          boxLabelPremium.textContent = gross;
          boxLabelEnterprise.textContent = gross;
          priceBoxStandard.textContent = standardMainPartGross;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartGross;
          priceBoxPremium.nextElementSibling.children[0].textContent = `,${premiumSparePartGross}`;
          priceBoxEnterprise.textContent = enterpriseMainPartGross;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = `,${enterpriseSparePartGross}`;
          priceBoxStandardRegular.textContent = "";
          priceBoxPremiumRegular.textContent = "";
          priceBoxEnterpriseRegular.textContent = "";
          standardBadge.style.display = "none";
          premiumBadge.style.display = "none";
          enterpriseBadge.style.display = "none";
          // net & monthly
        } else if (!checkboxPrice.checked && !checkboxYear.checked) {
          boxLabelStandard.textContent = net;
          boxLabelPremium.textContent = net;
          boxLabelEnterprise.textContent = net;
          priceBoxStandard.textContent = standardMainPartNet;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartNet;
          priceBoxPremium.nextElementSibling.children[0].textContent = ``;
          priceBoxEnterprise.textContent = enterpriseMainPartNet;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = "";
          priceBoxPremiumRegular.textContent = "";
          priceBoxEnterpriseRegular.textContent = "";
          standardBadge.style.display = "none";
          premiumBadge.style.display = "none";
          enterpriseBadge.style.display = "none";
          // gross & yearly
        } else if (checkboxPrice.checked && checkboxYear.checked) {
          boxLabelStandard.textContent = gross;
          boxLabelPremium.textContent = gross;
          boxLabelEnterprise.textContent = gross;
          priceBoxStandard.textContent = standardMainPartGrossY;
          priceBoxStandard.nextElementSibling.children[0].textContent = `,${standardSparePartGrossY}`;
          priceBoxPremium.textContent = premiumMainPartGrossY;
          priceBoxPremium.nextElementSibling.children[0].textContent = `,${premiumSparePartGrossY}`;
          priceBoxEnterprise.textContent = enterpriseMainPartGrossY;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = `${standardWholePriceGross} zł`;
          priceBoxPremiumRegular.textContent = `${premiumWholePriceGross} zł`;
          priceBoxEnterpriseRegular.textContent = `${enterpriseWholePriceGross} zł`;
          standardBadge.style.display = "block";
          premiumBadge.style.display = "block";
          enterpriseBadge.style.display = "block";
        } else {
          // net & yearly
          boxLabelStandard.textContent = net;
          boxLabelPremium.textContent = net;
          boxLabelEnterprise.textContent = net;
          priceBoxStandard.textContent = standardMainPartNetY;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartNetY;
          priceBoxPremium.nextElementSibling.children[0].textContent = ``;
          priceBoxEnterprise.textContent = enterpriseMainPartNetY;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = `${standardWholePriceNet} zł`;
          priceBoxPremiumRegular.textContent = `${premiumWholePriceNet} zł`;
          priceBoxEnterpriseRegular.textContent = `${enterpriseWholePriceNet} zł`;
          standardBadge.style.display = "block";
          premiumBadge.style.display = "block";
          enterpriseBadge.style.display = "block";
        }
        // duplicate values to the compact cards at the bottom
        boxStandardClone.innerHTML = boxStandard.innerHTML;
        boxPremiumClone.innerHTML = boxPremium.innerHTML;
        boxEnterpriseClone.innerHTML = boxEnterprise.innerHTML;

        let compactCardsGrid = document.querySelector("#compact-cards");
        let badgesInCompact = compactCardsGrid.querySelectorAll(".badge-new");
        badgesInCompact.forEach((badge) => {
          badge.remove();
        });
      }
      //  event when net/gross clicked
      togglePrice.addEventListener("click", () => {
        checkboxPrice.click();
        checkValues();
      });
      //  event when monthly/yearly clicked
      toggleYear.addEventListener("click", () => {
        checkboxYear.click();
        checkValues();
      });
    },
    error: function (err) {},
  });
});

// if user uses back/forward buttons

const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.type === "back_forward") {
      location.reload(true);
    }
  });
});

observer.observe({ type: "navigation", buffered: true });
window.addEventListener("load", () => {
  $("[app='open_create_trial_step1_modal_button']").on("click", function () {
    $("[app='create_trial_step1_modal']").addClass("modal--open");
    $(document.body).css("overflow", "hidden");
  });
  $("[app='open_custom_modal_button']").on("click", function () {
    $("[app='bannerModal']").addClass("modal--open");
    let cardType = this.parentElement.getAttribute("card");
    this.parentElement.style.display = "grid";
    if (cardType === "enterprise") {
      document.querySelector("[app='custom_form']").setAttribute("package", "31");
      document.querySelector("[app='custom_form']").setAttribute("form", "enterprise-form");

      if (window.dataLayer) {
        data = {
          event: "myTrackEvent”",
          eventCategory: "Button modal opened",
          eventAction: this.textContent,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
        console.log(dataLayer);
      }
    } else {
      document.querySelector("[app='custom_form']").setAttribute("package", "7");
      document.querySelector("[app='custom_form']").setAttribute("form", "premium-form");

      if (window.dataLayer) {
        data = {
          event: "myTrackEvent”",
          eventCategory: "Button modal opened",
          eventAction: this.textContent,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
      }
    }
    $(document.body).css("overflow", "hidden");
  });

  // form + checkbox
  let toggleForm = document.querySelector("[app='toggle_form']");
  let togglePrice = document.querySelector("[app='toggle_button']");
  let checkboxPrice = toggleForm.querySelector("input[type='checkbox']");
  let toggleFormYear = document.querySelector("[app='yearly_form']");
  let toggleYear = document.querySelector("[app='yearlyToggle']");
  let checkboxYear = toggleFormYear.querySelector("input[type='checkbox']");
  // promo prices
  let priceBoxStandard = document.querySelector("[pricebox='standard']").children[0];
  let priceBoxPremium = document.querySelector("[pricebox='premium']").children[0];
  let priceBoxEnterprise = document.querySelector("[pricebox='enterprise']").children[0];
  // clones
  let priceBoxStandardClone = document.querySelector("[pricebox='standardClone']").children[0];
  let priceBoxPremiumClone = document.querySelector("[pricebox='premiumClone']").children[0];
  let priceBoxEnterpriseClone = document.querySelector("[pricebox='enterpriseClone']").children[0];
  // price boxes
  let boxStandard;
  let boxPremium;
  let boxEnterprise;
  // price boxes clones
  let boxStandardClone = document.querySelector("#box-standard-clone");
  let boxPremiumClone = document.querySelector("#box-premium-clone");
  let boxEnterpriseClone = document.querySelector("#box-enterprise-clone");
  // regular prices
  let priceBoxStandardRegular = document.querySelector("[regular='standard']");
  let priceBoxPremiumRegular = document.querySelector("[regular='premium']");
  let priceBoxEnterpriseRegular = document.querySelector("[regular='enterprise']");
  let priceBoxStandardRegularMini = document.querySelector("[regular='standard_mini']");
  let priceBoxPremiumRegularMini = document.querySelector("[regular='premium_mini']");
  let priceBoxEnterpriseRegularMini = document.querySelector("[regular='enterprise_mini']");

  // labels
  let boxLabelStandard = document.querySelector("[pricelabel='standard']");
  let boxLabelPremium = document.querySelector("[pricelabel='premium']");
  let boxLabelEnterprise = document.querySelector("[pricelabel='enterprise']");

  // badges
  let standardBadge = document.querySelector("[standard='badge']");
  let premiumBadge = document.querySelector("[premium='badge']");
  let enterpriseBadge = document.querySelector("[enterprise='badge']");

  // accordion first child
  let accordionFirstChild = document.querySelectorAll("[accordion='firstChild']");

  let net = "netto miesięcznie";
  let gross = "brutto miesięcznie";

  //  grab form
  formWrapper = document.querySelector("[app='custom_form']");
  // grab form trigger
  formTrigger = formWrapper.querySelector("[app='bcm-submit']");
  // grab all input fields from form without checkboxes
  phoneInput = formWrapper.querySelector("[app='phone_campaign']");
  emailInput = formWrapper.querySelector("[app='email_campaign']");

  // Attach EventListeners to inputs

  emailInput.addEventListener("blur", function () {
    checkEmailBlur();
  });

  phoneInput.addEventListener("blur", function () {
    checkPhoneBlur();
  });

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    checkEmailBlur();
    checkPhoneBlur();

    if (!checkEmailBlur() && window.dataLayer) {
      data = {
        event: "myTrackEvent",
        eventCategory: "errorFormEvent",
        eventValue: "",
        eventLabel: "email",
      };

      dataLayer.push(data);
      console.log(dataLayer);
    }

    if (!checkPhoneBlur() && window.dataLayer) {
      data = {
        event: "myTrackEvent",
        eventCategory: "errorFormEvent",
        eventValue: "",
        eventLabel: "phone",
      };

      dataLayer.push(data);
      console.log(dataLayer);
    }

    const body = new FormData();
    body.append("action", formWrapper.getAttribute("action"));
    body.append("type", formWrapper.getAttribute("type"));
    body.append("source_id", formWrapper.getAttribute("source_id"));
    body.append("package", formWrapper.getAttribute("package"));
    body.append("email", phoneInputValue);
    body.append("phone", emailValue);

    if (checkEmailBlur() && checkPhoneBlur()) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: formWrapper.getAttribute("action"),
          type: formWrapper.getAttribute("type"),
          source_id: formWrapper.getAttribute("source_id"),
          package: formWrapper.getAttribute("package"),
          phone: phoneInputValue,
          email: emailValue,
        },
        success: function (data) {
          formWrapper.querySelector("form").style.display = "none";
          formWrapper.parentElement.querySelector(".w-form-done").style.display = "block";
          formWrapper.querySelector("form").reset();
        },
        error: function (data) {
          formWrapper.parentElement.querySelector(".w-form-fail").style.display = "block";
          formWrapper.parentElement.querySelector(".w-form-fail").textContent = "Coś poszło nie tak, spróbuj ponownie.";
        },
      });

      if (window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "Button modal form sent",
          eventAction: this.value,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
        console.log(dataLayer);
      }
    } else {
      if (window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "Button modal form error",
          eventAction: this.value,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
        console.log(dataLayer);
      }
    }
  });

  // fetch

  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "get_prices_list",
    },
    success: function (data) {
      document.querySelector(".pricelist__toggle").style.opacity = 1;
      let regular = data.price;
      let promotion = data.promotion;

      // Standard Gross 1 month price
      let standardWholePriceGross = regular.standard[1].gross;
      let standardMainPartGross = standardWholePriceGross.toString().split(".")[0];
      let standardSparePartGross = standardWholePriceGross.toString().split(".")[1];
      // Standard Net 1 month price
      let standardWholePriceNet = regular.standard[1].net;
      let standardMainPartNet = standardWholePriceNet.toString().split(".")[0];
      let standardSparePartNet = standardWholePriceNet.toString().split(".")[1];
      // Premium  Gross 1 month price
      let premiumWholePriceGross = regular.premium[1].gross;
      let premiumMainPartGross = premiumWholePriceGross.toString().split(".")[0];
      let premiumSparePartGross = premiumWholePriceGross.toString().split(".")[1];
      // Premium  Net 1 month price
      let premiumWholePriceNet = regular.premium[1].net;
      let premiumMainPartNet = premiumWholePriceNet.toString().split(".")[0];
      let premiumSparePartNet = premiumWholePriceNet.toString().split(".")[1];
      // Enterprise Gross 1 month price
      let enterpriseWholePriceGross = regular.enterprise[1].gross;
      let enterpriseMainPartGross = enterpriseWholePriceGross.toString().split(".")[0];
      let enterpriseSparePartGross = enterpriseWholePriceGross.toString().split(".")[1];
      // Enterprise Net 1 month price
      let enterpriseWholePriceNet = regular.enterprise[1].net;
      let enterpriseMainPartNet = enterpriseWholePriceNet.toString().split(".")[0];
      let enterpriseSparePartNet = enterpriseWholePriceNet.toString().split(".")[1];

      // Standard Gross year price
      let standardWholePriceGrossY = promotion.price.standard[12].month.gross;
      let standardMainPartGrossY = standardWholePriceGrossY.toString().split(".")[0];
      let standardSparePartGrossY = standardWholePriceGrossY.toString().split(".")[1];
      // Standard Net year price
      let standardWholePriceNetY = promotion.price.standard[12].month.net;
      let standardMainPartNetY = standardWholePriceNetY.toString().split(".")[0];
      let standardSparePartNetY = standardWholePriceNetY.toString().split(".")[1];
      // Premium  Gross year price
      let premiumWholePriceGrossY = regular.premium[12].month.gross;
      let premiumMainPartGrossY = premiumWholePriceGrossY.toString().split(".")[0];
      let premiumSparePartGrossY = premiumWholePriceGrossY.toString().split(".")[1];
      // Premium  Net year price
      let premiumWholePriceNetY = regular.premium[12].month.net;
      let premiumMainPartNetY = premiumWholePriceNetY.toString().split(".")[0];
      let premiumSparePartNetY = premiumWholePriceNetY.toString().split(".")[1];
      // Enterprise Gross year price
      let enterpriseWholePriceGrossY = regular.enterprise[12].month.gross;
      let enterpriseMainPartGrossY = enterpriseWholePriceGrossY.toString().split(".")[0];
      let enterpriseSparePartGrossY = enterpriseWholePriceGrossY.toString().split(".")[1];
      // Enterprise Net year price
      let enterpriseWholePriceNetY = regular.enterprise[12].month.net;
      let enterpriseMainPartNetY = enterpriseWholePriceNetY.toString().split(".")[0];
      let enterpriseSparePartNetY = enterpriseWholePriceNetY.toString().split(".")[1];
      // initial values
      priceBoxStandard.textContent = standardWholePriceNetY;
      priceBoxPremium.textContent = premiumWholePriceNetY;
      priceBoxEnterprise.textContent = enterpriseWholePriceNetY;

      priceBoxStandardClone.textContent = standardWholePriceNetY;
      priceBoxPremiumClone.textContent = premiumWholePriceNetY;
      priceBoxEnterpriseClone.textContent = enterpriseWholePriceNetY;

      priceBoxStandardRegular.textContent = "";
      priceBoxPremiumRegular.textContent = "";
      priceBoxEnterpriseRegular.textContent = "";

      priceBoxStandardRegularMini.textContent = "";
      priceBoxPremiumRegularMini.textContent = "";
      priceBoxEnterpriseRegularMini.textContent = "";

      standardBadge.style.display = "none";
      premiumBadge.style.display = "none";
      enterpriseBadge.style.display = "none";

      let standardWholePriceGrossComma = standardWholePriceGross.replace(".", ",");
      let premiumWholePriceGrossComma = premiumWholePriceGross.replace(".", ",");
      let enterpriseWholePriceGrossComma = enterpriseWholePriceGross.replace(".", ",");

      let standardWholePriceNetComma = standardWholePriceNet.replace(".", ",");
      let premiumWholePriceNetComma = premiumWholePriceNet.replace(".", ",");
      let enterpriseWholePriceNetComma = enterpriseWholePriceNet.replace(".", ",");

      function checkValues() {
        boxStandard = document.querySelector("#pricebox-standard");
        boxPremium = document.querySelector("#pricebox-premium");
        boxEnterprise = document.querySelector("#pricebox-enterprise");
        // gross & monthly
        if (checkboxPrice.checked && !checkboxYear.checked) {
          boxLabelStandard.textContent = gross;
          boxLabelPremium.textContent = gross;
          boxLabelEnterprise.textContent = gross;
          priceBoxStandard.textContent = standardMainPartGross;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartGross;
          priceBoxPremium.nextElementSibling.children[0].textContent = `,${premiumSparePartGross}`;
          priceBoxEnterprise.textContent = enterpriseMainPartGross;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = `,${enterpriseSparePartGross}`;
          priceBoxStandardRegular.textContent = "";
          priceBoxPremiumRegular.textContent = "";
          priceBoxEnterpriseRegular.textContent = "";
          standardBadge.style.display = "none";
          premiumBadge.style.display = "none";
          enterpriseBadge.style.display = "none";
          // net & monthly
        } else if (!checkboxPrice.checked && !checkboxYear.checked) {
          boxLabelStandard.textContent = net;
          boxLabelPremium.textContent = net;
          boxLabelEnterprise.textContent = net;
          priceBoxStandard.textContent = standardMainPartNet;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartNet;
          priceBoxPremium.nextElementSibling.children[0].textContent = ``;
          priceBoxEnterprise.textContent = enterpriseMainPartNet;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = "";
          priceBoxPremiumRegular.textContent = "";
          priceBoxEnterpriseRegular.textContent = "";
          standardBadge.style.display = "none";
          premiumBadge.style.display = "none";
          enterpriseBadge.style.display = "none";
          // gross & yearly
        } else if (checkboxPrice.checked && checkboxYear.checked) {
          boxLabelStandard.textContent = gross;
          boxLabelPremium.textContent = gross;
          boxLabelEnterprise.textContent = gross;
          priceBoxStandard.textContent = standardMainPartGrossY;
          priceBoxStandard.nextElementSibling.children[0].textContent = `,${standardSparePartGrossY}`;
          priceBoxPremium.textContent = premiumMainPartGrossY;
          priceBoxPremium.nextElementSibling.children[0].textContent = `,${premiumSparePartGrossY}`;
          priceBoxEnterprise.textContent = enterpriseMainPartGrossY;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = `${standardWholePriceGrossComma} zł`;
          priceBoxPremiumRegular.textContent = `${premiumWholePriceGrossComma} zł`;
          priceBoxEnterpriseRegular.textContent = `${enterpriseWholePriceGrossComma} zł`;
          standardBadge.style.display = "block";
          premiumBadge.style.display = "block";
          enterpriseBadge.style.display = "block";
        } else {
          // net & yearly
          boxLabelStandard.textContent = net;
          boxLabelPremium.textContent = net;
          boxLabelEnterprise.textContent = net;
          priceBoxStandard.textContent = standardMainPartNetY;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartNetY;
          priceBoxPremium.nextElementSibling.children[0].textContent = ``;
          priceBoxEnterprise.textContent = enterpriseMainPartNetY;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = `${standardWholePriceNetComma} zł`;
          priceBoxPremiumRegular.textContent = `${premiumWholePriceNetComma} zł`;
          priceBoxEnterpriseRegular.textContent = `${enterpriseWholePriceNetComma} zł`;
          standardBadge.style.display = "block";
          premiumBadge.style.display = "block";
          enterpriseBadge.style.display = "block";
        }
        // duplicate values to the compact cards at the bottom
        boxStandardClone.innerHTML = boxStandard.innerHTML;
        boxPremiumClone.innerHTML = boxPremium.innerHTML;
        boxEnterpriseClone.innerHTML = boxEnterprise.innerHTML;

        let compactCardsGrid = document.querySelector("#compact-cards");
        let badgesInCompact = compactCardsGrid.querySelectorAll(".badge-new");
        // badgesInCompact.forEach((badge) => {
        //   badge.remove();
        // });
      }
      //  event when net/gross clicked
      togglePrice.addEventListener("click", () => {
        checkboxPrice.click();
        checkValues();
      });
      //  event when monthly/yearly clicked
      toggleYear.addEventListener("click", () => {
        checkboxYear.click();
        checkValues();
      });
      toggleYear.click();

      loaderItems = document.querySelectorAll(".loader-xl");

      loaderItems.forEach((n) => {
        n.style.display = "none";
      });
    },
    error: function (err) {},
  });

  accordionFirstChild[1].click();
});

// $.ajax({
//   url: "https://www.shoper.pl/ajax.php",
//   headers: {},
//   method: "POST",
//   data: {
//     action: "get_promotion",
//   },
//   success: function (data) {
//     // header
//     let headerPercentage = document.querySelector("[header='percentage']");
//     let discountPercentage = data.package.discount;
//     headerPercentage.textContent = `${discountPercentage}%`;
//   },
//   error: function () {
//     // console.log("error");
//   },
// });

var Webflow = Webflow || [];
Webflow.push(function () {
  const promoTimeSelector = "[app='promo_time']";
  const dailyPromo = "[app='daily_promo']";
  const navbarPromo = "[app='nav_promo']";
  const promoPriceSelector = "[app='promo_price']";
  const promoTitleSelector = "[app='promo_title']";
  const oldPriceYear = "[app='promo_title_old']";
  const newPriceYear = "[app='promo_title_new']";

  const percentDiscount = document.querySelector("[hero='percentDiscount']");
  const regularPrice = document.querySelector("[hero='regularPrice']");
  const promotionPrice = document.querySelector("[hero='promotionPrice']");

  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "get_promotion",
    },
    success: function (data) {
      let discountPercentage = data.package.discount;
      let monthlyPromotion = data.package.price_promo.month;
      let yearlyStandardPrice = data.package.price.total;
      let yearlyPromoPrice = data.package.price_promo.total;

      // Hero Section Offer On Home Page

      try {
        percentDiscount.textContent = `-${discountPercentage}%`;
        regularPrice.textContent = `${yearlyStandardPrice}`;
        promotionPrice.textContent = `${yearlyPromoPrice} zł / pierwszy rok`;
      } catch (er) {}

      document.title = `Sklep internetowy - Załóż sklep online z Shoper od ${monthlyPromotion} zł / miesiąc`;

      $(promoPriceSelector).text(` ${monthlyPromotion} `);

      $(dailyPromo).text(`Sklep internetowy ${discountPercentage} % taniej - Już od ${monthlyPromotion} zł miesięcznie!`);

      $(navbarPromo).text(`Stwórz własny sklep internetowy już od ${monthlyPromotion} zł miesięcznie`);

      $(promoTitleSelector).text(`Roczny abonament sklepu ponad ${discountPercentage} taniej`);
      $(oldPriceYear).text(`${yearlyStandardPrice}`);
      $(newPriceYear).text(`${yearlyPromoPrice}`);

      let time = 0;
      // Update the count down every 1 second
      var x = setInterval(function () {
        // Find the distance between now and the count down date
        time++;
        let distance = data.timeleft - time;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor(distance / (60 * 60));
        var minutes = Math.floor((distance - hours * (60 * 60)) / 60);
        var seconds = Math.floor(distance - hours * 60 * 60 - minutes * 60);

        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        // Display the result in the element with id="demo"
        $(promoTimeSelector).text("00:" + hours + ":" + minutes + ":" + seconds);

        // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
          $(promoTimeSelector).text("EXPIRED");
        }
      }, 1000);

      setTimeout(() => {
        $("[app='promo_banner']").css({
          opacity: 1,
          transform: "translate3d(0px, 0px, 0px)",
        });
      }, 1000);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log("error");
    },
  });
});

let phoneInputValue,
  nipValue,
  emailValue,
  urlValue,
  firstNameValue,
  lastNameValue,
  companyValue,
  formWrapper,
  emailInput,
  firstNameInput,
  lastNameInput,
  urlInput,
  phoneInput,
  textArea,
  bodyValue,
  outcomeOne,
  outcomeTwo,
  outcomeThree;
let errorBorderColor = `1px solid #eb4826`;
let initialBorderColor = `1px solid #898989`;

/* Regexes start here */

function useRegexFirstName(firstNameValue) {
  let regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  return regex.test(firstNameValue);
}
function useRegexLastName(lastNameValue) {
  let regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  return regex.test(lastNameValue);
}

function useRegexPhone(phoneInputValue) {
  let regex = /^\d\d\d\d\d\d\d\d\d$/;
  return regex.test(phoneInputValue);
}

function useRegexNip(nipValue) {
  let regex = /^\d\d\d\d\d\d\d\d\d\d$/;
  return regex.test(nipValue);
}

function useRegexEmail(emailValue) {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  return regex.test(emailValue);
}

function useRegexUrl(urlValue) {
  let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(urlValue);
}

function useRegexHost(hostValue) {
  let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,15}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(hostValue);
}

/* Regexes end here */

/* Functions start here */

function checkFirstNameBlur() {
  firstNameValue = firstNameInput.value;
  let errorBoxFirstName = firstNameInput.nextElementSibling;
  if (firstNameValue === "") {
    firstNameInput.style.border = errorBorderColor;
    errorBoxFirstName.style.display = "flex";
    errorBoxFirstName.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexFirstName(firstNameValue)) {
    firstNameInput.style.border = errorBorderColor;
    errorBoxFirstName.style.display = "flex";
    errorBoxFirstName.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexFirstName(firstNameValue)) {
    firstNameInput.style.border = initialBorderColor;
    errorBoxFirstName.style.display = "none";
    return true;
  }
}
function checkLastNameBlur() {
  lastNameValue = lastNameInput.value;
  let errorBoxLastName = lastNameInput.nextElementSibling;
  if (lastNameValue === "") {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
    errorBoxLastName.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexLastName(lastNameValue)) {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
    errorBoxLastName.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexLastName(lastNameValue)) {
    lastNameInput.style.border = initialBorderColor;
    errorBoxLastName.style.display = "none";
    return true;
  }
}

function checkCompanyNameBlur() {
  companyValue = companyNameInput.value;
  let errorBoxCompany = companyNameInput.nextElementSibling;
  if (companyValue === "") {
    companyNameInput.style.border = errorBorderColor;
    errorBoxCompany.style.display = "flex";
    errorBoxCompany.children[1].textContent = "To pole jest wymagane";
  } else {
    companyNameInput.style.border = initialBorderColor;
    errorBoxCompany.style.display = "none";
  }
}

function checkNipBlur() {
  nipValue = nipInput.value;
  let errorBoxNip = nipInput.nextElementSibling;
  if (nipValue === "") {
    nipInput.style.border = errorBorderColor;
    errorBoxNip.style.display = "flex";
    errorBoxNip.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexNip(nipValue)) {
    nipInput.style.border = errorBorderColor;
    errorBoxNip.style.display = "flex";
    errorBoxNip.children[1].textContent = "Podaj poprawny numer NIP składający się z 10 cyfr bez znaków specjalnych";
    return false;
  } else if (useRegexNip(nipValue)) {
    nipInput.style.border = initialBorderColor;
    errorBoxNip.style.display = "none";
    return true;
  }
}

function checkEmailBlurTrialStepOne(n) {
  emailValue = n.value;
  let errorBoxEmail = n.nextElementSibling;
  if (emailValue === "") {
    n.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "To pole jest wymagane";
    result = false;
    return false;
  } else if (!useRegexEmail(emailValue)) {
    n.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
    result = false;
    return false;
  } else if (useRegexEmail(emailValue)) {
    n.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
    result = true;
    return true;
  }
}

function checkPhoneBlurTrialStepTwo(n) {
  phoneInputValue = n.value;
  let errorBoxPhone = n.nextElementSibling;
  if (phoneInputValue === "") {
    n.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "To pole jest wymagane";
    result = false;
    return false;
  } else if (!useRegexPhone(phoneInputValue)) {
    n.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "Podaj poprawny numer telefonu składający się z 9 cyfr bez znaków specjalnych";
    result = false;
    return false;
  } else if (useRegexPhone(phoneInputValue)) {
    n.style.border = initialBorderColor;
    errorBoxPhone.style.display = "none";
    result = true;
    return true;
  }
}

function checkEmailBlur() {
  emailValue = emailInput.value;
  let errorBoxEmail = emailInput.nextElementSibling;
  if (emailValue === "") {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexEmail(emailValue)) {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexEmail(emailValue)) {
    emailInput.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
    return true;
  }
}

function checkPhoneBlur() {
  phoneInputValue = phoneInput.value;
  let errorBoxPhone = phoneInput.nextElementSibling;
  if (phoneInputValue === "") {
    phoneInput.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexPhone(phoneInputValue)) {
    phoneInput.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "Podaj poprawny numer telefonu składający się z 9 cyfr bez znaków specjalnych";
    return false;
  } else if (useRegexPhone(phoneInputValue)) {
    phoneInput.style.border = initialBorderColor;
    errorBoxPhone.style.display = "none";
    return true;
  }
}

function checkUrlBlur() {
  urlValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;
  if (urlValue === "") {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexUrl(urlValue)) {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexUrl(urlValue)) {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  }
}
function checkUrlBlurNonRequired() {
  urlValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;
  if (urlValue === "") {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    // errorBoxUrl.children[1].textContent = "To pole jest wymagane";
    return true;
  } else if (!useRegexUrl(urlValue)) {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexUrl(urlValue)) {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  }
}

function checkHostBlur() {
  hostValue = hostInput.value;
  let errorBoxUrl = hostInput.nextElementSibling;
  if (hostValue === "") {
    hostInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "To pole jest wymagane";
    return false;
  } else if (!useRegexHost(hostValue)) {
    hostInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexHost(hostValue)) {
    hostInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  }
}

function checkUrlBlurRegex() {
  urlValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;

  if (urlValue === "") {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  } else if (!useRegexUrl(urlValue)) {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    return false;
  } else if (useRegexUrl(urlValue)) {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    return true;
  }
}

function checkTextAreaBlur() {
  textAreaValue = textArea.value;
  let errorBoxArea = textArea.nextElementSibling;

  if (textAreaValue === "") {
    textArea.style.border = errorBorderColor;
    errorBoxArea.style.display = "flex";
    errorBoxArea.children[1].textContent = "To pole jest wymagane";
    return false;
  } else {
    textArea.style.border = initialBorderColor;
    errorBoxArea.style.display = "none";
    return true;
  }
}

// Function where are more than one form on one useRegexFirstName

function checkMailBlurTwo() {
  emailValue = this.value;
  let errorBoxEmail = this.nextElementSibling;
  if (emailValue === "") {
    this.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "To pole jest wymagane";
    outcomeOne = false;
    return false;
  } else if (!useRegexEmail(emailValue)) {
    this.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
    outcomeOne = false;
    return false;
  } else if (useRegexEmail(emailValue)) {
    this.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
    outcomeOne = true;
    return true;
  }
}

function checkPhoneBlurTwo() {
  phoneInputValue = this.value;
  let errorBoxPhone = this.nextElementSibling;
  if (phoneInputValue === "") {
    this.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "To pole jest wymagane";
    outcomeTwo = false;
    return false;
  } else if (!useRegexPhone(phoneInputValue)) {
    this.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "Podaj poprawny numer telefonu składający się z 9 cyfr bez znaków specjalnych";
    outcomeTwo = false;
    return false;
  } else if (useRegexPhone(phoneInputValue)) {
    this.style.border = initialBorderColor;
    errorBoxPhone.style.display = "none";
    outcomeTwo = true;
    return true;
  }
}

function checkUrlBlurTwo() {
  urlValue = this.value;
  let errorBoxUrl = this.nextElementSibling;
  if (urlValue === "") {
    this.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "To pole jest wymagane";
    outcomeThree = false;
    return false;
  } else if (!useRegexUrl(urlValue)) {
    this.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    outcomeThree = false;
    return false;
  } else if (useRegexUrl(urlValue)) {
    this.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    outcomeThree = true;
    return true;
  }
}
function checkUrlBlurTwoNonRequired() {
  urlValue = this.value;
  let errorBoxUrl = this.nextElementSibling;
  if (urlValue === "") {
    this.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    // errorBoxUrl.children[1].textContent = "To pole jest wymagane";
    outcomeThree = true;
    return false;
  } else if (!useRegexUrl(urlValue)) {
    this.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
    outcomeThree = false;
    return false;
  } else if (useRegexUrl(urlValue)) {
    this.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
    outcomeThree = true;
    return true;
  }
}

/* Functions end here */

let gclidInput, gclidValue, fbclidInput, fbclidValue, regexp, regexpFb, locationG, locationGFb, match, matchFb;
let analyticsId;
let analyticsIdInputValue = document.querySelector("[name='analitycs_id']");
let isFromBanner = false;
let client_id;
let loader;

// gclid

regexp = /(?<gclid>(?<=gclid=).*?(?=&|\\s|$))/gm;
locationG = window.location.search;
match = locationG.match(regexp);

if (match !== null) {
  let splited = match[0].split("=");
  if (splited[0] !== "") {
    gclidValue = match[0];
    localStorage.setItem("gclid", gclidValue);
    gclidInput = document.querySelector("[name='adwords[gclid]']");
    gclidInput.setAttribute("value", gclidValue);
  } else if (localStorage.gclid === undefined) {
    gclidValue = "";
    gclidInput = document.querySelector("[name='adwords[gclid]']");
    gclidInput.setAttribute("value", gclidValue);
  }
} else if (localStorage.gclid !== "undefined") {
  gclidValue = localStorage.gclid;
  gclidInput = document.querySelector("[name='adwords[gclid]']");
  gclidInput.setAttribute("value", gclidValue);
}

if (localStorage.gclid === undefined) {
  gclidValue = "";
  gclidInput = document.querySelector("[name='adwords[gclid]']");
  gclidInput.setAttribute("value", gclidValue);
}

// fbclid

regexpFb = /(?<fbclid>(?<=fbclid=).*?(?=&|\\s|$))/gm;
locationGFb = window.location.search;
matchFb = locationGFb.match(regexpFb);
if (matchFb !== null) {
  let splited = matchFb[0].split("=");
  if (splited[0] !== "") {
    fbclidValue = matchFb[0];
    localStorage.setItem("fbclid", fbclidValue);
    fbclidInput = document.querySelector("[name='adwords[fbclid]']");
    fbclidInput.setAttribute("value", fbclidValue);
  } else if (localStorage.fbclid === undefined) {
    fbclidValue = "";
    fbclidInput = document.querySelector("[name='adwords[fbclid]']");
    fbclidInput.setAttribute("value", fbclidValue);
  }
} else if (localStorage.fbclid !== "undefined") {
  fbclidValue = localStorage.fbclid;
  fbclidInput = document.querySelector("[name='adwords[fbclid]']");
  fbclidInput.setAttribute("value", fbclidValue);
}

if (localStorage.fbclid === undefined) {
  fbclidValue = "";
  fbclidInput = document.querySelector("[name='adwords[fbclid]']");
  fbclidInput.setAttribute("value", fbclidValue);
}

var intervalId = window.setTimeout(function () {
  try {
    const tracker = ga.getAll()[0];
    analyticsId = tracker.get("clientId");
    return analyticsId;
  } catch (err) {}
}, 2000);

let trialStepOneEmailInputs = document.querySelectorAll("[app='create_trial_step1'] [app='email']");
emailInput = document.querySelector("[app='email']");
let trialOpenButton = document.querySelectorAll("[app='open_trial_modal_button']");
let trialStepOneModal = document.querySelector("[app='create_trial_step1_modal']");

// beforeunload
// formAbandon
let inputVals;
let inputValsArr = [];
let inputValsArrFiltered;
let elementId;
let result;

window.addEventListener("beforeunload", () => {
  trialStepOneEmailInputs.forEach((n) => {
    inputVals = n.value;
    let element = document.querySelector("[app='create_trial_step1']");
    elementId = element.getAttribute("app");
    inputValsArr.push(inputVals);
    inputValsArrFiltered = inputValsArr.filter((el) => el.length > 1);
  });

  if (inputValsArrFiltered.length > 0 && window.dataLayer) {
    data = {
      event: "formAbandon",
      formId: elementId,
      eventHistory: window.history,
    };

    dataLayer.push(data);
  }
});

trialOpenButton.forEach((n) => {
  n.addEventListener("click", () => {
    trialStepOneModal.classList.add("modal--open");
    $(document.body).css("overflow", "hidden");
  });
});

trialStepOneEmailInputs.forEach((n) => {
  // Control Blur Step One
  n.addEventListener("blur", function () {
    checkEmailBlurTrialStepOne(n);

    let data;
    let element = document.querySelector("[app='create_trial_step1']");

    let elementId = element.getAttribute("app");

    if (window.dataLayer) {
      data = {
        event: "controlBlur",
        formId: elementId,
        controlName: n.getAttribute("app"),
        controlType: n.type,
        controlValue: n.value,
      };

      dataLayer.push(data);
    }
  });
  // Control Focus Step One
  n.addEventListener("focus", () => {
    let data;
    let element = document.querySelector("[app='create_trial_step1']");
    let elementId = element.getAttribute("app");

    if (window.dataLayer) {
      data = {
        event: "controlFocus",
        formId: elementId,
        controlName: n.getAttribute("app"),
        controlType: n.type,
        controlValue: n.value,
      };

      dataLayer.push(data);
    }
  });
});

let createTrialStepOne = document.querySelectorAll("[app='submit-step-one']");

createTrialStepOne.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let form = e.target.form;

    loader = el.querySelector(".loading-in-button");

    if (result) {
      // loader.style.display = "block"
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: "create_trial_step1",
          email: emailValue,
          analytics_id: analyticsId,
          "adwords[gclid]": gclidInput.value,
          "adwords[fbclid]": fbclidInput.value,
        },
        success: function (data) {
          client_id = data.client_id;

          if (data.code === 2 || data.code === 3) {
            form = el.closest("form");
            let errorInfo = form.parentElement.querySelector(".w-form-fail");
            console.log(form);
            errorInfo.children[0].innerHTML =
              "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.";
            errorInfo.style.display = "block";
            loader.style.display = "none";
          } else if (data.code === 1 || data.status === 1) {
            trialStepOneModal.classList.remove("modal--open");
            let trialDomain = document.querySelector("[app='trial-domain']");
            trialDomain.innerHTML = data.host;
            document.querySelector("[modal='create_trial_step2']").classList.add("modal--open");
            loader.style.display = "none";
            $(document.body).css("overflow", "hidden");

            if (window.dataLayer) {
              data = {
                event: "trial_EmailSubmitted",
                client_id: client_id,
                "shop-id": data.shop_id,
                formId: form.parentElement.getAttribute("app"),
                email: emailValue,
              };

              dataLayer.push(data);

              data = {
                eventName: "formSubmitSuccess",
                formId: form.parentElement.getAttribute("app"),
                eventCategory: "Button form sent",
                eventLabel: window.location.pathname,
                eventType: emailValue,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: form.parentElement.getAttribute("app"),
                eventCategory: "Button form sent",
                eventAction: e.target.form.querySelector("input[type='submit']").value,
                eventType: emailValue,
                eventLabel: window.location.pathname,
              };

              dataLayer.push(data);
            }
          } else {
            // MyTrackEvent Error (Step One)
            if (window.dataLayer) {
              data = {
                eventName: "formSubmitError",
                formId: form.parentElement.getAttribute("app"),
                eventCategory: "Button form error",
                eventAction: e.target.form.querySelector("input[type='submit']").value,
                eventLabel: window.location.pathname,
                eventType: emailValue,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: form.parentElement.getAttribute("app"),
                eventCategory: "Button form error",
                eventAction: e.target.form.querySelector("input[type='submit']").value,
                eventType: emailValue,
                eventLabel: window.location.pathname,
              };

              dataLayer.push(data);
            }
          }
        },
      });
    } else {
    }
  });
});

let inputsStepTwo = document.querySelectorAll("[app='create_trial_step2'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])");
// formAbandon
window.addEventListener("beforeunload", () => {
  inputsStepTwo.forEach((n) => {
    inputVals = n.value;
    let element = document.querySelector("[app='create_trial_step2']");
    elementId = element.getAttribute("app");

    inputValsArr.push(inputVals);
    inputValsArrFiltered = inputValsArr.filter((el) => el.length > 1);
  });

  if (inputValsArrFiltered.length > 0 && window.dataLayer) {
    data = {
      event: "formAbandon",
      formId: elementId,
      eventHistory: window.history,
    };

    dataLayer.push(data);
  }
});

inputsStepTwo.forEach((n) => {
  // Control Blur Step Two
  n.addEventListener("blur", function () {
    checkPhoneBlurTrialStepTwo(n);
    let data;
    let element = document.querySelector("[data-name='create_trial_step2']");
    let elementId = element.id;

    if (window.dataLayer) {
      data = {
        event: "controlBlur",
        formId: elementId,
        controlName: n.getAttribute("data-name"),
        controlType: n.type,
        controlValue: n.value,
      };

      dataLayer.push(data);
    }
  });
  // Control Focus Step Two
  n.addEventListener("focus", () => {
    let data;
    let element = document.querySelector("[data-name='create_trial_step2']");
    let elementId = element.getAttribute("data-name");

    if (window.dataLayer) {
      data = {
        event: "controlFocus",
        formId: elementId,
        controlName: n.getAttribute("data-name"),
        controlType: n.type,
        controlValue: n.value,
      };

      dataLayer.push(data);
    }
  });
});

let createTrialStepTwo = document.querySelectorAll("[app='create_trial_step2']");

// On submit actions start here

createTrialStepTwo.forEach((n) => {
  n.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (result) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: "create_trial_step2",
          phone: n.querySelector("[app='phone']").value,
          eventName: "formSubmitSuccess",
          formId: n.querySelector("form").id,
          "adwords[gclid]": gclidInput.value,
          "adwords[fbclid]": fbclidInput.value,
          blackFridayBanner: isFromBanner,
          analytics_id: analyticsId,
        },
        success: function (data) {
          if (data.status === 1) {
            // MyTrackEvent Success (Step Two)
            let errorInfo = n.querySelector(".w-form-fail");

            errorInfo.style.display = "none";
            if (window.dataLayer) {
              data = {
                event: "formSubmitSuccess",
                eventCategory: "Button modal form sent",
                client_id: client_id,
                formId: n.querySelector("form").id,
                "shop-id": data.license_id,
                eventAction: n.querySelector("input[type='submit']").value,
                eventLabel: window.location.pathname,
                eventType: n.querySelector("input[type='tel']").value,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: n.querySelector("form").id,
                eventCategory: "Button modal form sent",
                eventAction: n.querySelector("input[type='submit']").value,
                eventType: n.querySelector("input[type='tel']").value,
                eventLabel: window.location.pathname,
              };

              dataLayer.push(data);
              //             console.log(dataLayer);
            }
            window.location.href = "https://www.shoper.pl/zaloz-sklep/";
          } else {
            //            console.log(data);
            let errorInfo = n.querySelector(".w-form-fail");
            errorInfo.children[0].innerHTML = "Coś poszło nie tak. Spróbuj ponownie.";
            errorInfo.style.display = "block";
            // MyTrackEvent Error (Step Two)
            if (window.dataLayer) {
              data = {
                event: "formSubmitError",
                formId: n.querySelector("form").id,
                eventCategory: "Button modal form error",
                eventAction: n.querySelector("input[type='submit']").value,
                eventLabel: window.location.pathname,
                eventType: n.querySelector("input[type='tel']").value,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: n.querySelector("form").id,
                eventCategory: "Button modal form error",
                eventAction: n.querySelector("input[type='submit']").value,
                eventType: n.querySelector("input[type='tel']").value,
                eventLabel: window.location.pathname,
              };

              dataLayer.push(data);
              //             console.log(dataLayer);
            }
          }
        },
      });
    } else {
    }
  });
});


!(function (e) {
  "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (module.exports = e())
    : (window.wNumb = e());
})(function () {
  "use strict";
  var o = [
    "decimals",
    "thousand",
    "mark",
    "prefix",
    "suffix",
    "encoder",
    "decoder",
    "negativeBefore",
    "negative",
    "edit",
    "undo",
  ];
  function w(e) {
    return e.split("").reverse().join("");
  }
  function h(e, t) {
    return e.substring(0, t.length) === t;
  }
  function f(e, t, n) {
    if ((e[t] || e[n]) && e[t] === e[n]) throw new Error(t);
  }
  function x(e) {
    return "number" == typeof e && isFinite(e);
  }
  function n(e, t, n, r, i, o, f, u, s, c, a, p) {
    var d,
      l,
      h,
      g = p,
      v = "",
      m = "";
    return (
      o && (p = o(p)),
      !!x(p) &&
        (!1 !== e && 0 === parseFloat(p.toFixed(e)) && (p = 0),
        p < 0 && ((d = !0), (p = Math.abs(p))),
        !1 !== e &&
          (p = (function (e, t) {
            return (
              (e = e.toString().split("e")),
              (+(
                (e = (e = Math.round(+(e[0] + "e" + (e[1] ? +e[1] + t : t))))
                  .toString()
                  .split("e"))[0] +
                "e" +
                (e[1] ? e[1] - t : -t)
              )).toFixed(t)
            );
          })(p, e)),
        -1 !== (p = p.toString()).indexOf(".")
          ? ((h = (l = p.split("."))[0]), n && (v = n + l[1]))
          : (h = p),
        t && (h = w((h = w(h).match(/.{1,3}/g)).join(w(t)))),
        d && u && (m += u),
        r && (m += r),
        d && s && (m += s),
        (m += h),
        (m += v),
        i && (m += i),
        c && (m = c(m, g)),
        m)
    );
  }
  function r(e, t, n, r, i, o, f, u, s, c, a, p) {
    var d,
      l = "";
    return (
      a && (p = a(p)),
      !(!p || "string" != typeof p) &&
        (u && h(p, u) && ((p = p.replace(u, "")), (d = !0)),
        r && h(p, r) && (p = p.replace(r, "")),
        s && h(p, s) && ((p = p.replace(s, "")), (d = !0)),
        i &&
          (function (e, t) {
            return e.slice(-1 * t.length) === t;
          })(p, i) &&
          (p = p.slice(0, -1 * i.length)),
        t && (p = p.split(t).join("")),
        n && (p = p.replace(n, ".")),
        d && (l += "-"),
        "" !== (l = (l += p).replace(/[^0-9\.\-.]/g, "")) &&
          ((l = Number(l)), f && (l = f(l)), !!x(l) && l))
    );
  }
  function i(e, t, n) {
    var r,
      i = [];
    for (r = 0; r < o.length; r += 1) i.push(e[o[r]]);
    return i.push(n), t.apply("", i);
  }
  return function e(t) {
    if (!(this instanceof e)) return new e(t);
    "object" == typeof t &&
      ((t = (function (e) {
        var t,
          n,
          r,
          i = {};
        for (
          void 0 === e.suffix && (e.suffix = e.postfix), t = 0;
          t < o.length;
          t += 1
        )
          if (void 0 === (r = e[(n = o[t])]))
            "negative" !== n || i.negativeBefore
              ? "mark" === n && "." !== i.thousand
                ? (i[n] = ".")
                : (i[n] = !1)
              : (i[n] = "-");
          else if ("decimals" === n) {
            if (!(0 <= r && r < 8)) throw new Error(n);
            i[n] = r;
          } else if (
            "encoder" === n ||
            "decoder" === n ||
            "edit" === n ||
            "undo" === n
          ) {
            if ("function" != typeof r) throw new Error(n);
            i[n] = r;
          } else {
            if ("string" != typeof r) throw new Error(n);
            i[n] = r;
          }
        return (
          f(i, "mark", "thousand"),
          f(i, "prefix", "negative"),
          f(i, "prefix", "negativeBefore"),
          i
        );
      })(t)),
      (this.to = function (e) {
        return i(t, n, e);
      }),
      (this.from = function (e) {
        return i(t, r, e);
      }));
  };
});

//# sourceMappingURL=app.js.map
