let urlSearchParams = new URLSearchParams(window.location.search);
let tagAffiliate = urlSearchParams.get('afiliant') || "";
let shoperAffiliate;

// When URL addres has parametr afiliant - save to LS tag ID

if ( tagAffiliate ) {
    var expirationDate = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
    var referer = document.referrer;

    shoperAffiliate = {
        tag: tagAffiliate,
        expirationDate: expirationDate
    }

    if ( referer ) {
        shoperAffiliate.referer = referer;
    }

    shoperAffiliate = btoa(JSON.stringify(shoperAffiliate));
    localStorage.setItem("shoper_affiliate", shoperAffiliate);
}

// Get shoper_affiliate from LS
shoperAffiliate = localStorage.getItem("shoper_affiliate");

if ( shoperAffiliate ) {
    let shoperAffiliateDecode = JSON.parse(atob(shoperAffiliate));

    // Remove when expirationDate is < than current time
    if ( shoperAffiliateDecode.expirationDate < Date.now() ) {
        localStorage.removeItem("shoper_affiliate");
    } else {
        // Add affiliate date to form create_trial_step1
        let forms = document.querySelectorAll('#create_trial_step1');
        forms.forEach( ( item, index ) => {
            item.setAttribute( 'data-affiliant', shoperAffiliate);
        });
    }
}