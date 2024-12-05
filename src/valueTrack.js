const PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "adgroup",
    'utm_term'
];

//?utm_source=TestMM1&utm_medium=TestMM2&utm_campaign=TestMM3&utm_content=Test4&utm_adgroup=TestMM5&utm_term=Test6
const VALUE_TRACK_KEY = "adwords";
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

window.addEventListener("DOMContentLoaded", () => {
    // Main logic execution
    const queryParams = getQueryParams();
    if (Object.keys(queryParams).length > 0) {
        storeParams(queryParams);
    }
    checkExpiry();
});

// Helper function to get query parameters from the URL
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParams = {};

    PARAMS.forEach((param) => {
        if (urlParams.has(param)) {
            queryParams[param] = urlParams.get(param);
        }
    });

    return queryParams;
}

function storeParams(params) {
    const data = {
        ...params,
        timestamp: new Date().getTime(),
    };
    localStorage.setItem(VALUE_TRACK_KEY, JSON.stringify(data));
}

function checkExpiry() {
    const data = localStorage.getItem(VALUE_TRACK_KEY);
    if (data) {
        const parsedData = JSON.parse(data);
        const currentTime = new Date().getTime();
        if (currentTime - parsedData.timestamp > NINETY_DAYS_MS) {
            localStorage.removeItem(VALUE_TRACK_KEY);
        } else {
            setHiddenInputs(data);
        }
    }
}

function setHiddenInputs(data) {
    data = JSON.parse(data);
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (PARAMS.includes(key)) {
                document.querySelectorAll("form:not(#changelog-filter)").forEach(function(item, index) {
                    item.insertAdjacentHTML(
                        "beforeend",
                        `<input data-name="${VALUE_TRACK_KEY}[${key}]" type="hidden" name="${VALUE_TRACK_KEY}[${key}]" value="${data[key]}"/>`
                    );
                });
            }
        }
    }
}