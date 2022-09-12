import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/name/';
const QUERY_FILTRES = 'fields=name,capital,population,flags,languages';

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryCard = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
  const searchName = e.target.value.trim();

  if (!searchName) {
    return;
  }

  fetchCountries(searchName).then(showResultOfSearch).catch(showErrorOfSearch);
}

function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}?${QUERY_FILTRES}`).then(resp => {
    if (!resp.ok) {
      throw new Error();
    }
    return resp.json();
  });
}

function createCountryItems(items) {
  return items
    .map(({ name: { official: officialName }, flags: { svg: imgFlag } }) => {
      return `
        <li class="country-item">
            <img
                class="country-flag"
                src="${imgFlag}" 
                alt="Flag of ${officialName}" 
            />
            <h1 class="country-name">${officialName}</h1>
        </li>
        `;
    })
    .join('');
}

function createCountryCard(item) {
  return item
    .map(
      ({
        flags: { svg: imgFlag },
        name: { official: officialName },
        capital,
        population,
        languages,
      }) => {
        return `
        <div class="country">
            <img
                class="country-flag"
                src="${imgFlag}"
                alt="Flag of ${officialName}" 
            />
            <h1 class="country-name">${officialName}</h1>
        </div>
        <p class="country-capital">Capital: ${capital}</p>
        <p class="country-population">Population: ${population}</p>
        <p class="country-languages">Languages: ${languages}</p>
        `;
      }
    )
    .join('');
}

function showResultOfSearch(resp) {
  if (resp.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (resp.length > 1) {
    return (countryList.innerHTML = createCountryItems(resp));
  }

  return (countryCard.innerHTML = createCountryCard(resp));
}

function showErrorOfSearch() {
  return Notify.failure('Oops, there is no country with that name');
}
