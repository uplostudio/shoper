import { OPTIONS } from "./constants";

const condition = () => true;
 
const initialize = () => {
    OPTIONS.fields.forEach(function (field) {
        setParam(field);
    });
}

const getUrlParam = (param) => {
    var match;

    match = RegExp('[?&]' + param + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const setParam = (param) => {
    var x;

    if (x = getUrlParam(param)) {
        localStorage.setItem(param, x);
    }
}

 
export default {
    condition,
    initialize
};