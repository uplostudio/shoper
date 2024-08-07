// step_one.js

$(document).ready(() => {
    let ajaxRequest;
    let currentSID = null;

    const generateErrorMessage = type => {
        const messages = {
            email: "Podaj poprawny adres e-mail.",
            required: "To pole jest wymagane."
        };
        return messages[type] || messages.required;
    };

    const validateEmail = ($field) => {
        const email = $field.val().trim();
        const emailRegex = SharedUtils.EMAIL_REGEX || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let error = null;

        if (!email) {
            error = generateErrorMessage('required');
        } else if (!emailRegex.test(email)) {
            error = generateErrorMessage('email');
        }

        $field.next('.error-box').remove();

        if (error) {
            $field.after(`<span class="error-box">${error}</span>`);
            $field.removeClass('valid').addClass('invalid');
            $field.siblings('.new__input-label').removeClass('valid active').addClass('invalid');
        } else {
            $field.removeClass('invalid').addClass('valid');
            $field.siblings('.new__input-label').removeClass('invalid').addClass('valid');
        }

        return error;
    };

    const handleFormSubmission = (e, $form) => {
        e.preventDefault();
        const $emailField = $form.find('[data-type="email"]');
        if (validateEmail($emailField))
            return;

        const $wFormFail = $form.next().next();
        const $loader = $form.find(".loading-in-button.is-inner");
        $loader.show();

        if (ajaxRequest && ajaxRequest.abort) {
            ajaxRequest.abort();
        }

        const formData = {
            action: $form.data('action'),
            email: $emailField.val(),
            "adwords[gclid]": window.myGlobals.gclidValue,
            "adwords[fbclid]": window.myGlobals.fbclidValue,
            analyticsId: window.myGlobals.analyticsId,
            affiliant: $form.data('affiliant') || "",
            ...DataLayerGatherers.getValueTrackData()
        };

        // Check for SID in localStorage, parse it, and add its value to formData if present
        const localStorageSID = localStorage.getItem('sid');
        if (localStorageSID) {
            try {
                const parsedSID = JSON.parse(localStorageSID);
                if (parsedSID.value) {
                    formData.sid = parsedSID.value;
                }
            } catch (e) {
                console.error("Failed to parse SID from localStorage:", e);
            }
        }

        if (currentSID) {
            formData.sid = currentSID;
        }

        ajaxRequest = $.ajax({
            url: SharedUtils.API_URL,
            method: 'POST',
            timeout: 30000,
            data: formData
        });

        ajaxRequest.then(response => {
            SharedUtils.handleResponse(response, $form, $emailField, $wFormFail, true, 1);
            $(document).trigger('trialStepComplete', [1, response]);
        }).catch(error => {
            SharedUtils.handleResponse(error, $form, $emailField, $wFormFail, false, 1);
        }).always(() => {
            $loader.hide();
            ajaxRequest = null;
        });
    };

    const setupValidation = () => {
        $(document).on('blur', '[data-action="create_trial_step1"] [data-type="email"]', function () {
            validateEmail($(this));
        });

        $(document).on('keydown', '[data-action="create_trial_step1"] [data-type="email"]', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFormSubmission(e, $(this).closest('form'));
            }
        });

        $(document).on('click', '[data-action="create_trial_step1"] [data-form="submit-step-one"]', function (e) {
            handleFormSubmission(e, $(this).closest('form'));
        });

        $(document).on('submit', '[data-action="create_trial_step1"]', function (e) {
            handleFormSubmission(e, $(this));
        });
    };

    const $openTrialWrapperButton = $("[data-element='open_trial_wrapper']");
    if ($openTrialWrapperButton.length) {
        $openTrialWrapperButton.on('click', () => {
            $trialsWrapper.show();
            $("body").addClass("overflow-hidden");
        });
    }

    const $closeTrialWrapperButton = $("[data-element='close_trial_wrapper']");
    if ($closeTrialWrapperButton.length) {
        $closeTrialWrapperButton.on('click', () => {
            $trialsWrapper.hide();
            $("body").removeClass("overflow-hidden");
        });
    }

    $(document).on('trialStepComplete', function (event, completedStep, data) {
        if (completedStep === 1) {
            $trialsWrapper.show();
            const $modalTrialOne = $('[data-element="modal_trial_one"]');
            const $modalTrialTwo = $('[data-element="modal_trial_two"]');
            const $modalTrialThree = $('[data-element="modal_trial_three"]');

            if ($modalTrialOne.length) {
                $modalTrialOne.hide();
            }

            if (data.step === "#create_trial_step3") {
                if ($modalTrialTwo.length) {
                    $modalTrialTwo.hide();
                }
                if ($modalTrialThree.length) {
                    $modalTrialThree.show();
                }
            } else {
                if ($modalTrialTwo.length) {
                    $modalTrialTwo.show();
                }
            }

            // Additional actions after successful step 1 completion
            console.log("Step 1 completed successfully");
        }
    });

    setupValidation();
    SharedUtils.checkAndUpdateSID();
    setInterval(SharedUtils.checkAndUpdateSID, 60 * 60 * 1000);

    if (typeof updateAnalytics === 'function') {
        updateAnalytics();
    } else {
        console.warn('updateAnalytics function is not defined');
    }

    const cleanup = () => {
        if (ajaxRequest) {
            ajaxRequest.abort();
        }
        $(document).off('blur', '[data-action="create_trial_step1"] [data-type="email"]');
        $(document).off('keydown', '[data-action="create_trial_step1"] [data-type="email"]');
        $(document).off('click', '[data-action="create_trial_step1"] [data-form="submit-step-one"]');
        $(document).off('submit', '[data-action="create_trial_step1"]');
        $openTrialWrapperButton.off('click');
    };

    const forceReload = () => {
        cleanup();
        requestAnimationFrame(() => {
            window.location.reload(true);
        });
    };

    $(window).on('beforeunload', cleanup);
});

$(document).on('formSubmissionComplete', function (event, isSuccess, $form, $emailField, data) {
    if (isSuccess) {
        DataLayerGatherers.pushTrackEventDataModal(window.myGlobals.clientId, $form.data('action'), window.myGlobals.shopId, $form.data('action'), $emailField.val());
    } else {
        DataLayerGatherers.pushTrackEventError($form.data('action'), $form.find("#label").text(), $emailField.val());
    }
});
