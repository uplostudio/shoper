# Shoper Web JS

## accordion.js

Responsible for: Creating Accordions on the page
Added: Globally
Requires: 
Adding in the footer
```js
(new Accordion({
    accordionId: 'accordionId',
    style: false,
    oneOpen: true
}).create());
```


## animations.js

Responsible for: Webflow interactions
Added: Globally

## campaign.js

Responsilbe for: API Connection for setting consultation on campaigns page
Added: Globally

Requires:
Button with class .is-cons-popup to open popup
Symbol "modal_campaign"
Form [app='campaign']
Inputs:
[app='email_campaign']
[app='phone_campaign']
[app='url_campaign']


