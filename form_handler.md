# Form Validation Module Documentation

This JavaScript code provides form validation and AJAX form submission functionality.

## Variables

1. `originalTrigger` - Stores the original click event (source).
2. `error` - Stores the error message for invalid entries.
3. `dataLayer` - An array to store data pushed into Google Tag Manager.
4. `validationPatterns` - Contains regex patterns for input validation. This object has key-value pairs. Each key corresponds to a type of data (like 'email', 'text', 'password', etc.), and each value is a Regular Expression (Regex) that describes a pattern of a valid input for the corresponding type. Each ﻿input field should have a ﻿`data-type` attribute corresponding to the keys in ﻿validationPatterns.
5. `omittedAtributes` - A list of attributes that are not included in the AJAX request.
6. `urlN` - The URL where the AJAX request is sent.

## Main Functions

Here's more detail on the important functions used in the code:

1. `createEnterKeydownHandler(inputElement, submitTriggerElement)` - This function creates a specialized event handler for a specific DOM input field and its associated form submit button `data-form='submit`'. The returned handler function triggers the form submission when the 'Enter' key is pressed in the input field, using a simulated click event on the form's submit button.

2. `validateInput(input)` - This function is dedicated to validating an input field based on its data type and given requirements. The function uses the HTML5 'data-' attributes for type checking and the 'required' attribute to handle required fields. It also manages the error messages and error-related UI based on validation status.

3. `handleBlur(event)` - `handleBlur` is a utility function designed to handle the 'blur' event, which occurs when an input element loses focus. In the event of a blur, this function simply calls `validateInput` with the field that has lost focus, triggering the validation process.

4. `validateForm(formElement)` - This function works as an overarching form validation driver. It iterates over all input fields, validates each of them using `validateInput`, and accumulates the errors. It returns the total count of errors after attempting to validate every field in the given form.

5. `sendFormDataToURL(urlN, formElement, form, loader)` - This function constructs an object of `FormData` class, effectively scraping all relevant inputs from the form and excluding any extraneous attributes defined. It then uses AJAX to send the form data, represented by the `FormData` object, to a specified URL. AJAX success and error responses are catered through callback functions.

6. `handleSubmitClick(e)` - This function operates as an event handler for a form submission. It first stops the default form submission process and then conducts form validation. If validation is successful (i.e., no errors are found), it triggers an AJAX request via `sendFormDataToURL`.

7. `pushDataToDataLayer(formElement, eventCategory)` - This function gathers relevant data that needs to be tracked or used for analytics, packages it into an event object, and pushes this object into `dataLayer` for Google Tag Manager. In the function `pushDataToDataLayer(formElement, eventCategory)`, there is a line `if (formElement.getAttribute("data-layer") !== "true")`. This line essentially acts as a filter or guard to control data push onto the `dataLayer`. The logic operates by grabbing the `data-layer` attribute from the `formElement` using `getAttribute("data-layer")` and checking if the attribute's value isn't "true". If the condition is true (i.e., if `data-layer` attribute is not present or is present but not set to "true"), the function will immediately return and stop executing further, meaning that it will not push event data onto the `dataLayer`.

8. `successResponse(formElement)` and `errorResponse(formElement)` - These functions serve as callbacks for the responses from an AJAX request. They are responsible for performing any UI tasks necessary after form submission and for pushing event tracking objects into `dataLayer` (used for analytics and tracking user behavior data associated with form submissions).

## Event Listeners

The script adds multiple event listeners:

- 'Blur' event on each input field: Triggers the 'blur' event and validates input field.

- 'Keydown' event on each input field: Suppresses the form submission if the 'Enter' keydown event is triggered and clicks the submit button instead.

- 'Click' event on the submit button: Validates and submits form data via AJAX.

- 'Click' event on the reset button: Hides the loading indicator.

## Javascript Functions Breakdown

Detailed overview of key JavaScript functions:

1. `createEnterKeydownHandler(inputElement, submitTriggerElement)` - Listens for 'Enter' key press and triggers a click event on the given submit button.

2. `validateInput(input)` - Validates a form input. Uses the input's 'data-type' to validate and manages error messages.

3. `handleBlur(event)` - Event handler for 'blur' events for input. Utilizes `validateInput` to verify input when the input field loses focus.

4. `validateForm(formElement)` - Iterates over all input fields in the form and validates them, returning the total number of errors.

5. `sendFormDataToURL(urlN, formElement, form, loader)` - Uses AJAX to send a FormData object to a specified URL.

6. `handleSubmitClick(e)` - Event handler for form submission. Initiates form validation and (if valid) sends the form data.

7. `pushDataToDataLayer(formElement, eventCategory)` - Pushes events with tracking information into the Google Tag Manager `dataLayer`.

8. `successResponse(formElement)` and `errorResponse(formElement)` - These are callback functions that are called when the AJAX request succeeds or fails, respectively. Both functions push events into `dataLayer`.

## Event Listeners Overview

Detailing what each event listener does in the script:

- **Blur event on input elements:** Each input field has a 'blur' event listener which calls the `handleBlur` function to initiate field validation.

- **Keydown event on input fields:** Each input field has a 'keydown' event listener which checks for 'Enter' key press. If detected, it prevents default form submission and triggers a submit button click event instead.

- **Click event on submit button:** A 'click' event listener on the form submission button validates the form and sends the form data if no validation errors are found.

- **Click event on reset button:** Resets form by hiding loader indicators on 'click' event.

## Opening a Modal

1. **Button Selection:** Using jQuery, it listens for 'click' events on all HTML elements with a `data-app` attribute starting with 'open*'. The caret '^' in jQuery attribute selector `^=` is used to match elements whose attribute values begin with a specified string. In this case, it's 'open*'.

2. **Click Event Handler:** When a click event occurs on any matched elements, an anonymous function is triggered:

   - **Origin Tracking:** It first saves the jQuery object for the element that was clicked (the 'trigger') into the `originalTrigger` variable.

   - **Trigger Name Processing:** The script then extracts the 'open\_' and '\_modal_button' substrings from the element's `data-app` value using the `replace` method with a regex pattern. This operation gives a cleaned name, which is assigned to `triggerName`.

   - **Modal Opening:** Using this cleaned name, the script identifies the corresponding modal (an element marked with `data-app` attribute value that matches `triggerName`) and adds the class 'modal--open' to it. This class likely makes the modal visible in the user interface.

   - **Body Style Adjustment:** Finally, it adds the class 'overflow-hidden' to the `body` element. This generally disables page scrolling while the modal window is open, thus preventing user interaction with the content in the background.

## Prerequisites

There are several prerequisites you need to fulfill to properly use this code:

1. **jQuery**: The script heavily relies on jQuery, a popular JavaScript library that simplifies tasks such as DOM management and event handling. Make sure to include a reference to jQuery in your HTML file before this script.

2. **Google Tag Manager (GTM)**: The code interacts with GTM through the `dataLayer` global variable. If you plan to use its tracking capabilities, you'll need GTM set up and integrated into your website.

3. **HTML Markup**: The script expects certain HTML conventions:

   - Form elements are decorated with `data-*` attributes, which are used for validation and interaction purposes.
   - Modal elements are identified by `data-app` attributes, and their corresponding buttons are tagged with `data-action="open-modal"` and `data-modal-id`.

4. **CSS**: The script uses CSS classes like `'modal--open'` and `'overflow-hidden'` to manage modal interaction and page style. These classes should be appropriately defined in your CSS file.

5. **Server-side Handling**: The form data is sent via AJAX to a URL. You need server-side setup to receive and process these AJAX requests.

<!-- last updated 1/08/2023 -->
