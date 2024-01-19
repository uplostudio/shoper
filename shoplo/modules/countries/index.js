import { COUNTRIES } from "./constansts";

const countriesFields = document.querySelectorAll('.js-landing-countries');
const condition = () => countriesFields.length > 0;
 
const initialize = () => {
    let optionListCountries = createElementsWithCountries( COUNTRIES );

    countriesFields.forEach( ( countriesField, index ) => {
        countriesField.insertAdjacentHTML('beforeend',optionListCountries );
    } );
}

const createElementsWithCountries = ( countries ) => {
    let optionListCountries = "";
    countries.forEach( ( item, index ) => {
        optionListCountries += `<option value="${item.code}" ${item.name_pl == "Polska" ? "selected" : ''}>${item.name_pl}</option>`;
    });

    return optionListCountries;
};

export default {
    condition,
    initialize
};