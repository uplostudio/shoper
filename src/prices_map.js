(function() {
    try {
        // Check if jQuery is available
        if (typeof jQuery === 'undefined') {
            console.warn('Price updater: jQuery not found, waiting for load...');
            return;
        }

        // Namespace our debugger to avoid conflicts
        window.ShoperPriceDebugger = window.ShoperPriceDebugger || {
            secretKey: 'shoper_price_debug_2024',
            isEnabled: function() {
                try {
                    return (
                        localStorage.getItem('shoper_price_debug') === 'enabled' ||
                        new URLSearchParams(window.location.search).get('debug') === this.secretKey ||
                        window.location.hostname === 'localhost' ||
                        window.location.hostname === 'dev.your-domain.com'
                    );
                } catch (e) {
                    return false;
                }
            },
            init: function(priceData) {
                try {
                    const storedData = priceData;
                    
                    $(document).off('keydown.priceDebugger').on('keydown.priceDebugger', (e) => {
                        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                            if (this.isEnabled()) {
                                this.showData(storedData);
                            }
                        }
                    });

                    if (this.isEnabled()) {
                        this.showData(storedData);
                    }
                } catch (e) {
                    console.warn('Price debugger initialization failed:', e);
                }
            },
            showData: function(data) {
                try {
                    console.group('Price Data Overview');
                    console.table(data);
                    console.groupEnd();
                } catch (e) {
                    console.warn('Failed to show debug data:', e);
                }
            },
            generateMarkdownTable: function(priceData) {
                try {
                    let markdown = `| Plan Type | Price Type | Data Field Attribute | Value |
|-----------|------------|---------------------|--------|
`;
                    priceData.forEach(entry => {
                        markdown += `| ${entry.plan} | ${entry.priceType} | \`${entry.selector}\` | ${entry.value} |\n`;
                    });
                    return markdown;
                } catch (e) {
                    return 'Error generating markdown table';
                }
            }
        };

        function getNestedValue(obj, path) {
            try {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj);
            } catch (e) {
                return null;
            }
        }

        function formatPrice(price, isDiscount = false) {
            try {
                if (!price || isNaN(price)) return isDiscount ? '0 %' : '0 zł';
                const formattedPrice = parseFloat(price).toFixed(2);
                const numberPart = formattedPrice.endsWith('.00') ? formattedPrice.slice(0, -3) : formattedPrice;
                return `${numberPart}${isDiscount ? ' %' : ' zł'}`;
            } catch (e) {
                return isDiscount ? '0 %' : '0 zł';
            }
        }

        function updatePriceElement(selector, value, isDiscount = false) {
            try {
                const element = $(selector);
                if (element.length && value) {
                    element.text(formatPrice(value, isDiscount));
                }
                return { selector, value: value ? formatPrice(value, isDiscount) : '0' };
            } catch (e) {
                return { selector, value: isDiscount ? '0 %' : '0 zł' };
            }
        }

        function updatePrices(data) {
            try {
                if (!data || typeof data !== 'object') {
                    console.warn('Price updater: Invalid data received');
                    return;
                }

                const plans = ['standard', 'premium', 'standard-plus', 'enterprise'];
                const isPromoActive = getNestedValue(data, 'promotion.active') === 1;
                let priceData = [];
                
                plans.forEach(plan => {
                    try {
                        const regularPrices = {
                            monthly: {
                                net: getNestedValue(data, `price.${plan}.12.month.net`),
                                gross: getNestedValue(data, `price.${plan}.12.month.gross`)
                            },
                            yearly: {
                                net: getNestedValue(data, `price.${plan}.12.year.net`),
                                gross: getNestedValue(data, `price.${plan}.12.year.gross`)
                            },
                            single: {
                                net: getNestedValue(data, `price.${plan}.1.net`),
                                gross: getNestedValue(data, `price.${plan}.1.gross`)
                            }
                        };

                        const promoPrices = isPromoActive ? {
                            monthly: {
                                net: getNestedValue(data, `promotion.price.${plan}.12.month.net`),
                                gross: getNestedValue(data, `promotion.price.${plan}.12.month.gross`)
                            },
                            yearly: {
                                net: getNestedValue(data, `promotion.price.${plan}.12.year.net`),
                                gross: getNestedValue(data, `promotion.price.${plan}.12.year.gross`)
                            }
                        } : null;

                        ['monthly', 'yearly', 'single'].forEach(period => {
                            ['net', 'gross'].forEach(priceType => {
                                const value = period === 'single' ? 
                                    regularPrices[period][priceType] : 
                                    regularPrices[period][priceType];
                                const selector = `data-field="${plan}-${period}-${priceType}"`;
                                const result = updatePriceElement(`[${selector}]`, value);
                                priceData.push({
                                    plan: plan.charAt(0).toUpperCase() + plan.slice(1),
                                    priceType: `Regular ${period.charAt(0).toUpperCase() + period.slice(1)} ${priceType.toUpperCase()}`,
                                    selector: selector,
                                    value: result.value
                                });
                            });
                        });

                        if (isPromoActive && promoPrices) {
                            ['monthly', 'yearly'].forEach(period => {
                                ['net', 'gross'].forEach(priceType => {
                                    const value = promoPrices[period][priceType];
                                    const selector = `data-field="${plan}-promo-${period}-${priceType}"`;
                                    const result = updatePriceElement(`[${selector}]`, value);
                                    priceData.push({
                                        plan: plan.charAt(0).toUpperCase() + plan.slice(1),
                                        priceType: `Promo ${period.charAt(0).toUpperCase() + period.slice(1)} ${priceType.toUpperCase()}`,
                                        selector: selector,
                                        value: result.value
                                    });
                                });
                            });

                            $(`.${plan}-promo-price`).show();
                            $(`.${plan}-regular-price`).addClass('strikethrough');
                        } else {
                            $(`.${plan}-promo-price`).hide();
                            $(`.${plan}-regular-price`).removeClass('strikethrough');
                        }

                        const regularDiscount = getNestedValue(data, `price.${plan}.discount`);
                        const promoDiscount = isPromoActive ? getNestedValue(data, `promotion.price.${plan}.discount`) : null;
                        
                        const regularDiscountResult = updatePriceElement(`[data-field="${plan}-regular-discount"]`, regularDiscount, true);
                        priceData.push({
                            plan: plan.charAt(0).toUpperCase() + plan.slice(1),
                            priceType: 'Regular Discount',
                            selector: `data-field="${plan}-regular-discount"`,
                            value: regularDiscountResult.value
                        });

                        if (isPromoActive) {
                            const promoDiscountResult = updatePriceElement(`[data-field="${plan}-promo-discount"]`, promoDiscount, true);
                            priceData.push({
                                plan: plan.charAt(0).toUpperCase() + plan.slice(1),
                                priceType: 'Promo Discount',
                                selector: `data-field="${plan}-promo-discount"`,
                                value: promoDiscountResult.value
                            });
                        }
                    } catch (e) {
                        console.warn(`Price updater: Error processing plan ${plan}:`, e);
                    }
                });

                window.ShoperPriceDebugger.init(priceData);
            } catch (e) {
                console.warn('Price updater: Error in main update function:', e);
            }
        }

        // Wait for DOM ready
        $(function() {
            try {
                $.ajax({
                    url: 'https://backend.webflow.prod.shoper.cloud',
                    method: 'GET',
                    data: {
                        action: 'get_prices_list'
                    },
                    success: function(response) {
                        updatePrices(response);
                    },
                    error: function(xhr, status, error) {
                        console.warn('Price updater: Error fetching prices:', error);
                    }
                });
            } catch (e) {
                console.warn('Price updater: Failed to initialize:', e);
            }
        });
    } catch (e) {
        console.warn('Price updater: Critical error:', e);
    }
})();
