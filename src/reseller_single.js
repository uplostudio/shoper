$(document).ready(function() {
    function getResellerId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('partner');
    }

    function createBadgeImages(partnerStatus, partnerBadges) {
        const $badgesSection = $('[data-element="badges-section"]');
        const $badgesWrapper = $('[data-element="reseller-badges-wrapper"]');
        $badgesWrapper.empty();

        function createImageUrl(type, text) {
            const baseUrl = 'https://dcsaascdn.net/shoperpl/partner/';
            const formattedText = text.toLowerCase().replace(/\s+/g, '_');
            return `${baseUrl}${type}/${formattedText}.png`;
        }
        
        if (!partnerStatus && (!partnerBadges || partnerBadges.length === 0)) {
            $badgesSection.remove();
            return;
        }

        if (partnerStatus) {
            const $statusImg = $('<img>')
                .addClass('reseller_box-badge')
                .attr('src', createImageUrl('status', partnerStatus))
                .attr('alt', partnerStatus);
            $badgesWrapper.append($statusImg);
        }

        partnerBadges.forEach(badge => {
            const $badgeImg = $('<img>')
                .addClass('reseller_box-badge')
                .attr('src', createImageUrl('badge', badge))
                .attr('alt', badge);
            $badgesWrapper.append($badgeImg);
        });
    }

    function createExampleImages(screens) {
        const $examplesWrapper = $('[data-element="reseller-examples-wrapper"]');
        $examplesWrapper.empty();

        screens.forEach(screen => {
            const $imageItem = $('<div>').addClass('partner_image-item');
            const $img = $('<img>')
                .attr('src', screen.thumbnail)
                .attr('alt', 'Partner example')
                .css('cursor', 'pointer');

            $img.on('click', function() {
                window.open(screen.full, '_blank');
            });

            $imageItem.append($img);
            $examplesWrapper.append($imageItem);
        });
    }

    function updateResellerDetails(partner) {
        $('[data-element="reseller-logo"]').attr('src', partner.logo || '');
        $('[data-element="reseller-name"]').text(partner.name || '');
        $('[data-element="reseller-city"]').text(partner.city || '');
        $('[data-element="reseller-description"]').html(partner.description || '');

        document.title = `${partner.name} - Shoper Partner`;

        // Update form header
        $('[data-element="form-header"]').text(`Skontaktuj się z partnerem ${partner.name}`);

        // Add hidden input to the form with partner's email
        const $resellerForm = $('#reseller_form');
        if ($resellerForm.length) {
            $resellerForm.append(
                $('<input>')
                    .attr('type', 'hidden')
                    .attr('name', 'reseller_email')
                    .val(partner.email)
            );
        }

        const $categoriesWrapper = $('[data-element="reseller-categories"]');
        $categoriesWrapper.empty();
        
        const tickSvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.0001 10.7799L3.2201 7.9999L2.27344 8.9399L6.0001 12.6666L14.0001 4.66656L13.0601 3.72656L6.0001 10.7799Z" fill="#03081C"/></svg>';

        (partner.categories || []).forEach(category => {
            const $categoryDiv = $('<div>').addClass('category-item').css({
                display: 'flex',
                alignItems: 'center',
            });
            
            const $iconSpan = $('<span>').html(tickSvg).css({
                marginRight: '8px',
                flexShrink: 0
            });
            
            const $textSpan = $('<span>').text(category);
            
            $categoryDiv.append($iconSpan, $textSpan);
            $categoriesWrapper.append($categoryDiv);
        });

        const $erpsWrapper = $('[data-element="reseller-erps"]');
        $erpsWrapper.empty();
        (partner.erps || []).forEach(erp => {
            $erpsWrapper.append($('<div>').text(erp));
        });

        const $statusWrapper = $('[data-element="reseller-status"]');
        $statusWrapper.empty();
        if (partner.partner_status) {
            $statusWrapper.append($('<div>').text(partner.partner_status));
        }

        $('[data-element="reseller-address-line-1"]').text(partner.address_line_1 || '');
        $('[data-element="reseller-address-line-2"]').text(partner.address_line_2 || '');
        $('[data-element="reseller-phone"]').text(partner.phone || '');
        $('[data-element="reseller-email"]').text(partner.email || '');

        // Create example images
        if (partner.screens && partner.screens.length > 0) {
            createExampleImages(partner.screens);
        }

        // Create badge images
        createBadgeImages(partner.partner_status, partner.partner_badges || []);
    }

    function fetchResellerData(resellerId) {
        $.ajax({
            url: 'https://backend.webflow.prod.shoper.cloud/',
            method: 'POST',
            data: {
                action: 'get_partner',
                partner: resellerId
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function(response) {
                if (response && response.status === 1 && response.partner) {
                    updateResellerDetails(response.partner);
                } else {
                    console.error('Invalid response or partner data not found');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching reseller data:', error);
            },
            complete: function() {
                $('[data-element="partner-overview"]').removeClass('is-loading');
            }
        });
    }

    const resellerId = getResellerId();
    if (resellerId) {
        fetchResellerData(resellerId);
    } else {
        console.error('Reseller ID not found in URL');
    }
});
