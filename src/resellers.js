$(document).ready(function() {
    function updateResellerItem($item, partner) {
        $item.attr('data-reseller-id', partner.id);
        $item.attr('href', '/lista-partnerow?partner=' + partner.id);
        $item.find('[data-element="reseller-logo"]').attr('src', partner.logo || '');
        $item.find('[data-element="reseller-name"]').text(partner.name || '');
        $item.find('[data-element="reseller-city"]').text(partner.city || '');

        const $categoriesWrapper = $item.find('[data-element="reseller-categories"]');
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

        const $erpsWrapper = $item.find('[data-element="reseller-erps"]');
        $erpsWrapper.empty();
        (partner.erps || []).forEach(erp => {
            $erpsWrapper.append($('<div>').text(erp));
        });

        const $statusWrapper = $item.find('[data-element="reseller-status"]');
        $statusWrapper.empty();
        if (partner.partner_status) {
            $statusWrapper.append($('<div>').text(partner.partner_status));
        }

        // Badges section handling
        const $badgesSection = $item.find('[data-element="badges-section"]');
        const hasBadges = partner.partner_badges && partner.partner_badges.length > 0;
        const hasStatus = partner.partner_status && partner.partner_status.length > 0;

        if (!hasBadges && !hasStatus) {
            if ($badgesSection.length) {
                $badgesSection.remove();
            }
        } else {
            let $workingBadgesSection = $badgesSection;
            if (!$badgesSection.length) {
                $workingBadgesSection = $('<div>').attr('data-element', 'badges-section').attr('class', 'badges-section');
                $item.append($workingBadgesSection);
            }

            let $badgesWrapper = $workingBadgesSection.find('[data-element="reseller-badges-wrapper"]');
            if (!$badgesWrapper.length) {
                $badgesWrapper = $('<div>').attr('data-element', 'reseller-badges-wrapper');
                $workingBadgesSection.append($badgesWrapper);
            }

            $badgesWrapper.empty();

            if (hasStatus) {
                const statusUrl = `https://dcsaascdn.net/shoperpl/partner/status/${partner.partner_status.toLowerCase().replace(/\s+/g, '_')}.png`;
                const $status = $('<img>')
                    .attr('src', statusUrl)
                    .attr('alt', partner.partner_status)
                    .attr('title', partner.partner_status)
                    .attr('loading', 'lazy')
                    .addClass('reseller_box-badge');
                $badgesWrapper.append($status);
            }

            if (hasBadges) {
                partner.partner_badges.forEach(badge => {
                    const badgeUrl = `https://dcsaascdn.net/shoperpl/partner/badge/${badge.toLowerCase().replace(/\s+/g, '_')}.png`;
                    const $badge = $('<img>')
                        .attr('src', badgeUrl)
                        .attr('alt', badge)
                        .attr('title', badge)
                        .attr('loading', 'lazy')
                        .addClass('reseller_box-badge');
                    $badgesWrapper.append($badge);
                });
            }
        }
    }

    function populateFilterList(wrapperSelector, items, itemType) {
        const $wrapper = $(wrapperSelector);
        const $template = $wrapper.children('.filters2_item').first().clone();
        $wrapper.empty();

        const uniqueItems = [...new Set(items)];
        const sortedItems = uniqueItems.sort((a, b) => a.localeCompare(b, undefined, {
            sensitivity: 'base'
        }));

        sortedItems.forEach((item, index) => {
            const $newItem = $template.clone();
            const itemId = `${itemType}-${index}`;

            const $checkbox = $('<input>').attr('type', 'checkbox').attr('id', itemId).addClass('new__form-input is-checkbox');

            const $label = $('<label>').attr('for', itemId).addClass('new_checkbox-label').text(item);

            $newItem.empty().append($checkbox, $label);
            $wrapper.append($newItem);
        });
    }

    function updateTags() {
        const $tagTemplate = $('[data-element="tag-template"]');
        if ($tagTemplate.length === 0) {
            return;
        }

        const $tagContainer = $tagTemplate.parent();

        $tagContainer.children().not($tagTemplate).remove();

        let tagCount = 0;

        $('[data-element="list-zakres"], [data-element="list-specialization"], [data-element="list-status"]').find('input:checked').each(function() {
            const labelText = $(this).next('label').text();
            addTag(labelText, $tagTemplate, $tagContainer, $(this));
            tagCount++;
        });

        const searchTerm = $('input[data-name="search"]').val().trim();
        if (searchTerm) {
            addTag(searchTerm, $tagTemplate, $tagContainer, null, true);
            tagCount++;
        }

        if (tagCount > 0) {
            $tagContainer.children().not($tagTemplate).removeClass('hide');
            $tagContainer.removeClass('hide');
        } else {
            $tagContainer.children().addClass('hide');
            $tagContainer.addClass('hide');
        }

        $tagTemplate.addClass('hide');
    }

    function addTag(text, $template, $container, $checkbox, isSearchTag = false) {
        const existingTag = $container.children().filter(function() {
            return $(this).find('[data-element="tag-text"]').text() === text;
        });

        if (existingTag.length > 0) {
            return;
        }

        const $newTag = $template.clone();
        $newTag.removeAttr('data-element');
        $newTag.find('[data-element="tag-text"]').text(text);
        if ($checkbox) {
            $newTag.data('checkbox', $checkbox);
        }
        if (isSearchTag) {
            $newTag.data('isSearchTag', true);
        }
        $container.append($newTag);

        $newTag.on('click', function() {
            removeTag($(this));
        });
    }

    function removeTag($tag) {
        const isSearchTag = $tag.data('isSearchTag');
        if (isSearchTag) {
            $('input[data-name="search"]').val('').trigger('input');
        } else {
            const $checkbox = $tag.data('checkbox');
            if ($checkbox) {
                $checkbox.prop('checked', false).trigger('change');
            }
        }
        $tag.remove();
        filterResellers();
    }

    function updateURLParameters() {
        const params = new URLSearchParams();
        
        const selectedCategories = $('[data-element="list-zakres"] input:checked').map(function() {
            return $(this).next('label').text();
        }).get();
        
        if (selectedCategories.length > 0) {
            params.set('zakres-uslug', selectedCategories.join(','));
        }
        
        const selectedBadges = $('[data-element="list-specialization"] input:checked').map(function() {
            return $(this).next('label').text();
        }).get();
        
        if (selectedBadges.length > 0) {
            params.set('specjalizacja', selectedBadges.join(','));
        }
        
        const selectedStatuses = $('[data-element="list-status"] input:checked').map(function() {
            return $(this).next('label').text();
        }).get();
        
        if (selectedStatuses.length > 0) {
            params.set('status', selectedStatuses.join(','));
        }
        
        const searchTerm = $('input[data-name="search"]').val().trim();
        if (searchTerm) {
            params.set('search', searchTerm);
        }
        
        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.pushState({}, '', newURL);
    }

    function loadFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('zakres-uslug')) {
            const categories = params.get('zakres-uslug').split(',');
            categories.forEach(category => {
                $('[data-element="list-zakres"] label').filter(function() {
                    return $(this).text() === category;
                }).prev('input').prop('checked', true);
            });
        }
        
        if (params.has('specjalizacja')) {
            const badges = params.get('specjalizacja').split(',');
            badges.forEach(badge => {
                $('[data-element="list-specialization"] label').filter(function() {
                    return $(this).text() === badge;
                }).prev('input').prop('checked', true);
            });
        }
        
        if (params.has('status')) {
            const statuses = params.get('status').split(',');
            statuses.forEach(status => {
                $('[data-element="list-status"] label').filter(function() {
                    return $(this).text() === status;
                }).prev('input').prop('checked', true);
            });
        }
        
        if (params.has('search')) {
            $('input[data-name="search"]').val(params.get('search'));
        }
    }

    let debounceTimer;
    function debounce(func, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    }

    function filterResellers() {
        const selectedCategories = $('[data-element="list-zakres"] input:checked').map(function() {
            return $(this).next('label').text();
        }).get();

        const selectedBadges = $('[data-element="list-specialization"] input:checked').map(function() {
            return $(this).next('label').text();
        }).get();

        const selectedStatuses = $('[data-element="list-status"] input:checked').map(function() {
            return $(this).next('label').text();
        }).get();

        const searchTerm = $('input[data-name="search"]').val().toLowerCase();

        $('[data-element="reseller-item"]').each(function() {
            const $item = $(this);
            const categories = $item.find('[data-element="reseller-categories"] .category-item span:last-child').map(function() {
                return $(this).text();
            }).get();

            const badges = $item.find('[data-element="reseller-badges-wrapper"] img').map(function() {
                return $(this).attr('alt');
            }).get();

            const status = $item.find('[data-element="reseller-status"] div').text();

            const name = $item.find('[data-element="reseller-name"]').text().toLowerCase();

            const matchesCategories = selectedCategories.length === 0 || selectedCategories.some(cat => categories.includes(cat));
            const matchesBadges = selectedBadges.length === 0 || selectedBadges.some(badge => badges.includes(badge));
            const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(status);
            const matchesSearch = searchTerm === '' || name.includes(searchTerm);

            if (matchesCategories && matchesBadges && matchesStatus && matchesSearch) {
                $item.show();
            } else {
                $item.hide();
            }
        });

        updateTags();
        updateURLParameters();
    }

    function fetchResellerData() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://backend.webflow.prod.shoper.cloud/?action=get_partners',
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    const $wrapper = $('[data-element="resellers-list"]');
                    const $template = $wrapper.children('[data-element="reseller-item"]').first();
    
                    $wrapper.children('[data-element="reseller-item"]').not(':first').remove();
    
                    if (response && response.status === 1 && Array.isArray(response.partners)) {
                        const allCategories = [];
                        const allBadges = [];
                        const allStatuses = [];
    
                        response.partners.forEach((partner, index) => {
                            const $resellerItem = index === 0 ? $template : $template.clone();
                            if (index !== 0) {
                                $wrapper.append($resellerItem);
                            }
                            updateResellerItem($resellerItem, partner);
                            $resellerItem.show();
    
                            allCategories.push(...(partner.categories || []));
                            allBadges.push(...(partner.partner_badges || []));
                            if (partner.partner_status)
                                allStatuses.push(partner.partner_status);
                        });
    
                        populateFilterList('[data-element="list-zakres"]', allCategories, 'category');
                        populateFilterList('[data-element="list-specialization"]', allBadges, 'badge');
                        populateFilterList('[data-element="list-status"]', allStatuses, 'status');
    
                        if (response.partners.length === 0) {
                            $template.hide();
                        }
                    } else {
                        $template.hide();
                    }
                    
                    $("[data-field='loader']").remove();
                    
                    resolve();
                },
                error: function() {
                    $('[data-element="resellers-list"]').children('[data-element="reseller-item"]').hide();
                    reject();
                }
            });
        });
    }    

    // Event handlers
    $('[data-element="list-zakres"], [data-element="list-specialization"], [data-element="list-status"]').on('change', 'input[type="checkbox"]', function() {
        filterResellers();
    });

    $('input[data-name="search"]').on('input', function() {
        debounce(filterResellers, 150);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        loadFiltersFromURL();
        filterResellers();
    });

    // Initial load
    fetchResellerData().then(() => {
        loadFiltersFromURL();
        filterResellers();
    });
});
