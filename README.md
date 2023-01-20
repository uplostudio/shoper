# Shoper Web JS

## accordion.js

### Responsibility

Creating Accordions on the page

### Added

Globally

### Requires:

Adding in the footer

```js
new Accordion({
  accordionId: "accordionId",
  style: false,
  oneOpen: true,
}).create();
```

## validation.js

### Responsibility

Checking validation on input fields

### Added

Globally

### Requires:

The actions will be connected to the corresponding buttons that submit the forms

## animations.js

### Responsibility

Webflow Interactions

### Added

Globally

## campaign.js

### Responsibility

API Connection for setting consultation Form on Campaign pages

### Added

Globally

### Requires:

1. Button `[app='open_consultation_modal_button']` to open popup
2. Symbol `modal_campaign`
3. Form `[app='campaign']` (already setup in Webflow Symbol)
4. Inputs:
   `[app='email_campaign']`
   `[app='phone_campaign']`
   `[app='url_campaign']` (already setup in Webflow Symbol)
5. Adding in the footer one of campaign actions: `send_sc_offer` `send_mail` `send_mail_allegro`

```js
document
  .querySelector("[app='campaign']")
  .setAttribute("action", "send_sc_offer");
```

## contact.js

### Responsibility

API Connection for Contact Form

### Added:

Contact Page

### Requires:

1. Form `[app='send_contact']`
2. Inputs:
   `[app='email_campaign']`
   `[app='phone_campaign']`
   `[app='url_campaign']`
   `[app='subject_contact']`
   `[app='body_contact']`
3. Adding in the footer script

```js
<script src="https://shoper-web.netlify.io/contact.js"></script>
```

## login.js

### Responsibility:

API Connection for Login Form

### Added:

Globally

### Requires:

1. Button `[app='open_login_modal_button']` to open popup
2. Symbol `modal_login_and_trialstep1`
3. Form `[app='login']` (already setup in Webflow Symbol)
4. Inputs:
   `[app='host']` (already setup in Webflow Symbol)
5. Adding in the footer text which will appear in Modal/Popup

```js
document.querySelector("[app='modal_login_type']").innerHTML = "kampanię";
```

6. Adding in the footer one of login actions: `get_campaign` `get_inpost` `get_payments_address` `get_admin`

```js
document.querySelector("[app='login']").setAttribute("action", "get_campaign");
```

## navigation.js

- Responsibility: Creating Accordions on the page
- Added: Globally
- Requires:

1. Usign selected classes in the navigation: `.nav` `.nav__menu` `. nav__dropdown` `.nav__dropdown-tab`

## promotion.js

### Responsibility

API Connection for Promotions

### Added:

Home Page

### Requires:

1. Text elements:
   `[app='promo_time']`
   `[app='promo_price']`
   `[app='promo_title']`
2. Adding in the footer script

```js
<script src="https://shoper-web.netlify.io/promotion.js"></script>
```

## trial-step-1.js

### Responsibility:

API Connection for Creating Trial Step 1

### Added:

Globally

### Requires:

If modal is being used:

1. Button `[app='open_trial_modal_button']`
2. Symbol `modal_login_and_trialstep1`

If it's a new form:

3. Form `[app='create_trial_step1']`
4. Inputs:
   `[app='email']`

## trial-step-2.js

### Responsibility:

API Connection for Creating Trial Step 1

### Added:

Globally

### Requires:

If modal is being used:

1. Create Trial Step 1
2. Symbol `modal_trial-step-2`
3. Form `[app='create_trial_step2']` (Already set up in Webflow Symbol)
4. Inputs:
   `[app='phone']`(Already set up in Webflow Symbol)

## regex_patterns.js /work in progress/

### Responisbility:

This file contains all the validation rules that are used on the site. From here, the functions are distributed to all the subpages where the forms are located. On individual subpages, there are no individual functions that both validate data and display individual error boxes. By making changes to this file, we change the operation in all forms.

### Added:

Globally

### Requires:

The intent is that each form is built the same way, using the same attributes next to the fields. The target diagram is below.

| Input name | Attribute           | Variable for Input | Variable for Value | Variable for ErrorBox |
| ---------- | ------------------- | ------------------ | ------------------ | --------------------- |
| email      | `[app='email']`     | emailInput         | emailValue         | errorBoxEmail         |
| phone      | `[app='phone']`     | phoneInput         | phoneValue         | errorBoxPhone         |
| firstName  | `[app='firstName']` | firstNameInput     | firstNameValue     | errorBoxFirstName     |
| lastName   | `[app='lastName']`  | lastNameInput      | lastInputValue     | errorBoxLastName      |
| url        | `[app='url']`       | urlInput           | urlValue           | errorBoxUrl           |
| NIP        | `[app='nip']`       | nipInput           | nipValue           | errorBoxNip           |
| company    | `[app='company']`   | companyNameInput   | companyValue       | errorBoxCompany       |

### Desired structure for each input field

```
<div class="form-field__wrapper">
│   <label class="form-input-label></label>
|   <input [app='xxx']>
|   <div class="form-input__error-wrapper"></div> <-- errorBox
</div>
```

### Patterns Description

| Input name          | Pattern                                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| `[app='email']`     | Most commonly used pattern for valid email addresses                       |
| `[app='phone']`     | 9 digits only. No letters, no special characters.                          |
| `[app='firstName']` | Only letters, no digits, no special characters (except "-", ",", ".", "'") |
| `[app='lastName']`  | Only letters, no digits, no special characters (except "-", ",", ".", "'") |
| `[app='url']`       | -                                                                          |
| `[app='nip']`       | 9 digits only. No letters, no special characters.                          |
| `[app='company']`   | -                                                                          |
