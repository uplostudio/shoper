# Shoper Web JS

## accordion.js

* Responsibility: Creating Accordions on the page
* Added: Globally
* Requires: 
Adding in the footer
```js
(new Accordion({
    accordionId: 'accordionId',
    style: false,
    oneOpen: true
}).create());
```

## animations.js

* Responsibility: Webflow Interactions
* Added: Globally

## campaign.js

* Responsibility: API Connection for setting consultation Form on Campaign pages
* Added: Globally
* Requires:
1. Button with class ```.is-cons-popup``` to open popup
2. Symbol ```modal_campaign```
3. Form ```[app='campaign']```
4. Inputs:
```[app='email_campaign']```
```[app='phone_campaign']```
```[app='url_campaign']```
5. Adding in the footer one of campaign actions: ```send_sc_offer``` ```send_mail``` ```send_mail_allegro```
```js
document.querySelector("[app='campaign']").setAttribute("action", "send_sc_offer");
```

## contact.js

* Responsibility: API Connection for Contact Form
* Added: Contact Page
* Requires:
1. Form ```[app='send_contact']```
2. Inputs:
```[app='email_campaign']```
```[app='phone_campaign']```
```[app='url_campaign']```
```[app='subject_contact']```
```[app='body_contact']```
3. Adding in the footer script
```js
<script src="https://shoper-web.netlify.io/contact.js"></script>
```

## login.js

* Responsibility: API Connection for Login Form
* Added: Globally
* Requires:
1. Button with class ```.is-login-popup``` to open popup
2. Symbol ```modal_login_and_trialstep1```
3. Form ```[app='login']```
4. Inputs:
```[app='host']```
5. Adding in the footer text which will appear in Modal/Popup
```js
document.querySelector("[app='modal_login_type']").innerHTML = "kampanię";
```
6. Adding in the footer one of login actions: ```get_campaign``` ```get_inpost``` ```get_payments_address``` ```get_admin```
```js
document.querySelector("[app='login']").setAttribute("action", "get_campaign");
```
