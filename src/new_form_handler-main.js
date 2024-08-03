const API_URL_ADDRESS = "https://backend.webflow.prod.shoper.cloud";

validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\d{9}$/,
    text: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+$/,
    nip: /^\d{10}$/,
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    zipcode: /^(\d{5}|\d{2}-\d{3})$/,
    address: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ðŚś ,.'-]+(\s+\d+(\s*[a-zA-Z])?(\s*\/\s*\d+)?)?$/,
};

const errorMessages = {
    email: "Podaj poprawny adres e-mail.",
    phone: "Podaj poprawny numer telefonu składający się z 9 cyfr bez znaków specjalnych.",
    text: "Podaj poprawne dane.",
    nip: "Podaj poprawny numer NIP",
    url: "Podaj poprawny adres URL.",
    zipcode: "Podaj poprawny kod pocztowy",
    default: "To pole jest wymagane"
};

const omittedAttributes = new Set(["method", "name", "id", "class", "aria-label", "fs-formsubmit-element", "wf-page-id", "wf-element-id", "autocomplete", "layer"]);

function validateInput($input) {
    const value = $input.val().trim();
    const isRequired = $input.prop('required');
    const isDisabled = $input.prop('disabled');
    const isActive = $input.hasClass('active');
    const isOldStructure = !$input.siblings('.new__input-label').length;
    const inputType = $input.data('type') || $input.attr('type');

    $input.removeClass('invalid error');

    if (isActive || isDisabled) {
        $input.siblings('.error-box, [class*="error-wrapper"]').hide();
        return false;
    }

    if (isRequired && (value === '' || (isOldStructure && inputType === 'checkbox' && !$input.prop('checked')))) {
        showError($input, errorMessages.default, isOldStructure, true);
        return true;
    }

    if (value !== '' && validationPatterns[inputType] && !validationPatterns[inputType].test(value)) {
        showError($input, errorMessages[inputType] || errorMessages.default, isOldStructure, false);
        return true;
    }

    hideError($input, isOldStructure);
    return false;
}

function showError($input, message, isOldStructure, isRequiredError) {
    $input.addClass('invalid');
    if (isOldStructure) {
        const $errorWrappers = $input.siblings('.form-input__error-wrapper');
        $errorWrappers.hide();
        $errorWrappers.eq(isRequiredError ? 1 : 0).css('display', 'flex');
        $input.attr('type') === 'checkbox' ? $input.prev('.form-checkbox-icon').addClass('error') : $input.addClass('error');
    } else {
        let $errorBox = $input.siblings('.error-box');
        if ($errorBox.length === 0) {
            $errorBox = $('<span class="error-box"></span>').insertAfter($input);
        }
        $errorBox.text(message).show();
    }
}

function hideError($input, isOldStructure) {
    if (isOldStructure) {
        $input.siblings('.form-input__error-wrapper').hide();
        $input.attr('type') === 'checkbox' ? $input.prev('.form-checkbox-icon').removeClass('error') : $input.removeClass('error');
    } else {
        $input.siblings('.error-box').hide();
    }
}

function handleBlur(event) {
    const $element = $(event.target);
    $element.data("touched", true).removeClass('active');

    validateInput($element);

    if (!$element.siblings('.new__input-label').length) return;

    const $label = $element.siblings('.new__input-label');
    $label.removeClass('active');
    if ($element.val()) {
        $label.addClass('valid');
    } else {
        $label.removeClass('valid');
        $element.attr('placeholder', $element.data('initial-placeholder'));
    }
}

function initializeInputs() {
    $("input, textarea").each(function() {
        const $element = $(this);
        $element.data("touched", false);
        const isOldStructure = !$element.siblings('.new__input-label').length;

        if (!isOldStructure) {
            $element.data('initial-placeholder', $element.attr('placeholder'));

            $element.on({
                focus: function() {
                    const $label = $(this).siblings('.new__input-label');
                    $(this).addClass('active').removeClass('invalid').attr('placeholder', '');
                    $label.addClass('active').removeClass('invalid valid');
                    $(this).siblings('.error-box').hide();
                },
                input: function() {
                    const $label = $(this).siblings('.new__input-label');
                    const hasValue = $(this).val().length > 0;
                    $label.toggleClass('active', hasValue);
                    $(this).attr('placeholder', hasValue ? '' : $(this).data('initial-placeholder'));
                    if ($(this).hasClass('invalid')) {
                        validateInput($(this));
                    }
                },
                mouseenter: function() {
                    $(this).siblings('.new__input-label').addClass('hover');
                },
                mouseleave: function() {
                    $(this).siblings('.new__input-label').removeClass('hover');
                }
            });

            // Initial state check
            const $label = $element.siblings('.new__input-label');
            if ($element.val()) {
                $label.addClass('active');
                $element.attr('placeholder', '');
            } else {
                $label.removeClass('active');
                $element.attr('placeholder', $element.data('initial-placeholder'));
            }
        }

        $element.on("blur", handleBlur);
    });
}

function validateForm(formElement) {
    const $inputs = $(formElement).find("input:not([type='submit']):not([data-exclude='true']):not(:disabled), textarea:not([data-exclude='true']):not(:disabled), select:not([data-exclude='true']):not(:disabled)");
    return $inputs.filter(function() {
        return !$(this).closest('[data-element]').hasClass('hide') && validateInput($(this));
    }).length;
}

function sendFormDataToURL(formElement) {
    const formData = new FormData();
    const $form = $(formElement);

    // Add form attributes
    Array.from(formElement.attributes).forEach(({ name, value }) => {
        const attributeName = name.replace("data-", "");
        if (value && !omittedAttributes.has(attributeName)) {
            formData.append(attributeName, value);
        }
    });

    // Add form inputs
    const $inputs = $form.find("input:not([type='submit']):enabled:not([data-exclude='true']), textarea:enabled, select:enabled");
    const outputValues = {};
    const binaryCheckboxActions = new Set(["loan_decision_contact", "external_ads_terms", "simple_form", "register_reseller"]);

    $inputs.each(function () {
        const $input = $(this);
        const name = $input.attr("name");
        const type = $input.attr("type");
        const dataForm = $input.attr("data-form") || name;

        if (type === "radio") {
            if ($input.is(":checked")) {
                outputValues[dataForm] = $input.val();
            }
        } else if (type === "checkbox") {
            const checkboxBinary = binaryCheckboxActions.has($form.attr("data-action"));
            if (checkboxBinary) {
                outputValues[dataForm] = $input.is(":checked") ? "1" : "0";
            } else if ($input.is(":checked")) {
                if (!outputValues[dataForm]) outputValues[dataForm] = [];
                outputValues[dataForm].push($input.next().text().replace(/[^\u0000-\u007F\u0100-\u017F]+/g, "").trim());
            }
        } else {
            const value = $input.val().trim();
            if (value) outputValues[dataForm] = value;
        }
        
    });

    // Append outputValues to formData
    Object.entries(outputValues).forEach(([key, value]) => {
        formData.append(key, Array.isArray(value) ? value.join(', ') : value);
    });

    $.ajax({
        type: "POST",
        url: API_URL_ADDRESS,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: () => {
            if (typeof loader !== 'undefined' && loader.show) loader.show();
        },
        complete: () => {
            if (typeof loader !== 'undefined' && loader.hide) loader.hide();
        },
        success: (data) => {
            if (formData.has("host")) {
                if (data.status === 1) {
                    console.log(data);
                    $form.siblings(".error-admin").hide();
                    window.location.href = data.redirect;  // Redirect to the URL from the response
                } else {
                    $form.siblings(".error-admin").show();
                }
                return;
            }

            // Separate handling for trial step 3 form
            if ($form.data('name') === 'create_trial_step3' && data.status === 1) {
                window.location.href = data.redirect;
                return;
            }

            if (data.status !== 0) {
                $form.hide().next().show();
                $(document).trigger("submitSuccess", $form);
            } else {
                $(document).trigger("submitError", $form);
            }
        },
        error: () => {
            $form.siblings(".error-message").show();
        }
    });
}

function handleSubmitClick(e) {
    e.preventDefault();
    const $form = $(this).closest("form");
    const errors = validateForm($form[0]);
    if (errors > 0) {
        sendDataLayer({
            event: "myTrackEvent",
            eventCategory: "Button modal form error",
            eventAction: $(this).val(),
            eventLabel: window.location.href,
            eventType: $form.attr("data-label") || "consult-form",
        });
    } else {
        sendFormDataToURL($form[0]);
    }
}

function initializeEventListeners() {
    $("[data-form='submit']").on("click", handleSubmitClick);

    $("[data-app^='open_'], [data-element^='open_']").on("click", function() {
        const dataValue = $(this).data("app") || $(this).data("element");
        const triggerName = dataValue.replace(/^open_|_modal_button$/g, "");
        const $modal = $(`[data-app='${triggerName}'], [data-element='${triggerName}']`);
    
        $modal.addClass("modal--open");
        $(document.body).addClass("overflow-hidden");
    
        const $form = $modal.find("form:first");
        if ($form.length > 0) {
            $form.find(":input:enabled:visible:first").focus();
        }
    });
    

    $("[fs-formsubmit-element='reset']").on("click", () => $(".loading-in-button").hide());

    $(document).on("submitSuccess submitError", (e, formElement) => {
        sendDataLayer({
            event: "myTrackEvent",
            eventCategory: `Button modal form ${e.type === "submitSuccess" ? "sent" : "error"}`,
            eventAction: $(formElement).find('[type="submit"]').val(),
            eventType: $(formElement).attr("data-label"),
            eventLabel: window.location.href,
        });
    });
}

function cleanObject(obj = {}) {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value != null && value !== ""));
}

function sendDataLayer(obj = {}) {
    const cleanedObj = cleanObject(obj);
    if (window.dataLayer) {
        dataLayer.push(cleanedObj);
    }
}

// Initialize everything when the document is ready
$(document).ready(() => {
    initializeInputs();
    initializeEventListeners();
});

// push to netlify