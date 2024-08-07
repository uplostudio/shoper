$(document).ready(function() {
    let state = {
        errors: [],
        phoneRegex: window.validationPatterns.phone, // Use the existing phone regex
    };

    function maskPhoneNumber(phone) {
        return phone.replace(/(\+48)(\d{3})(\d{3})(\d{1})(\d{2})/, '$1 *** *** *$4$5');
    }

    function setupValidation() {
        // select only phone fields in the trial forms
        const phoneFields = $('[data-type="phone"]').filter(function() {
            return $(this).parents('[data-action*="trial"]').length > 0;
        });
        phoneFields.each(function() {
            let phoneField = $(this);

            var iti = window.intlTelInput(phoneField.get(0), {
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
                preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
                autoInsertDialCode: false,
                nationalMode: false,
                separateDialCode: true,
                autoPlaceholder: "off",
                initialCountry: "pl",
            });

            phoneField.on("blur", function() {
                console.log("Phone field blur triggered");
                state.errors = validatePhone(this, state.errors, state.phoneRegex, iti);
            });

            phoneField.on("keydown", function(e) {
                if (e.which === 13) {
                    console.log("Enter key pressed");
                    $(this).trigger("blur");
                    handleFormSubmission(e, phoneField, iti);
                }
            });

            phoneField.closest("form").find('[data-form="submit-step-two"]').on("click", function(e) {
                console.log("Form submit button clicked");
                handleFormSubmission(e, phoneField, iti);
            });
        });
    }

    function validatePhone(field, errors, phoneRegex, iti) {
        errors = [];
        const countryCode = iti.getSelectedCountryData().iso2;
        let phone = iti.getNumber();
        console.log('Validating phone number:', phone);
        
        clearErrors($(field));

        if (!phone) {
            showError($(field), errorMessages.default);
            errors.push(errorMessages.default);
        } else if (countryCode === "pl" && !phoneRegex.test(phone.slice(-9))) { // Check only the last 9 digits
            showError($(field), errorMessages.phone);
            errors.push(errorMessages.phone);
        }

        return errors;
    }

    function showError($field, message) {
        $field.addClass('error');
        let $errorElement = $field.siblings('.error-box');
        if ($errorElement.length === 0) {
            $errorElement = $('<div class="error-box"></div>').insertAfter($field);
        }
        $errorElement.text(message).show();
    }

    function clearErrors($field) {
        $field.removeClass('error');
        $field.siblings('.error-box').hide();
    }

        function handleFormSubmission(e, phoneField, iti) {
            console.log("handleFormSubmission called");
            let form = phoneField.closest("form");
            const wFormFail = form.find(".w-form-fail");
            phoneField.trigger("blur");
            const valueTrack = DataLayerGatherers.getValueTrackData();
            const loader = form.find(".loading-in-button.is-inner");
            const formData = {
                action: "create_trial_step2",
                phone: iti.getNumber(),
                formid: "create_trial_step2",
                "adwords[gclid]": window.myGlobals.gclidValue,
                "adwords[fbclid]": window.myGlobals.fbclidValue,
                analytics_id: window.myGlobals.analyticsId,
                sid: SharedUtils.getCurrentSID()
            };

            if (valueTrack) {
                Object.entries(valueTrack).forEach(([key,value])=>{
                    if (key !== "timestamp") {
                        formData[key] = value;
                    }
                });
            }

            if (state.errors.length === 0) {
                console.log("No validation errors, submitting form");

                const maskedPhoneNumber = maskPhoneNumber(iti.getNumber());
                localStorage.setItem('phoneNumber', maskedPhoneNumber);

                $.ajax({
                    type: "POST",
                    url: SharedUtils.API_URL,
                    data: formData,
                    beforeSend: function() {
                        loader.show();
                    },
                    success: function(data) {
                        console.log("Form submission successful");
                        SharedUtils.handleResponse(data, form, phoneField, wFormFail, true, 2);
                    },
                    error: function(data) {
                        console.log("Form submission failed");
                        SharedUtils.handleResponse(data, form, phoneField, wFormFail, false, 2);
                    },
                    complete: function() {
                        loader.hide();
                    },
                });
            } else {
                console.log("Validation errors:", state.errors);
                e.preventDefault();
            }
        }

    setupValidation();

    $(document).on('trialStepComplete', function(event, completedStep, data) {
        if (completedStep === 2) {
            const $modalTrialTwo = $('[data-element="modal_trial_two"]');
            const $modalTrialThree = $('[data-element="modal_trial_three"]');

            if ($modalTrialTwo.length) {
                $modalTrialTwo.hide();
            }
            if ($modalTrialThree.length) {
                $modalTrialThree.show();
            }

            console.log("Step 2 completed successfully");
            if (data.license_id) {
                console.log("License ID:", data.license_id);
            }
        }
    });
});

$(document).on('formSubmissionComplete', function(event, isSuccess, $form, $phoneField, data) {
    if (isSuccess) {
        DataLayerGatherers.pushTrackEventDataModal(window.myGlobals.clientId, window.myGlobals.shopId, $form.data('action'), $phoneField.val());
    } else {
        DataLayerGatherers.pushTrackEventError($form.data('action'), $form.find("#label").text(), $phoneField.val());
    }
});